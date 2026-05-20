import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),

    register: (email: string, password: string) =>
        api.post('/auth/register', { email, password }),

    getMe: () => api.get('/auth/me'),
};

// Tasks API
export const tasksApi = {
    getAll: (filters?: { status?: string; priority?: string; sortBy?: string }) =>
        api.get('/tasks', { params: filters }),

    getOne: (id: string) => api.get(`/tasks/${id}`),

    create: (data: { title: string; description?: string; priority?: string; status?: string; dueDate?: string }) =>
        api.post('/tasks', data),

    update: (id: string, data: Partial<{ title: string; description: string; priority: string; status: string; dueDate: string }>) =>
        api.patch(`/tasks/${id}`, data),

    delete: (id: string) => api.delete(`/tasks/${id}`),

    getDashboard: () => api.get('/tasks/dashboard'),
};