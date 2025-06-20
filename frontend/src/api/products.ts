import axios from './axios';

export const getMyProducts = () => axios.get('/products/me');

export const createProduct = (data: {
  name: string;
  sku: string;
  quantity: number;
  price: number;
}) => axios.post('/products', data);

export const getAdminProducts = (sellerId?: number) =>
  axios.get('/products/admin', {
    params: sellerId ? { sellerId } : {},
  });
