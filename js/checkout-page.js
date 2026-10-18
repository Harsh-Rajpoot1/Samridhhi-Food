// ============================================
// CHECKOUT PAGE — Script
// ============================================

import { initMobileMenu, formatPrice, showToast, generateOrderId } from './utils.js';
import { getCart, getCartTotals, updateCartBadge, clearCart } from './cart.js';
import { SAMPLE_DELIVERY_RATES } from './sample-data.js';

import { getDeliveryRateByPincode, createOrder } from './db.js';

let deliveryCharge = 0;

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  updateCartBadge();

  const cart = getCart();
  if (cart.length === 0) {
    window.location.href = '/cart.html';
    return;
  }

  renderOrderSummary();
  setupPaymentMethods();
  setupPincodeCheck();
  setupFormSubmit();

  // Pre-fill pincode from cart page
  const savedPincode = sessionStorage.getItem('delivery_pincode');
  if (savedPincode) {
    document.getElementById('pincode').value = savedPincode;
    checkDeliveryRate(savedPincode);
  }
});

function renderOrderSummary() {
  const cart = getCart();
  const { subtotal, itemCount } = getCartTotals();
  const orderItems = document.getElementById('orderItems');

  orderItems.innerHTML = cart.map(item => `
    <div class="order-summary__item">
      <span class="order-summary__item-name">${item.name} (${item.weight})</span>
      <span class="order-summary__item-qty">×${item.qty}</span>
      <span class="order-summary__item-price">${formatPrice(item.price * item.qty)}</span>
    </div>
  `).join('');

  document.getElementById('checkoutSubtotal').textContent = formatPrice(subtotal);
  updateTotal();
}

function updateTotal() {
  const { subtotal } = getCartTotals();
  const total = subtotal + deliveryCharge;
  document.getElementById('checkoutTotal').textContent = formatPrice(total);

  if (deliveryCharge > 0) {
    document.getElementById('checkoutDelivery').textContent = formatPrice(deliveryCharge);
  } else if (deliveryCharge === 0 && document.getElementById('pincode').value.length === 6) {
    document.getElementById('checkoutDelivery').innerHTML = '<span style="color:var(--color-success);font-weight:600;">FREE</span>';
  }
}

function setupPaymentMethods() {
  document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', () => {
      document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
      method.classList.add('active');
    });
  });
}

function setupPincodeCheck() {
  const pincodeInput = document.getElementById('pincode');
  if (pincodeInput) {
    pincodeInput.addEventListener('blur', () => {
      const pincode = pincodeInput.value.trim();
      if (pincode.length === 6 && /^\d{6}$/.test(pincode)) {
        checkDeliveryRate(pincode);
      }
    });
  }
}

async function checkDeliveryRate(pincode) {
  const { subtotal } = getCartTotals();
  const rateInfo = document.getElementById('deliveryRateInfo');

  rateInfo.textContent = 'Checking delivery rate...';
  rateInfo.style.background = 'var(--color-bg-alt)';
  rateInfo.style.display = 'block';

  const foundZone = await getDeliveryRateByPincode(pincode);

  if (foundZone) {
    if (subtotal >= foundZone.freeAbove) {
      deliveryCharge = 0;
      rateInfo.innerHTML = `✅ <strong>${foundZone.zoneName}</strong> — Free delivery! (Order above ${formatPrice(foundZone.freeAbove)})`;
      rateInfo.style.background = 'var(--color-accent-50)';
    } else {
      deliveryCharge = foundZone.rate;
      rateInfo.innerHTML = `📍 <strong>${foundZone.zoneName}</strong> — Delivery: ${formatPrice(foundZone.rate)}. Free above ${formatPrice(foundZone.freeAbove)}`;
      rateInfo.style.background = 'var(--color-primary-50)';
    }
    rateInfo.style.display = 'block';
  } else {
    deliveryCharge = 0;
    rateInfo.innerHTML = '❌ We don\'t currently deliver to this pincode. <a href="https://wa.me/919876543210" target="_blank" style="color:var(--color-primary-600);">Contact us on WhatsApp</a>';
    rateInfo.style.background = '#FFEBEE';
    rateInfo.style.display = 'block';
  }

  updateTotal();
}

function setupFormSubmit() {
  const form = document.getElementById('checkoutForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
      showToast('Cart is empty!', 'error');
      return;
    }

    const { subtotal } = getCartTotals();
    const customerName = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const pincode = document.getElementById('pincode').value.trim();
    const paymentMode = document.querySelector('input[name="paymentMode"]:checked').value;

    // Validation
    if (!customerName || !phone || !address || !city || !pincode) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    const orderId = generateOrderId();
    const total = subtotal + deliveryCharge;

    const orderData = {
      orderId,
      customerName,
      phone,
      address,
      city,
      pincode,
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        weight: item.weight,
        qty: item.qty,
        price: item.price
      })),
      subtotal,
      deliveryCharge,
      total,
      paymentMode,
      status: 'placed'
    };

    // Disable button to prevent double-submit
    const submitBtn = document.getElementById('placeOrderBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing...';
    }

    // For WhatsApp orders, redirect to WhatsApp
    if (paymentMode === 'whatsapp') {
      const itemsList = cart.map(i => `• ${i.name} (${i.weight}) × ${i.qty} = ${formatPrice(i.price * i.qty)}`).join('\n');
      const whatsappMsg = `🛒 *New Order from Shree Samvriddhi Foods Website*\n\n` +
        `*Order ID:* ${orderId}\n` +
        `*Name:* ${customerName}\n` +
        `*Phone:* ${phone}\n` +
        `*Address:* ${address}, ${city} - ${pincode}\n\n` +
        `*Items:*\n${itemsList}\n\n` +
        `*Subtotal:* ${formatPrice(subtotal)}\n` +
        `*Delivery:* ${deliveryCharge > 0 ? formatPrice(deliveryCharge) : 'FREE'}\n` +
        `*Total:* ${formatPrice(total)}`;

      window.open(`https://wa.me/919876543210?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
    }

    // Save order to Firestore/local DB helper
    try {
      await createOrder(orderData);
      showToast('Order placed successfully! 🎉', 'success');
      
      // Show success
      clearCart();
      document.getElementById('checkoutLayout').style.display = 'none';
      document.getElementById('orderSuccess').style.display = 'block';
      document.getElementById('successOrderId').textContent = orderId;

      // Save last order ID for tracking
      sessionStorage.setItem('last_order_id', orderId);
    } catch (err) {
      console.error('Error saving order:', err);
      showToast('Failed to place order. Please try again.', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '✓ Place Order';
      }
    }
  });
}

