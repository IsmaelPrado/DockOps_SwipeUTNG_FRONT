// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const registerUser = async (userData) => {
  try {
    const res = await API.post('/register', userData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Error al registrar' };
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await API.post('/login', credentials);

    return res.data; // ya devuelve el body directamente
  } catch (err) {
    throw err.response?.data || { message: 'Error al iniciar sesión' };
  }
};
