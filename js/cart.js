// ============================================
// CART MANAGEMENT (localStorage-based)
// ============================================

import { showToast } from './utils.js';

const CART_KEY = 'samriddhi_cart';

/**
 * Get cart items from localStorage
 */
export function getCart() {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
}

/**
 * Save cart to localStorage
 */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
}

/**
 * Add item to cart
 */
export function addToCart(product, variantIndex = 0, quantity = 1) {
  const cart = getCart();
  const variant = product.variants[variantIndex];

  // Check if item with same product id and variant already exists
  const existingIndex = cart.findIndex(
    item => item.productId === product.id && item.weight === variant.weight
  );

  if (existingIndex >= 0) {
    cart[existingIndex].qty += quantity;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      category: product.category,
      imageUrl: product.imageUrl || '',
      weight: variant.weight,
      price: variant.price,
      qty: quantity
    });
  }

  saveCart(cart);
  showToast(`${product.name} (${variant.weight}) added to cart!`, 'success');

  // Bounce animation on cart icon
  const cartBtn = document.querySelector('.navbar__cart-btn');
  if (cartBtn) {
    cartBtn.classList.add('cart-bounce');
    setTimeout(() => cartBtn.classList.remove('cart-bounce'), 500);
  }
}

/**
 * Update item quantity
 */
export function updateCartItemQty(index, newQty) {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    if (newQty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].qty = newQty;
    }
    saveCart(cart);
  }
}

/**
 * Remove item from cart
 */
export function removeFromCart(index) {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    const removed = cart.splice(index, 1)[0];
    saveCart(cart);
    showToast(`${removed.name} removed from cart`, 'warning');
  }
}

/**
 * Clear entire cart
 */
export function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: [] }));
}

/**
 * Get cart totals
 */
export function getCartTotals() {
  const cart = getCart();
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  return { itemCount, subtotal };
}

/**
 * Update cart badge count in navbar
 */
export function updateCartBadge() {
  const badges = document.querySelectorAll('.navbar__cart-badge, #cartBadge, .cartlink .count');
  const { itemCount } = getCartTotals();
  badges.forEach(badge => {
    badge.textContent = itemCount;
    badge.dataset.count = itemCount;
    badge.style.display = itemCount > 0 ? 'inline-flex' : 'inline-flex';
  });
}
