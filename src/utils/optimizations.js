// src/utils/optimizations.js
import React, { memo } from 'react';

// Higher-order component for memoization
export const withMemo = (Component) => memo(Component);

// Lazy loading helper
export const lazyLoad = (importFn) => {
  return React.lazy(() => importFn().then(module => ({ default: module.default || module })));
};

// Debounce function for search/input
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Throttle function for scroll/resize events
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Cache helper
class CacheManager {
  constructor() {
    this.cache = new Map();
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (item && Date.now() < item.expiry) return item.value;
    this.cache.delete(key);
    return null;
  }
  
  set(key, value, ttl = 300000) { // 5 minutes default TTL
    this.cache.set(key, { value, expiry: Date.now() + ttl });
  }
  
  clear() { this.cache.clear(); }
}

export const cacheManager = new CacheManager();