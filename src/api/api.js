import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

const BACKEND_URL = API_BASE_URL ? API_BASE_URL.replace(/\/api\/.*$/, '') : 'http://127.0.0.1:8000';
export { BACKEND_URL };

const rewriteUrls = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    let rewritten = obj.replace(/https?:\/\/(localhost|127\.0\.0\.1):8000/g, BACKEND_URL);
    if (rewritten.includes('eadmin.viretadev.com') && rewritten.includes('/storage/') && !rewritten.includes('/public/storage/')) {
      rewritten = rewritten.replace('/storage/', '/public/storage/');
    }
    return rewritten;
  }
  if (Array.isArray(obj)) {
    return obj.map(rewriteUrls);
  }
  if (typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = rewriteUrls(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
};

apiClient.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = rewriteUrls(response.data);
    }
    return response;
  },
  (error) => {
    if (!error.response) {
      toast.error('Network error — please check your connection');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        toast.error('Session expired — please login again');
        break;
      case 403:
        toast.error('You don\'t have permission to do that');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 422:
        if (data?.message) toast.error(data.message);
        else toast.error('Please check your input and try again');
        break;
      case 429:
        toast.error('Too many requests — please slow down');
        break;
      case 500:
        toast.error('Server error — please try again later');
        break;
      default:
        toast.error(data?.message || 'Something went wrong');
    }

    return Promise.reject(error);
  }
);

// Initialization
export const getInitData = async () => {
  const response = await apiClient.get('/init');
  return response.data;
};

export const getVersion = async () => {
  const response = await apiClient.get('/version');
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
  const d = response.data;
  return d?.data?.data || d?.data || d || [];
};

export const searchProducts = async (query) => {
  if (!query) return [];
  const response = await apiClient.get('/products', {
    params: { search: query }
  });
  const d = response.data;
  const items = d?.data?.data || d?.data || d || [];
  return Array.isArray(items) ? items.slice(0, 5) : [];
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

export const validateCoupon = async (code, items = [], customerPhone = '') => {
  const response = await apiClient.post('/validate-coupon', { code, items, customer_phone: customerPhone });
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
