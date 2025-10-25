import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

const AnalysisHistory = () => {
  const navigate =useNavigate();

  const historyData = [
    { no: 1, status: 'SESUAI STANDAR', tanggal: '5 MEI 2025', waktu: '15:28', keterangan: '-' },
    { no: 2, status: 'SESUAI STANDAR', tanggal: '5 MEI 2025', waktu: '17:29', keterangan: 'Kompos dari pak Andi' },
    { no: 3, status: 'TIDAK SESUAI', tanggal: '6 MEI 2025', waktu: '16:45', keterangan: 'Kompos dari pak Budi' },
    { no: 4, status: 'SESUAI STANDAR', tanggal: '7 MEI 2025', waktu: '13:01', keterangan: '-' },
    { no: 5, status: 'SESUAI STANDAR', tanggal: '7 MEI 2025', waktu: '14:31', keterangan: '-' },
    { no: 6, status: 'TIDAK SESUAI', tanggal: '7 MEI 2025', waktu: '17:20', keterangan: '-' },
    { no: 7, status: 'SESUAI STANDAR', tanggal: '8 MEI 2025', waktu: '17:29', keterangan: '-' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-sm font-semibold text-gray-800 mb-4">RIWAYAT ANALISIS</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-blue-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase">NO</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase">STATUS</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase">TANGGAL / WAKTU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase">KETERANGAN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {historyData.map((row) => (
              <tr key={row.no} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{row.no}</td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-semibold ${row.status === 'SESUAI STANDAR' ? 'text-green-600' : 'text-red-600'}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{`${row.tanggal} / ${row.waktu}`}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.keterangan}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => navigate ('/detail')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                    Lihat Detail <ArrowRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalysisHistory;