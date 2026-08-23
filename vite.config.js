import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        products: resolve(import.meta.dirname, 'products.html'),
        cart: resolve(import.meta.dirname, 'cart.html'),
        checkout: resolve(import.meta.dirname, 'checkout.html'),
        orderTracking: resolve(import.meta.dirname, 'order-tracking.html'),
        admin: resolve(import.meta.dirname, 'admin.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});

