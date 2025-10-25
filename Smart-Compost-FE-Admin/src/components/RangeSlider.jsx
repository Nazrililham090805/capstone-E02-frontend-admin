import React from 'react';

const RangeSlider = ({ label, currentValue, minValue, maxValue, standardMin, standardMax, unit = '' }) => {
  // Hitung posisi persentase untuk current value
  const range = maxValue - minValue;
  const currentPos = ((parseFloat(currentValue) - minValue) / range) * 100;
  
  // Hitung posisi untuk batas standar
  const standardMinPos = standardMin ? ((parseFloat(standardMin) - minValue) / range) * 100 : null;
  const standardMaxPos = standardMax ? ((parseFloat(standardMax) - minValue) / range) * 100 : null;
  
  // Tentukan apakah sesuai standar
  const isCompliant = () => {
    const val = parseFloat(currentValue);
    if (standardMin && standardMax) {
      return val >= parseFloat(standardMin) && val <= parseFloat(standardMax);
    } else if (standardMin) {
      return val >= parseFloat(standardMin);
    } else if (standardMax) {
      return val <= parseFloat(standardMax);
    }
    return true;
  };

  const compliant = isCompliant();

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      
      <div className="relative pt-8 pb-4">
        {/* Track */}
        <div className="absolute top-12 left-0 right-0 h-2 bg-gray-200 rounded-full">
          {/* Green zone (standard range) */}
          {standardMinPos !== null && standardMaxPos !== null && (
            <div 
              className="absolute h-2 bg-green-500 rounded-full"
              style={{
                left: `${standardMinPos}%`,
                width: `${standardMaxPos - standardMinPos}%`
              }}
            />
          )}
          {standardMinPos !== null && standardMaxPos === null && (
            <div 
              className="absolute h-2 bg-green-500 rounded-full"
              style={{
                left: `${standardMinPos}%`,
                width: `${100 - standardMinPos}%`
              }}
            />
          )}
          {standardMinPos === null && standardMaxPos !== null && (
            <div 
              className="absolute h-2 bg-green-500 rounded-full"
              style={{
                left: '0%',
                width: `${standardMaxPos}%`
              }}
            />
          )}
        </div>

        {/* Standard Min Marker */}
        {standardMin && (
          <div 
            className="absolute top-0"
            style={{ left: `${standardMinPos}%`, transform: 'translateX(-50%)' }}
          >
            <div className="flex flex-col items-center">
              <div className="bg-red-100 border border-red-400 text-red-600 px-2 py-1 rounded text-xs font-medium">
                {standardMin}{unit}
              </div>
              <div className="w-0.5 h-8 bg-red-400 mt-1"></div>
            </div>
          </div>
        )}

        {/* Standard Max Marker */}
        {standardMax && (
          <div 
            className="absolute top-0"
            style={{ left: `${standardMaxPos}%`, transform: 'translateX(-50%)' }}
          >
            <div className="flex flex-col items-center">
              <div className="bg-red-100 border border-red-400 text-red-600 px-2 py-1 rounded text-xs font-medium">
                {standardMax}{unit}
              </div>
              <div className="w-0.5 h-8 bg-red-400 mt-1"></div>
            </div>
          </div>
        )}

        {/* Current Value Marker */}
        <div 
          className="absolute top-0"
          style={{ left: `${currentPos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="flex flex-col items-center">
            <div className={`${compliant ? 'bg-green-500' : 'bg-red-500'} text-white px-3 py-1 rounded font-semibold text-sm`}>
              {currentValue}{unit}
            </div>
            <div className={`w-0.5 h-8 ${compliant ? 'bg-green-500' : 'bg-red-500'} mt-1`}></div>
            <div className={`w-3 h-3 ${compliant ? 'bg-green-500' : 'bg-red-500'} rounded-full mt-1`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;