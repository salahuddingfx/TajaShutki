import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getInitData = async () => {
  const response = await apiClient.get('/init');
  return response.data;
};

export const getProducts = async (params) => {
  const response = await apiClient.get('/products', { params });
  return response.data;
};

export const getProductDetails = async (slug) => {
  const response = await apiClient.get(`/products/${slug}`);
  return response.data;
};

export const placeOrder = async (orderData) => {
  const response = await apiClient.post('/orders', orderData);
  return response.data;
};

export const trackOrder = async (trackingId) => {
  const response = await apiClient.get(`/orders/track/${trackingId}`);
  return response.data;
};

export const submitContact = async (contactData) => {
  const response = await apiClient.post('/contact', contactData);
  return response.data;
};

export const getDynamicPage = async (slug) => {
  const response = await apiClient.get(`/pages/${slug}`);
  return response.data;
};

export const getReviews = async (params) => {
  const response = await apiClient.get('/reviews', { params });
  return response.data;
};

export const submitReview = async (reviewData) => {
  const response = await apiClient.post('/reviews', reviewData);
  return response.data;
};

export default apiClient;
