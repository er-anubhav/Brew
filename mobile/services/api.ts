import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Production backend URL
const API_URL = 'https://brew-production.up.railway.app';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setToken = async (token: string) => {
    await SecureStore.setItemAsync('token', token);
};

export const getToken = async () => {
    return await SecureStore.getItemAsync('token');
};

export const logout = async () => {
    await SecureStore.deleteItemAsync('token');
};

api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Task API methods
export const getTasks = async (status?: string, search?: string) => {
    const params: any = {};
    if (status && status !== 'all') params.status = status;
    if (search) params.search = search;

    return api.get('/tasks', { params });
};

export const getTaskById = async (id: string) => {
    return api.get(`/tasks/${id}`);
};

export const createTask = async (data: any) => {
    return api.post('/tasks', data);
};

export const updateTask = async (id: string, data: any) => {
    return api.put(`/tasks/${id}`, data);
};

export const deleteTask = async (id: string) => {
    return api.delete(`/tasks/${id}`);
};

export default api;
