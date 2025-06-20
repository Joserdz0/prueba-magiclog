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

export const getAllProducts = () => axios.get('/products');
export const searchProducts = (filters: {
  name?: string;
  sku?: string;
  minPrice?: string;
  maxPrice?: string;
}) =>
  axios.get('/products/search', {
    params: filters,
  });
export const getProductsBySellerEmail = (email: string, filters = {}) =>
  axios.get('/products/admin/by-email', {
    params: { email, ...filters },
  });

