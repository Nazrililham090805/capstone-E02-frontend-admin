import axios from 'axios';

const BASE_URL = 'https://capstone-e02-backend.vercel.app';

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
    getLatest: '/compost/latest',
    ById: (id) => `/compost/${id}`
  }
};

export default api;