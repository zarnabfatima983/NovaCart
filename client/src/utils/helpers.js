import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes intelligently
export const cn = (...inputs) => twMerge(clsx(inputs));

// Format currency
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Calculate discount price
export const calcDiscountedPrice = (price, discount) => {
  if (!discount || discount === 0) return price;
  return +(price - (price * discount) / 100).toFixed(2);
};

// Format date
export const formatDate = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(date));
};

// Format short date
export const formatDateShort = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(new Date(date));
};

// Truncate text
export const truncate = (text, length = 100) => {
  if (!text || text.length <= length) return text;
  return text.slice(0, length).trim() + '…';
};

// Generate star array
export const getStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) stars.push('full');
    else if (i === fullStars && hasHalf) stars.push('half');
    else stars.push('empty');
  }
  return stars;
};

// Debounce function
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// Get image URL with fallback
export const getImageUrl = (url, fallback = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400') => {
  if (!url || url === '') return fallback;
  return url;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Order status config
export const ORDER_STATUS_CONFIG = {
  processing:      { label: 'Processing',      color: 'warning', icon: '⏳' },
  confirmed:       { label: 'Confirmed',        color: 'primary', icon: '✅' },
  shipped:         { label: 'Shipped',          color: 'primary', icon: '📦' },
  out_for_delivery:{ label: 'Out for Delivery', color: 'primary', icon: '🚚' },
  delivered:       { label: 'Delivered',        color: 'success', icon: '✓'  },
  cancelled:       { label: 'Cancelled',        color: 'error',   icon: '✗'  },
  refunded:        { label: 'Refunded',         color: 'gray',    icon: '↩'  },
};

// Scroll to top
export const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// Local storage helpers
export const storage = {
  get: (key, fallback = null) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  remove: (key) => {
    try { localStorage.removeItem(key); } catch {}
  },
};

// Generate random id
export const generateId = () => Math.random().toString(36).substr(2, 9);

// Number format (1.2K, 1.2M)
export const formatCount = (num) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};
