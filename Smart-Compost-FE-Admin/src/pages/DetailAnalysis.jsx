import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import RangeSlider from '../components/RangeSlider';
import { useNavigate } from 'react-router-dom';

const DetailAnalysis = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [keterangan, setKeterangan] = useState(
    'Kompos yang diuji merupakan hasil fermentasi limbah rumah tangga berupa sisa sayuran, kulit buah, dan daun kering yang dikumpulkan dari area pengomposan di Yogyakarta. Pengambilan dilakukan pada tumpukan yang telah mengalami proses fermentasi selama 3 minggu, dengan kondisi lingkungan yang terjaga pada suhu rata-rata 28°C. Sampel ini diambil untuk mengevaluasi kualitas pH, kadar air, dan kandungan NPK guna memastikan kesesuaiannya dengan standar pupuk organik.'
  );

  const navigate = useNavigate();

  const analysisData = {
    status: 'SESUAI STANDAR',
    date: '17:29, 8 Mei 2025',
    measurements: {
      pH: '7.0',
      kadarAir: '25',
      suhu: '28',
      kadarN: '1',
      kadarP: '1',
      kadarK: '1',
    },
  };

  const sliderData = [
    {
      label: 'pH:',
      currentValue: '7.0',
      minValue: 6.0,
      maxValue: 8.0,
      standardMin: '6.80',
      standardMax: '7.49',
      unit: '',
    },
    {
      label: 'Kadar air:',
      currentValue: '25',
      minValue: 0,
      maxValue: 100,
      standardMin: null,
      standardMax: '50',
      unit: '%',
    },
    {
      label: 'Suhu:',
      currentValue: '28',
      minValue: 20,
      maxValue: 40,
      standardMin: null,
      standardMax: '30',
      unit: '°C',
    },
  ];

  const sliderDataRight = [
    {
      label: 'Kadar N:',
      currentValue: '1',
      minValue: 0,
      maxValue: 3,
      standardMin: '0.40',
      standardMax: null,
      unit: '%',
    },
    {
      label: 'Kadar P:',
      currentValue: '1',
      minValue: 0,
      maxValue: 3,
      standardMin: '0.10',
      standardMax: null,
      unit: '%',
    },
    {
      label: 'Kadar K:',
      currentValue: '1',
      minValue: 0,
      maxValue: 3,
      standardMin: '0.20',
      standardMax: null,
      unit: '%',
    },
  ];

  // Fungsi format agar "pH" tidak diubah menjadi "PH"
  const formatKey = (key) => {
    const specialCases = ['pH', 'DO', 'EC']; // daftar khusus
    if (specialCases.includes(key)) return key;
    // ubah camelCase menjadi "Kadar Air", dll
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Keterangan berhasil diperbarui!');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Detail Hasil Analisis</h1>

        {/* Hasil Pengukuran Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-800">HASIL PENGUKURAN</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div>
                <div className="mb-6">
                  <p className="text-green-600 font-semibold text-lg mb-1">
                    {analysisData.status}
                  </p>
                  <p className="text-xs text-gray-500">{analysisData.date}</p>
                </div>

                <div className="space-y-2 text-sm">
                  {Object.entries(analysisData.measurements).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="text-gray-600 w-24 text-left pr-2">
                        {formatKey(key)}
                      </span>
                      <span className="font-semibold text-gray-800">
                        : {value}
                        {key === 'suhu'
                          ? '°C'
                          : key === 'kadarAir' || key.startsWith('kadar')
                          ? '%'
                          : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Middle Column */}
              <div>
                {sliderData.map((slider, index) => (
                  <RangeSlider key={index} {...slider} />
                ))}
              </div>

              {/* Right Column */}
              <div>
                {sliderDataRight.map((slider, index) => (
                  <RangeSlider key={index} {...slider} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Keterangan Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-800">KETERANGAN</h2>
          </div>

          <div className="p-6">
            {isEditing ? (
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="w-full h-40 p-3 border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
            ) : (
              <p className="text-sm text-gray-700 leading-relaxed mb-6">{keterangan}</p>
            )}

            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={`px-6 py-2.5 border-2 ${
                isEditing
                  ? 'border-green-700 text-green-700 hover:bg-green-100'
                  : 'border-blue-800 text-blue-600 hover:bg-blue-100'
              } font-semibold rounded transition-colors text-sm`}
            >
              {isEditing ? 'SIMPAN' : 'EDIT KETERANGAN'}
            </button>
          </div>
        </div>

        {/* Button Back */}
        <div className="mt-5">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 border-2 border-red-600 text-red-700 font-semibold rounded hover:bg-red-100 transition-colors text-sm"
          >
            KEMBALI
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailAnalysis;
