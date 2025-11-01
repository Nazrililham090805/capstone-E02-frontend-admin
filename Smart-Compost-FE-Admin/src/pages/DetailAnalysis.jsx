import React, { useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import RangeSlider from '../components/RangeSlider';
import { useNavigate, useParams } from 'react-router-dom';
import api, { endpoints } from '../services/api';

const DetailAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [keterangan, setKeterangan] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchById = async () => {
      if (!id) return setIsLoading(false);
      setIsLoading(true);
      try {
        const url = endpoints?.compost?.ById(id) || `/compost/${id}`;
        const resp = await api.get(url);
        const body = resp?.data ?? resp ?? null;

        // normalize expected shape (server returns object with fields)
        const data = body?.data ?? body;

        if (!mounted) return;
        setAnalysisData(data);
        setKeterangan(data?.keterangan ?? '');
      } catch (err) {
        console.error('DetailAnalysis: fetch error', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchById();
    return () => { mounted = false; };
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      const patchUrl = endpoints?.compost?.updateById ? endpoints.compost.updateById(id) : (endpoints?.compost?.patchById ? endpoints.compost.patchById(id) : `/compost/${id}`);
      await api.patch(patchUrl, { keterangan });
      // optimistic update
      setAnalysisData(prev => prev ? { ...prev, keterangan } : prev);
      setIsEditing(false);
      alert('Keterangan berhasil diperbarui!');
    } catch (err) {
      console.error('DetailAnalysis: save error', err);
      alert('Gagal menyimpan keterangan.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      return `${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}, ${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    } catch {
      return iso;
    }
  };

  // build slider data from fetched analysisData (fallback to placeholders)
  const mm = analysisData ?? {};
  const sliderData = [
    {
      label: 'pH:',
      currentValue: mm.ph ?? '-',
      minValue: 6,
      maxValue: 8,
      standardMin: '6.80',
      standardMax: '7.49',
      unit: '',
    },
    {
      label: 'Kadar air:',
      currentValue: mm.kadar_air ?? '-',
      minValue: 40,
      maxValue: 60,
      standardMin: null,
      standardMax: '50',
      unit: '%',
    },
    {
      label: 'Suhu:',
      currentValue: mm.suhu ?? '-',
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
      currentValue: mm.kadar_n ?? '-',
      minValue: 0,
      maxValue: 2,
      standardMin: '0.40',
      standardMax: null,
      unit: '%',
    },
    {
      label: 'Kadar P:',
      currentValue: mm.kadar_p ?? '-',
      minValue: 0,
      maxValue: 2,
      standardMin: '0.10',
      standardMax: null,
      unit: '%',
    },
    {
      label: 'Kadar K:',
      currentValue: mm.kadar_k ?? '-',
      minValue: 0,
      maxValue: 2,
      standardMin: '0.20',
      standardMax: null,
      unit: '%',
    },
  ];

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
                  {isLoading ? (
                    <>
                      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </>
                  ) : (
                    <>
                      <p className={`${mm.kualitas && mm.kualitas.toLowerCase().includes('baik') ? 'text-green-600' : 'text-red-600'} font-semibold text-lg mb-1`}>
                        {mm.kualitas ?? '—'}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(mm.tanggal)}</p>
                    </>
                  )}
                </div>

                {/* Skeleton Parameters*/}
                <div className="space-y-2 text-sm">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-3 text-sm">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-20 h-4 bg-gray-200 rounded animate-pulse"
                      />
                    ))}
                  </div>
                  ) : (
                    <>
                      <div className="flex">
                        <span className="text-gray-600 w-24 text-left pr-2">pH</span>
                        <span className="font-semibold text-gray-800">: {mm.ph ?? '-'}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-600 w-24 text-left pr-2">Kadar Air</span>
                        <span className="font-semibold text-gray-800">: {mm.kadar_air ?? '-'}%</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-600 w-24 text-left pr-2">Suhu</span>
                        <span className="font-semibold text-gray-800">: {mm.suhu ?? '-'}°C</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-600 w-24 text-left pr-2">Kadar N</span>
                        <span className="font-semibold text-gray-800">: {mm.kadar_n ?? '-'}%</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-600 w-24 text-left pr-2">Kadar P</span>
                        <span className="font-semibold text-gray-800">: {mm.kadar_p ?? '-'}%</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-600 w-24 text-left pr-2">Kadar K</span>
                        <span className="font-semibold text-gray-800">: {mm.kadar_k ?? '-'}%</span>
                      </div>
                    </>
                  )}
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
              {isLoading ? (
                <>
              {/* Skeleton untuk isi keterangan */}
              <div className="h-24 bg-gray-200 rounded animate-pulse mb-4" />
              {/* Skeleton untuk tombol */}
              <div className="w-40 h-10 bg-gray-200 rounded animate-pulse" />
              </>
                ) : isEditing ? (
                  <>
                  <textarea
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    className="w-full h-40 p-3 border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  />
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2.5 border-2 border-green-700 text-green-700 hover:bg-green-100 font-semibold rounded transition-colors text-sm"
                    >
                    {isSaving ? 'Menyimpan...' : 'SIMPAN'}
                  </button>
                </>
                ) : (
                <>
                <p className="text-sm text-gray-700 leading-relaxed mb-6">
                  {analysisData?.keterangan ?? '—'}
                </p>
              <button
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="px-6 py-2.5 border-2 border-blue-800 text-blue-600 hover:bg-blue-100 font-semibold rounded transition-colors text-sm"
                >
                EDIT KETERANGAN
              </button>
            </>
            )}
          </div>
        </div>

        {/* Button Back */}
        <div className="mt-5">
          {isLoading ? (
            <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
          ) :  (
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 border-2 border-red-600 text-red-700 font-semibold rounded hover:bg-red-100 transition-colors text-sm"
          >
            KEMBALI
          </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailAnalysis;
