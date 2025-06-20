import axios from './axios';

export const getCart = () => axios.get('/cart');

export const addToCart = (data: {
  productId: number;
  quantity: number;
}) => axios.post('/cart', data);

export const removeFromCart = (cartItemId: number) =>
  axios.delete(`/cart/${cartItemId}`);
