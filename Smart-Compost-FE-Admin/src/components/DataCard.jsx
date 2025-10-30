import React from 'react';
import { TrendingUp, XCircle, CheckCircle, ChartNoAxesColumnDecreasing } from 'lucide-react';

const DataCard = ({ count, label, type, isLoading = false }) => {
  const getIconAndColors = () => {
    switch (type) {
      case 'total':
        return { icon: ChartNoAxesColumnDecreasing, iconBg: 'bg-blue-600', cardBg: 'bg-blue-100' };
      case 'not-compliant':
        return { icon: XCircle, iconBg: 'bg-red-500', cardBg: 'bg-red-100' };
      case 'compliant':
        return { icon: CheckCircle, iconBg: 'bg-green-500', cardBg: 'bg-green-100' };
      default:
        return { icon: TrendingUp, iconBg: 'bg-gray-500', cardBg: 'bg-gray-50' };
    }
  };

  const { icon: Icon, iconBg, cardBg } = getIconAndColors();

  if (isLoading) {
    return (
      <div className={`p-5 rounded-lg shadow ${cardBg}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full ${iconBg} animate-pulse`} />
          <div className="flex-1">
            <div className={`h-8 ${iconBg} rounded w-20 mb-2 animate-pulse`} />
            <div className={`h-4 ${iconBg} rounded w-32 animate-pulse`} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 p-5 rounded-lg shadow ${cardBg}`}>
      <div className={`${iconBg} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}>
        <Icon className="text-white" size={24} />
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-800">{String(count).padStart(2, '0')}</div>
        <div className="text-sm  font-semibold text-gray-700">{label}</div>
      </div>
    </div>
  );
};

export default DataCard;