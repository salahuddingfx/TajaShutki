import { products } from '../data/products';

// Simulation of API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Products
  getProducts: async () => {
    await delay(500);
    return products;
  },
  
  getProductById: async (id) => {
    await delay(300);
    return products.find(p => p.id === id);
  },
  
  getProductsByCategory: async (category) => {
    await delay(400);
    if (category === 'All') return products;
    return products.filter(p => p.category === category);
  },

  // Orders (Mock using localStorage)
  createOrder: async (orderData) => {
    await delay(800);
    const orders = JSON.parse(localStorage.getItem('acharu-orders') || '[]');
    const newOrder = {
      ...orderData,
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: 'Order Processed',
      createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    localStorage.setItem('acharu-orders', JSON.stringify(orders));
    return newOrder;
  },

  updateOrderStatus: async (orderId, newStatus) => {
    await delay(400);
    const orders = JSON.parse(localStorage.getItem('acharu-orders') || '[]');
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].status = newStatus;
      localStorage.setItem('acharu-orders', JSON.stringify(orders));
      return orders[index];
    }
    throw new Error('Order not found');
  },

  getOrders: async () => {
    await delay(500);
    return JSON.parse(localStorage.getItem('acharu-orders') || '[]');
  },

  trackOrder: async (trackingIdOrPhone) => {
    await delay(600);
    const orders = JSON.parse(localStorage.getItem('acharu-orders') || '[]');
    return orders.find(o => o.id === trackingIdOrPhone || o.phone === trackingIdOrPhone);
  }
};
