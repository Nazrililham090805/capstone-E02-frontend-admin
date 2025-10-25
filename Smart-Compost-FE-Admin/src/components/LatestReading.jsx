import React from 'react';
import { useNavigate } from 'react-router-dom';

const LatestReading = ({ title, data, isStandard = false }) => {
  const navigate =useNavigate();
  const isCompliant = !isStandard;
   
  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col h-full">
      <h2 className="text-sm font-semibold text-gray-800 mb-4">{title.toUpperCase()}</h2>
      
      {!isStandard && (
        <div className="mb-4">
          <p className={`${isCompliant ? 'text-sm font-semibold text-green-600' : 'text-red-600'} font-semibold text-base mb-1`}>
            {isCompliant ? 'SESUAI STANDAR' : 'TIDAK SESUAI STANDAR'}
          </p>
          <p className="text-xs text-gray-500">17:29, 8 Mei 2025</p>
        </div>
      )}

      {isStandard && (
         <p className="text-sm font-medium text-gray-700 mb-8"> (SNI 19-7030-2004)</p>

      )}

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex flex-cols text-sm">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex">
            <div className="w-20 text-gray-700 font-medium">{key}</div>
            <div className='flex text-gray-600'>: {value}</div>
          </div>
           
        ))}
      </div>

      {!isStandard && (    
      <div className="mt-8">
        <button 
        onClick={() => navigate ('/detail')}
        className="w-full py-2.5 border-2 border-blue-800 text-blue-600 font-semibold rounded hover:bg-blue-100 transition-colors text-sm">
          LIHAT DETAIL
        </button>
      </div>
      )}
    </div>
  );
};

export default LatestReading;