import React from 'react';

const RangeSlider = ({ 
  label, 
  currentValue, 
  minValue, 
  maxValue, 
  standardMin, 
  standardMax, 
  unit = '', 
  isLoading = false 
}) => {

  if (isLoading) {
    return (
      <div className="mb-6 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
        <div className="relative pt-8 pb-4">
          <div className="absolute top-12 left-0 right-0 h-2 bg-gray-200 rounded-full" />
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-6 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // ---- LOGIKA NORMAL ----
  const range = maxValue - minValue;
  const currentPos = ((parseFloat(currentValue) - minValue) / range) * 100;
  const standardMinPos = standardMin ? ((parseFloat(standardMin) - minValue) / range) * 100 : null;
  const standardMaxPos = standardMax ? ((parseFloat(standardMax) - minValue) / range) * 100 : null;

  const isCompliant = () => {
    const val = parseFloat(currentValue);
    if (standardMin && standardMax) return val >= parseFloat(standardMin) && val <= parseFloat(standardMax);
    else if (standardMin) return val >= parseFloat(standardMin);
    else if (standardMax) return val <= parseFloat(standardMax);
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
              <div className="w-0.5 h-[30px] bg-red-400 "></div>
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
              <div className="w-0.5 h-[30px] bg-red-400 "></div>
            </div>
          </div>
        )}

        {/* Current Value Marker */}
        <div 
          className="absolute top-0"
          style={{ left: `${currentPos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="flex flex-col items-center">
            <div className={`${compliant ? 'bg-green-500' : 'bg-red-500'} text-white px-3 py-1 rounded  text-sm relative`}>
              {currentValue}{unit}
              <div 
                className={`absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent ${compliant ? 'border-t-green-500' : 'border-t-red-500'}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
