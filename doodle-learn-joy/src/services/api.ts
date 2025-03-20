import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const recognizeDoodle = async (imageData) => {
  try {
    const response = await api.post('/recognize', { image: imageData });
    return response.data.result;
  } catch (error) {
    console.error('Doodle Recognition Error:', error);
    throw error;
  }
};

export const saveScore = async (username, score, totalAttempts) => {
  try {
    const response = await api.post('/save-score', {
      username,
      score,
      total_attempts: totalAttempts
    });
    return response.data;
  } catch (error) {
    console.error('Score Saving Error:', error);
    throw error;
  }
};

export const getLeaderboard = async () => {
  try {
    const response = await api.get('/leaderboard');
    return response.data;
  } catch (error) {
    console.error('Leaderboard Error:', error);
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post('/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

export default api;
