import axios from './axios';

export const register = (email: string, password: string, confirmPassword: string) =>
  axios.post('/users/register', { email, password, confirmPassword });
