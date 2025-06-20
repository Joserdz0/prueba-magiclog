import axios from './axios';

export const login = (email: string, password: string) =>
  axios.post('/auth/login', { email, password });
