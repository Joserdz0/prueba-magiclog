import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://prueba-magiclog.onrender.com',
  //baseURL: 'http://localhost:3000/',

});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default instance;
