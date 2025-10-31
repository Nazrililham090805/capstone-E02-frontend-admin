import React, { useEffect, useState, useRef } from 'react';
import api, { endpoints } from '../services/api';
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

  // guard ref to avoid concurrent requests and keep fetchRecords stable
  const recordsLoadingRef = useRef(false);
  const fetchRecordsAttempts = useRef({}); // keyed by page
  const timersRef = useRef([]);
  const isMountedRef = useRef(true);

  // helper validator (sesuaikan shape yang diharapkan)
  const isValidStats = (s) => s && (s.total_kompos !== undefined || s.total !== undefined);
  const isValidLatest = (l) => l && Object.keys(l).length > 0;
  const isValidRecordsBody = (body) => Array.isArray(body?.data) || Array.isArray(body);

  // changed: parse response with { data, meta } shape
  async function fetchRecords(page = 1, { append = false, attempt = 1 } = {}) {
     if (recordsLoadingRef.current) return;
     recordsLoadingRef.current = true;
     setRecordsLoading(true);

     try {
       const resp = await api.get(endpoints.compost.getRecordsPage(page, PAGE_LIMIT));
       const body = resp?.data ?? {};
       if (!isValidRecordsBody(body)) {
         // retry with backoff
         if (attempt < MAX_ATTEMPTS) {
           const wait = RETRY_BASE_MS * 2 ** (attempt - 1);
          fetchRecordsAttempts.current[page] = attempt + 1;
          const t = setTimeout(() => {
            if (!isMountedRef.current) return;
            fetchRecords(page, { append, attempt: attempt + 1 });
          }, wait);
          timersRef.current.push(t);
           return;
         } else {
           console.error('Invalid records response after retries:', body);
           // fallback: set empty array to avoid infinite loading (optional)
          if (isMountedRef.current) setRecords([]);
         }
       } else {
         const pageData = Array.isArray(body?.data) ? body.data : (Array.isArray(body) ? body : []);
         const meta = body.meta ?? {};

         if (append) setRecords(prev => [...(prev || []), ...pageData]);
         else setRecords(pageData);

         const totalPages = Number(meta.totalPages ?? Math.ceil((meta.total ?? pageData.length) / PAGE_LIMIT));
         const currentPage = Number(meta.page ?? page);
         const hasNext = meta.hasNext ?? (currentPage < totalPages);

         setRecordsTotalPages(totalPages);
         setRecordsPage(currentPage);
         setRecordsHasMore(Boolean(hasNext));
       }
     } catch (err) {
       console.error('Error fetching records:', err);
       if (attempt < MAX_ATTEMPTS) {
         const wait = RETRY_BASE_MS * 2 ** (attempt - 1);
         const t = setTimeout(() => {
         if (!isMountedRef.current) return;
          fetchRecords(page, { append, attempt: attempt + 1 });
        }, wait);
        timersRef.current.push(t);
         return;
        }
     } finally {
       recordsLoadingRef.current = false;
       setRecordsLoading(false);
     }
  } // stable

  useEffect(() => {
    isMountedRef.current = true;

    const fetchData = async (attempt = 1) => {
      try {
        const [latestResp, statsResp] = await Promise.all([
          api.get(endpoints.compost.getLatest),
          api.get(endpoints.compost.getStats)
        ]);

        // debug
        console.log('[Dashboard] latestResp', latestResp);
        console.log('[Dashboard] statsResp', statsResp);

        const latest = latestResp?.data ?? latestResp ?? null;
        const s = statsResp?.data ?? statsResp ?? null;

        if (!isValidLatest(latest) || !isValidStats(s)) {
          console.warn('[Dashboard] response shape unexpected — applying tolerant fallback', { latest, s });
          // don't keep retrying just because shape differs; use what we have
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
        // keep a small retry for network errors
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
    fetchRecords(1, { append: false });

    return () => {
      isMountedRef.current = false;
      timersRef.current.forEach(t => clearTimeout(t));
      timersRef.current = [];
    };
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
