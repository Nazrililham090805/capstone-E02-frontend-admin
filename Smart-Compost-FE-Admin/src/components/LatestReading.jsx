import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const LatestReading = ({ title, data, isStandard = false }) => {
  const navigate = useNavigate();
  const isCompliant = data?.kualitas === "Sesuai Standar";

  const parameters = [
    { key: 'ph', label: 'pH', unit: '' },
    { key: 'kadar_n', label: 'Kadar N', unit: ' %' },
    { key: 'kadar_air', label: 'Kadar Air', unit: ' %' },
    { key: 'kadar_p', label: 'Kadar P', unit: ' %' },
    { key: 'suhu', label: 'Suhu', unit: ' °C' },
    { key: 'kadar_k', label: 'Kadar K', unit: ' %' }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, "HH:mm, d MMM yyyy");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col h-full">
      <h2 className="text-sm font-semibold text-gray-800 mb-4">{title.toUpperCase()}</h2>
      
      {!isStandard && (
        <div className="mb-4">
          <p className={`${isCompliant ? 'text-green-600' : 'text-red-600'} font-semibold text-base mb-1`}>
            {data?.kualitas?.toUpperCase()}
          </p>
          <p className="text-xs text-gray-500">{formatDate(data?.tanggal)}</p>
        </div>
      )}

      {isStandard && (
        <p className="text-sm font-medium text-gray-700 mb-8">(SNI 19-7030-2004)</p>
      )}

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex flex-cols text-sm">
        {parameters.map(({ key, label, unit }) => (
          <div key={key} className="flex">
            <div className="w-20 text-gray-700 font-medium">{label}</div>
            <div className='flex text-gray-600'>
              : {data?.[key] ? Number(data[key]).toFixed(2) : ' '}{data?.[key] ? unit : ''}
            </div>
          </div>
        ))}
      </div>

      {!isStandard && (    
        <div className="mt-8">
          <button 
            onClick={() => navigate(`/detail/${data?.id}`)}
            className="w-full py-2.5 border-2 border-blue-800 text-blue-600 font-semibold rounded hover:bg-blue-100 transition-colors text-sm">
            LIHAT DETAIL
          </button>
        </div>
      )}
    </div>
  );
};

export default LatestReading;