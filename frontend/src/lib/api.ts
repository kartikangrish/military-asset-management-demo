import axios from 'axios';
import type { LoginCredentials, AuthResponse } from '@/types/auth';

// Force deployment update - using Railway backend URL
const api = axios.create({
  baseURL: 'https://backend-production-0dc3.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('Attempting login with Railway backend...', credentials.email);
    try {
      const response = await api.post('/api/auth/login', credentials);
      console.log('Login response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

export const assets = {
  getAll: async () => {
    const response = await api.get('/api/assets');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/assets/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/api/assets', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/api/assets/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/api/assets/${id}`);
    return response.data;
  },
};

export const transfers = {
  getAll: async () => {
    const response = await api.get('/api/transfers');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/api/transfers', data);
    return response.data;
  },
};

export const dashboard = {
  getMetrics: async (params?: any) => {
    const response = await api.get('/api/dashboard/metrics', { params });
    return response.data;
  },
};

export const bases = {
  getAll: async () => {
    const response = await api.get('/api/bases');
    return response.data;
  },
};

export const assignments = {
  getAll: async () => {
    const response = await api.get('/api/assignments');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/api/assignments', data);
    return response.data;
  },
};

export const expenditures = {
  getAll: async () => {
    const response = await api.get('/api/expenditures');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/api/expenditures', data);
    return response.data;
  },
};

export const purchases = {
  getAll: async () => {
    const response = await api.get('/api/purchases');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/api/purchases', data);
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/purchases/${id}`);
    return response.data;
  },
};

export const users = {
  getAll: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },
};

export default api; 