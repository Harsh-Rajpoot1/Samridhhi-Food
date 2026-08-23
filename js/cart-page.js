// ============================================
// CART PAGE — Script
// ============================================

import { initMobileMenu, formatPrice, showToast } from './utils.js';
import { getCart, updateCartItemQty, removeFromCart, getCartTotals, updateCartBadge, clearCart } from './cart.js';
import { SAMPLE_DELIVERY_RATES, getProductPlaceholder } from './sample-data.js';

let deliveryCharge = 0;
let deliveryChecked = false;

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  updateCartBadge();
  renderCart();
  setupPincodeCheck();

  // Listen for cart updates
  window.addEventListener('cart-updated', () => {
    renderCart();
    updateCartBadge();
  });
});

function renderCart() {
  const cart = getCart();
  const cartLayout = document.getElementById('cartLayout');
  const emptyCart = document.getElementById('emptyCart');
  const cartItems = document.getElementById('cartItems');
  const headerCount = document.getElementById('cartHeaderCount');

  if (cart.length === 0) {
    cartLayout.style.display = 'none';
    emptyCart.style.display = 'block';
    if (headerCount) headerCount.textContent = 'Your cart is empty';
    return;
  }

  cartLayout.style.display = 'grid';
  emptyCart.style.display = 'none';
  const { itemCount } = getCartTotals();
  if (headerCount) headerCount.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`;

  cartItems.innerHTML = cart.map((item, index) => {
    const imgSrc = item.imageUrl || getProductPlaceholder({ name: item.name, category: item.category || 'wheat' });

    return `
      <div class="cart-item">
        <div class="cart-item__image">
          <img src="${imgSrc}" alt="${item.name}">
        </div>
        <div class="cart-item__details">
          <div class="cart-item__name">${item.name}</div>
          <div class="cart-item__variant">${item.weight}</div>
          <div class="cart-item__bottom">
            <div style="display:flex;align-items:center;gap:var(--space-4);">
              <div class="qty-stepper">
                <button class="qty-stepper__btn qty-dec" data-index="${index}">−</button>
                <span class="qty-stepper__value">${item.qty}</span>
                <button class="qty-stepper__btn qty-inc" data-index="${index}">+</button>
              </div>
              <div class="cart-item__price">${formatPrice(item.price * item.qty)}</div>
            </div>
            <button class="cart-item__remove" data-index="${index}" title="Remove">🗑️ Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach listeners
  cartItems.querySelectorAll('.qty-dec').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      const cart = getCart();
      updateCartItemQty(idx, cart[idx].qty - 1);
    });
  });

  cartItems.querySelectorAll('.qty-inc').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      const cart = getCart();
      updateCartItemQty(idx, cart[idx].qty + 1);
    });
  });

  cartItems.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      removeFromCart(idx);
    });
  });

  updateTotals();
}

function updateTotals() {
  const { subtotal } = getCartTotals();
  document.getElementById('subtotalValue').textContent = formatPrice(subtotal);

  if (deliveryChecked) {
    const totalWithDelivery = subtotal + deliveryCharge;
    document.getElementById('totalValue').textContent = formatPrice(totalWithDelivery);
  } else {
    document.getElementById('totalValue').textContent = formatPrice(subtotal);
  }
}

import { getDeliveryRateByPincode } from './db.js';

function setupPincodeCheck() {
  const checkBtn = document.getElementById('checkPincodeBtn');
  const pincodeInput = document.getElementById('pincodeInput');

  if (checkBtn) {
    checkBtn.addEventListener('click', () => {
      const pincode = pincodeInput.value.trim();
      if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
        showToast('Please enter a valid 6-digit pincode', 'error');
        return;
      }
      checkDeliveryRate(pincode);
    });
  }

  if (pincodeInput) {
    pincodeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkBtn.click();
    });
  }
}

async function checkDeliveryRate(pincode) {
  const deliveryInfo = document.getElementById('deliveryInfo');
  const deliveryValue = document.getElementById('deliveryValue');
  const { subtotal } = getCartTotals();

  // Show a loading text while checking
  deliveryValue.textContent = 'Checking...';

  const foundZone = await getDeliveryRateByPincode(pincode);

  if (foundZone) {
    if (subtotal >= foundZone.freeAbove) {
      deliveryCharge = 0;
      deliveryValue.textContent = 'FREE';
      deliveryValue.classList.add('free');
      deliveryInfo.innerHTML = `✅ <strong>${foundZone.zoneName}</strong> — Free delivery on orders above ${formatPrice(foundZone.freeAbove)}!`;
    } else {
      deliveryCharge = foundZone.rate;
      deliveryValue.textContent = formatPrice(foundZone.rate);
      deliveryValue.classList.remove('free');
      deliveryInfo.innerHTML = `📍 <strong>${foundZone.zoneName}</strong> — Add ${formatPrice(foundZone.freeAbove - subtotal)} more for free delivery`;
    }
    deliveryInfo.style.display = 'block';
    deliveryChecked = true;

    // Save to sessionStorage for checkout
    sessionStorage.setItem('delivery_pincode', pincode);
    sessionStorage.setItem('delivery_charge', deliveryCharge.toString());
    sessionStorage.setItem('delivery_zone', foundZone.zoneName);
  } else {

    deliveryValue.textContent = 'N/A';
    deliveryValue.classList.remove('free');
    deliveryInfo.innerHTML = '❌ Sorry, we don\'t deliver to this pincode yet. <a href="https://wa.me/919876543210?text=Hi! Can you deliver to pincode ' + pincode + '?" target="_blank">Ask us on WhatsApp</a>';
    deliveryInfo.style.display = 'block';
    deliveryChecked = false;
    deliveryCharge = 0;
  }

  updateTotals();
}
