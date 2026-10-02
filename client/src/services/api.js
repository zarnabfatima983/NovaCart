import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nova_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    if (error.response?.status === 401) {
      localStorage.removeItem('nova_token');
      localStorage.removeItem('nova_user');
    }
    return Promise.reject(new Error(message));
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data)          => api.post('/auth/register', data),
  login:    (data)          => api.post('/auth/login', data),
  getMe:    ()              => api.get('/auth/me'),
  updateProfile: (data)     => api.put('/auth/profile', data),
  updatePassword: (data)    => api.put('/auth/password', data),
  updateAddress: (data)     => api.put('/auth/address', data),
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const productAPI = {
  getAll:         (params)  => api.get('/products', { params }),
  getById:        (id)      => api.get(`/products/${id}`),
  getFeatured:    ()        => api.get('/products/featured'),
  getNewArrivals: ()        => api.get('/products/new-arrivals'),
  getFlashSale:   ()        => api.get('/products/flash-sale'),
  getRelated:     (id)      => api.get(`/products/${id}/related`),
  getSuggestions: (q)       => api.get('/products/search/suggestions', { params: { q } }),
  getRecommendations:(params)=> api.get('/products/recommendations', { params }),
  getInventory:   ()        => api.get('/products/admin/inventory'),
  create:         (data)    => api.post('/products', data),
  update:         (id, data)=> api.put(`/products/${id}`, data),
  delete:         (id)      => api.delete(`/products/${id}`),
};

// ─── Categories ───────────────────────────────────────────────────────────────
export const categoryAPI = {
  getAll:   ()             => api.get('/categories'),
  getById:  (id)           => api.get(`/categories/${id}`),
  create:   (data)         => api.post('/categories', data),
  update:   (id, data)     => api.put(`/categories/${id}`, data),
  delete:   (id)           => api.delete(`/categories/${id}`),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orderAPI = {
  create:        (data)       => api.post('/orders', data),
  getMyOrders:   (params)     => api.get('/orders/my-orders', { params }),
  getById:       (id)         => api.get(`/orders/${id}`),
  getAll:        (params)     => api.get('/orders', { params }),
  updateStatus:  (id, data)   => api.put(`/orders/${id}/status`, data),
  getAnalytics:  ()           => api.get('/orders/admin/analytics'),
};

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const reviewAPI = {
  getByProduct: (id, params) => api.get(`/products/${id}/reviews`, { params }),
  create:       (data)       => api.post('/products/reviews', data),
  update:       (id, data)   => api.put(`/products/reviews/${id}`, data),
  delete:       (id)         => api.delete(`/products/reviews/${id}`),
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export const wishlistAPI = {
  get:    ()             => api.get('/wishlist'),
  add:    (productId)    => api.post('/wishlist', { productId }),
  remove: (productId)    => api.delete(`/wishlist/${productId}`),
  toggle: (productId)    => api.post('/wishlist/toggle', { productId }),
};

// ─── Coupons ──────────────────────────────────────────────────────────────────
export const couponAPI = {
  validate: (data)        => api.post('/coupons/validate', data),
  getAll:   ()            => api.get('/coupons'),
  create:   (data)        => api.post('/coupons', data),
  update:   (id, data)    => api.put(`/coupons/${id}`, data),
  delete:   (id)          => api.delete(`/coupons/${id}`),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const userAPI = {
  getAll:              (params) => api.get('/users', { params }),
  getById:             (id)     => api.get(`/users/${id}`),
  toggleStatus:        (id)     => api.put(`/users/${id}/toggle-status`),
  addRecentlyViewed:   (productId) => api.post('/users/recently-viewed', { productId }),
  getRecentlyViewed:   ()       => api.get('/users/recently-viewed'),
  getAdminStats:       ()       => api.get('/users/admin/stats'),
};

export default api;
