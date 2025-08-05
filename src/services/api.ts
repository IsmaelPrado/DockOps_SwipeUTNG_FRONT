// src/services/api.ts
import axios, { AxiosError } from 'axios';
import type { GetUsuariosResponse } from '../types/usuario';

const API = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Exportar URL
export const API_URL = 'http://localhost:3001/api';

export const registerUser = async (userData: any) => {
  try {
    const res = await API.post('/register', userData);
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    throw error.response?.data || { message: 'Error al registrar' };
  }
};

export const loginUser = async (credentials: any) => {
  try {
    const res = await API.post('/login', credentials);

    return res.data; // ya devuelve el body directamente
  } catch (err) {
    const error = err as AxiosError;
    throw error.response?.data || { message: 'Error al iniciar sesión' };
  }
};

export const getUsuariosConFiltros = async (
   token: string,
  filters: {
    career?: string;
    gender?: string;
    minAge?: number;
    maxAge?: number;
    page?: number;
    limit?: number;
  }
): Promise<GetUsuariosResponse> => {
  try {
    const res = await API.get<GetUsuariosResponse>('/usuarios/filtros', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: filters,
    });

    return res.data;
  } catch (err: any) {
    throw err.response?.data || { message: 'Error al obtener usuarios' };
  }
};

