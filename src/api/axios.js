// src/api/axios.js
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token =localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            toast.error('Session expired. Please log in again.');
        } else if (status >= 400) {
            toast.error(error.response?.data?.message || 'An error occurred.');
        }
        return Promise.reject(error);
    }
);

export default api;
