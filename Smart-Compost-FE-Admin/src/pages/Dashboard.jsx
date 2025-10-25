import React from 'react';
import LatestReading from '../components/LatestReading';
import DataCard from '../components/DataCard';
import AnalysisHistory from '../components/AnalysisHistory';

const Dashboard = () => {
  const latestReadingData = {
    'pH'        : '7.0',
    'Kadar N'   : '1 %',
    'Kadar Air' : '25 %',
    'Kadar P'   : '1 %',
    'Suhu'      : '28 °C',
    'Kadar K'   : '1 %'
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Dashboard Smart Compost Analyzer
        </h1>
        
        {/* Grid Layout - 2 Kolom (Pembacaan + Statistik) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Kolom 1 - Pembacaan Terbaru */}
          <div>
            <LatestReading 
              title="Pembacaan Terbaru"
              data={latestReadingData}
              isStandard={false}
            />
          </div>

          {/* Kolom 2 - Statistik */}
          <div className="space-y-4">
            <DataCard 
              count={15}
              label="Jumlah Analisis"
              type="total"
            />
            <DataCard 
              count={10}
              label="Sesuai Standar"
              type="compliant"
            />
            <DataCard 
              count={5}
              label="Tidak Sesuai Standar"
              type="not-compliant"
            />
          </div>
        </div>

        {/* Riwayat Analisis */}
        <AnalysisHistory />
      </div>
    </div>
  );
};

export default Dashboard;
