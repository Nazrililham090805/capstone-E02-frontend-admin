import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// ...existing code...

const AnalysisHistory = ({ records = [], page = 1, totalPages = 1, onChangePage, isLoading = false}) => {
  const navigate = useNavigate();
  const [isChangingPage, setIsChangingPage] = useState(false);

  useEffect(() => {
    if (!isLoading) setIsChangingPage(false);
  }, [isLoading, page]);

  const handlePageClick = (p) => {
    if (!onChangePage || isLoading || p === page) return;
    setIsChangingPage(true);
    onChangePage(p);
  };

  const renderPages = () => {
    if (!onChangePage) return null;

    const MAX_INLINE = 7;
    if (totalPages <= MAX_INLINE) {
      return Array.from({ length: totalPages }).map((_, i) => {
        const p = i + 1;
        return (
          <button
            key={p}
            onClick={() => handlePageClick(p)}
            disabled={isLoading || p === page}
            className={`px-3 py-1 rounded ${p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {p}
          </button>
        );
      });
    }

    // build condensed pagination with ellipsis and dedupe
    const left = Math.max(2, page - 1);
    const right = Math.min(totalPages - 1, page + 1);
    const items = [1];

    if (left > 2) items.push('left-ellipsis');
    for (let p = left; p <= right; p++) items.push(p);
    if (right < totalPages - 1) items.push('right-ellipsis');

    items.push(totalPages);

    const uniq = [...new Set(items)];
    return uniq.map((p, idx) => {
      if (p === 'left-ellipsis' || p === 'right-ellipsis') {
        return <span key={`e-${idx}`} className="px-2">…</span>;
      }
      return (
        <button
          key={p}
          onClick={() => handlePageClick(p)}
          disabled={isLoading || p === page}
          className={`px-3 py-1 rounded ${p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          {p}
        </button>
      );
    });
  };

  const showSkeletonOnly = isChangingPage || isLoading;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-sm font-semibold text-gray-800 mb-4">RIWAYAT ANALISIS</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-blue-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase">TANGGAL / WAKTU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase">STATUS</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase">KETERANGAN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!showSkeletonOnly && records.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">Belum ada data.</td>
              </tr>
            )}

            {!showSkeletonOnly && records.map((row) => {
              const tanggal = row.tanggal ? new Date(row.tanggal) : null;
              const tanggalStr = tanggal ? tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
              const waktuStr = tanggal ? tanggal.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-';

              return (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">{`${tanggalStr} / ${waktuStr}`}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${row.kualitas === 'Sesuai Standar' ? 'text-green-600' : 'text-red-600'}`}>
                      {row.kualitas}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.keterangan ?? '-'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/detail/${row.id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                    >
                      Lihat Detail <ArrowRight size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}

            { /* show final message as a table row under last record when on last page */ }
            {!showSkeletonOnly && page >= totalPages && records.length > 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">Tidak ada data lagi.</td>
              </tr>
            )}

            {showSkeletonOnly && (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-48" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <div className="w-full flex justify-center">
          <div className="inline-flex items-center gap-4 bg-transparent">
            {/* Previous */}
            {showSkeletonOnly ? (
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            ) : (
              <button
                onClick={() => handlePageClick(Math.max(1, page - 1))}
                disabled={isLoading || page <= 1}
                className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
              >
                Previous
              </button>
            )}

            {/* Pages (center) */}
            <div className="flex items-center gap-2">
              {showSkeletonOnly ? (
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
              ) : (
                renderPages()
              )}
            </div>

            {/* Next */}
            {showSkeletonOnly ? (
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            ) : (
              <button
                onClick={() => handlePageClick(Math.min(totalPages, page + 1))}
                disabled={isLoading || page >= totalPages}
                className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
              >
                Next
              </button>
            )}
          </div>
        </div>

        <div className="mt-2 w-full text-center">
          {showSkeletonOnly ? (
            <div className="h-4 w-40 mx-auto bg-gray-200 rounded animate-pulse" />
          ) : (
            <div className="text-sm text-gray-500">
              Halaman {page} dari {totalPages}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisHistory;