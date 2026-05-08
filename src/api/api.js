import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Initialization
export const getInitData = async () => {
  const response = await apiClient.get('/init');
  return response.data;
};

// Products
export const getProducts = async (params = {}) => {
  const response = await apiClient.get('/products', { params });
  return response.data;
};

export const getProductDetails = async (slug) => {
  const response = await apiClient.get(`/products/${slug}`);
  return response.data;
};

export const getProductById = async (slug) => {
  const response = await apiClient.get(`/products/${slug}`);
  return response.data.data;
};

export const getProductsByCategory = async (categorySlug) => {
  const response = await apiClient.get('/products', {
    params: { category: categorySlug === 'All' ? undefined : categorySlug }
  });
  return response.data.data.data;
};

export const searchProducts = async (query) => {
  if (!query) return [];
  const response = await apiClient.get('/products', {
    params: { search: query }
  });
  return response.data.data.data.slice(0, 5);
};

// Orders
export const placeOrder = async (orderData) => {
  const response = await apiClient.post('/orders', orderData);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await apiClient.post('/orders', orderData);
  return response.data.data;
};

export const trackOrder = async (trackingId) => {
  const response = await apiClient.get(`/orders/track/${trackingId}`);
  return response.data;
};

// Content & Contact
export const submitContact = async (contactData) => {
  const response = await apiClient.post('/contact', contactData);
  return response.data;
};

export const getDynamicPage = async (slug) => {
  const response = await apiClient.get(`/pages/${slug}`);
  return response.data;
};

// Reviews
export const getReviews = async (params) => {
  const response = await apiClient.get('/reviews', { params });
  return response.data;
};

export const submitReview = async (reviewData) => {
  if (reviewData instanceof FormData) {
    const response = await apiClient.post('/reviews', reviewData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
  const response = await apiClient.post('/reviews', reviewData);
  return response.data;
};

export const validateCoupon = async (code, items = []) => {
  const response = await apiClient.post('/validate-coupon', { code, items });
  return response.data;
};

export const subscribePush = async (subscription, siteId) => {
  const response = await apiClient.post('/push-subscribe', {
    ...subscription,
    site_id: siteId
  });
  return response.data;
};

// Export as an object for backward compatibility
export const api = {
  getInitData,
  getProducts,
  getProductDetails,
  getProductById,
  getProductsByCategory,
  searchProducts,
  placeOrder,
  createOrder,
  trackOrder,
  submitContact,
  getDynamicPage,
  getReviews,
  submitReview,
  validateCoupon
};

export default apiClient;
