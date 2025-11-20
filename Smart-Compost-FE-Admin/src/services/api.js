import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (config.url === '/admin/login') {
    return config;
  }
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const endpoints = {
  auth: {
    login: '/admin/login',
    register: '/admin/register',
    update: (id) => `/admin/${id}`,
    delete: (id) => `/admin/${id}`
  },
  compost: {
    base: '/compost',
    getStats: '/compost/stats',
    getRecords: '/compost/records',
    getRecordsDefault: '/compost/records/default',
    getLatest: '/compost/latest',
    ById: (id) => `/compost/${id}`
  }
};

// Fungsi untuk fetch compost records dengan filter
export const fetchCompostRecords = async (query = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Tambahkan query hanya jika ada nilainya
    if (query.page) params.append('page', query.page);
    if (query.limit) params.append('limit', query.limit);
    if (query.bulan) params.append('bulan', query.bulan); // contoh: "2025-11"
    if (query.status) params.append('status', query.status);
    if (query.keterangan) params.append('keterangan', query.keterangan);
    if (query.sort) params.append('sort', query.sort); // contoh: "kadar_n:desc,kadar_p:asc"
    
    const queryString = params.toString().replace(/\+/g, '%20');

    const response = await api.get(`/compost/records?${queryString}`);

    return response.data; // { data, meta }
  } catch (error) {
    throw error;
  }
};

export default api;