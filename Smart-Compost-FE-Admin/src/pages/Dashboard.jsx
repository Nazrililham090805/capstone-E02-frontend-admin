import React, { useEffect, useState, useCallback, useRef } from 'react';
import api, { endpoints } from '../services/api';
import { Navigate } from 'react-router-dom';
import LatestReading from '../components/LatestReading';
import DataCard from '../components/DataCard';
import AnalysisHistory from '../components/AnalysisHistory';

const PAGE_LIMIT = 10;

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

  // guard ref to avoid concurrent requests and keep fetchRecords stable
  const recordsLoadingRef = useRef(false);

  // changed: parse response with { data, meta } shape
  const fetchRecords = useCallback(async (page = 1, { append = false } = {}) => {
    if (recordsLoadingRef.current) return;
    recordsLoadingRef.current = true;
    setRecordsLoading(true);

    try {
      const resp = await api.get(endpoints.compost.getRecordsPage(page, PAGE_LIMIT));
      const body = resp?.data ?? {};
      const pageData = body.data ?? [];
      const meta = body.meta ?? {};

      // update list
      if (append) {
        setRecords(prev => [...prev, ...pageData]);
      } else {
        setRecords(pageData);
      }

      // pagination from meta (fallback to previous logic)
      const totalPages = Number(meta.totalPages ?? Math.ceil((meta.total ?? pageData.length) / PAGE_LIMIT));
      const currentPage = Number(meta.page ?? page);
      const hasNext = meta.hasNext ?? (currentPage < totalPages);

      setRecordsTotalPages(totalPages);
      setRecordsPage(currentPage);
      setRecordsHasMore(Boolean(hasNext));
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      recordsLoadingRef.current = false;
      setRecordsLoading(false);
    }
  }, []); // stable

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestResp, statsResp] = await Promise.all([
          api.get(endpoints.compost.getLatest),
          api.get(endpoints.compost.getStats)
        ]);

        setLatestReadingData(latestResp?.data ?? {});
        const s = statsResp?.data ?? {};
        setStats({
          total: Number(s.total_kompos ?? s.total ?? 0),
          sesuai: Number(s.sesuai_standar ?? s.compliant ?? 0),
          tidakSesuai: Number(s.tidak_sesuai_standar ?? s.notCompliant ?? 0)
        });
      } catch (error) {
        if (error.response?.status === 401) localStorage.removeItem('token');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // initial load: replace records (not append)
    fetchRecords(1, { append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load more should append
  const handleLoadMoreRecords = () => {
    if (recordsLoading || !recordsHasMore) return;
    fetchRecords(recordsPage + 1, { append: true });
  };

  // page click: replace with selected page (not append)
  const handleChangePage = (page) => {
    if (page === recordsPage) return;
    fetchRecords(page, { append: false });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Smart Compost Analyzer</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <LatestReading
              title="Pembacaan Terbaru"
              data={latestReadingData}
              isStandard={false}
              isLoading={isLoading}
            />
          </div>

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
          onLoadMore={handleLoadMoreRecords}
          onChangePage={handleChangePage}
          isLoading={recordsLoading}
          hasMore={recordsHasMore}
        />
      </div>
    </div>
  );
};

export default Dashboard;
