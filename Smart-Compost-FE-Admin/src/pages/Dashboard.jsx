import React, { useEffect, useState, useRef } from 'react';
import api, { endpoints, fetchCompostRecords } from '../services/api';
import { Navigate } from 'react-router-dom';
import LatestReading from '../components/LatestReading';
import DataCard from '../components/DataCard';
import AnalysisHistory from '../components/AnalysisHistory';

const PAGE_LIMIT = 10;
const MAX_ATTEMPTS = 3;
const RETRY_BASE_MS = 400;

const Dashboard = () => {
  const [latestReadingData, setLatestReadingData] = useState({
    ph: '',
    kadar_n: '',
    kadar_air: '',
    kadar_p: '',
    suhu: '',
    kadar_k: ''
  });

  const [stats, setStats] = useState({
    total: 0,
    sesuai: 0,
    tidakSesuai: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  // records / pagination state
  const [records, setRecords] = useState([]);
  const [recordsPage, setRecordsPage] = useState(1);
  const [recordsTotalPages, setRecordsTotalPages] = useState(1);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsHasMore, setRecordsHasMore] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    bulan: '',
    status: '',
    keterangan: '',
    sort: ''
  });

  // guard ref to avoid concurrent requests
  const recordsLoadingRef = useRef(false);
  const timersRef = useRef([]);
  const isMountedRef = useRef(true);

  // helper validator
  const isValidStats = (s) => s && (s.total_kompos !== undefined || s.total !== undefined);
  const isValidLatest = (l) => l && Object.keys(l).length > 0;

  // Fungsi untuk fetch records dengan filter
  async function fetchRecords(page = 1, currentFilters = filters, attempt = 1) {
  if (recordsLoadingRef.current) return;
  recordsLoadingRef.current = true;
  setRecordsLoading(true);

try {
  const query = {
    page,
    limit: PAGE_LIMIT,
  };

  // Add filters if they exist
  if (currentFilters.bulan) query.bulan = currentFilters.bulan;
  if (currentFilters.status) query.status = currentFilters.status;
  if (currentFilters.keterangan) query.keterangan = currentFilters.keterangan;
  if (currentFilters.sort) query.sort = currentFilters.sort;

  const response = await fetchCompostRecords(query);
  const body = response; // handle kedua kemungkinan

  // ✅ Tambahkan logika adaptif di sini
  let pageData = [];
  let meta = {};

  if (Array.isArray(body)) {
    pageData = body;
  } else if (body?.data && Array.isArray(body.data)) {
    pageData = body.data;
    meta = body.meta || {};
  } else {
    // kalau gagal semua
    console.error("Invalid records response:", body);
    if (isMountedRef.current) setRecords([]);
    return;
  }

  // 🔹 Format data agar cocok dengan tabel
  const formattedData = pageData.map((item) => ({
    id: item.id,
    tanggal: item.tanggal,
    kadar_n: parseFloat(item.kadar_n),
    kadar_p: parseFloat(item.kadar_p),
    kadar_k: parseFloat(item.kadar_k),
    kadar_air: parseFloat(item.kadar_air ?? 0),
    ph: parseFloat(item.ph ?? 0),
    suhu: parseFloat(item.suhu ?? 0),
    keterangan: item.keterangan || "-",
    status: item.kualitas || "-",
  }));

  if (isMountedRef.current) {
    setRecords(formattedData);
    setRecordsTotalPages(Number(meta.totalPages ?? 1));
    setRecordsPage(Number(meta.page ?? 1));
    setRecordsHasMore(Boolean(meta.hasNext ?? false));
  }
} catch (err) {
  console.error("Error fetching records:", err);
  if (isMountedRef.current) {
    setRecords([]);
  }
} finally {
  recordsLoadingRef.current = false;
  setRecordsLoading(false);
}}

  useEffect(() => {
    isMountedRef.current = true;

    const fetchData = async (attempt = 1) => {
      try {
        const [latestResp, statsResp] = await Promise.all([
          api.get(endpoints.compost.getLatest),
          api.get(endpoints.compost.getStats)
        ]);

        const latest = latestResp?.data ?? latestResp ?? null;
        const s = statsResp?.data ?? statsResp ?? null;

        if (!isValidLatest(latest) || !isValidStats(s)) {
          console.warn('[Dashboard] response shape unexpected — applying tolerant fallback', { latest, s });
        }

        if (isMountedRef.current) {
          setLatestReadingData(latest ?? null);

          const total = s
            ? Number(s.total_kompos ?? s.total ?? s.totalCount ?? s.count ?? 0)
            : 0;
          const sesuai = s
            ? Number(s.sesuai_standar ?? s.compliant ?? s.match ?? 0)
            : 0;
          const tidakSesuai = s
            ? Number(s.tidak_sesuai_standar ?? s.notCompliant ?? s.unmatch ?? 0)
            : 0;

          setStats({ total, sesuai, tidakSesuai });
        }
      } catch (error) {
        console.error('[Dashboard] fetchData error', error);
        if (attempt < MAX_ATTEMPTS) {
          const wait = RETRY_BASE_MS * 2 ** (attempt - 1);
          const t = setTimeout(() => {
            if (!isMountedRef.current) return;
            fetchData(attempt + 1);
          }, wait);
          timersRef.current.push(t);
          return;
        }
        if (error?.response?.status === 401) localStorage.removeItem('token');
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    };

    fetchData();
    fetchRecords(1, filters);

    return () => {
      isMountedRef.current = false;
      timersRef.current.forEach(t => clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  // Handler untuk page change
  const handleChangePage = (page) => {
  if (page === recordsPage || recordsLoading) return;
  setRecordsPage(page); // <── penting, update state halaman
  fetchRecords(page, filters);
  };

  // Handler untuk filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Reset ke halaman 1 saat filter berubah
    fetchRecords(1, newFilters);
  };

  return (
    <div className="full-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Smart Compost Analyzer</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Column 1 - Pembacaan Terbaru */}
          <div>  
            <LatestReading
              title="Pembacaan Terbaru"
              data={latestReadingData}
              isStandard={false}
              isLoading={isLoading}
            />
          </div>

          {/* Column 3 - Statistics Cards */}
          <div className="space-y-4">
            <DataCard count={stats.total} label="Jumlah Analisis" type="total" isLoading={isLoading} />
            <DataCard count={stats.sesuai} label="Sesuai Standar" type="compliant" isLoading={isLoading} />
            <DataCard count={stats.tidakSesuai} label="Tidak Sesuai Standar" type="not-compliant" isLoading={isLoading} />
          </div>
        </div>

        <AnalysisHistory
          records={records}
          page={recordsPage}
          limit={PAGE_LIMIT}
          totalPages={recordsTotalPages}
          onChangePage={handleChangePage}
          onFilterChange={handleFilterChange}
          filters={filters}
          isLoading={recordsLoading}
          hasMore={recordsHasMore}
        />
      </div>
    </div>
  );
};

export default Dashboard;