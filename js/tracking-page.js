// ============================================
// ORDER TRACKING PAGE — Script
// ============================================

import { initMobileMenu, formatPrice, showToast, getStatusLabel, getStatusBadgeClass } from './utils.js';
import { updateCartBadge } from './cart.js';
import { SAMPLE_ORDERS } from './sample-data.js';

import { getOrderByOrderId, getOrdersByPhone } from './db.js';

const STATUS_ORDER = ['placed', 'confirmed', 'processing', 'out_for_delivery', 'delivered'];
const STATUS_ICONS = {
  placed: '📋',
  confirmed: '✅',
  processing: '⚙️',
  out_for_delivery: '🚚',
  delivered: '📦'
};

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  updateCartBadge();
  setupTracking();

  // Auto-fill from last order
  const lastOrderId = sessionStorage.getItem('last_order_id');
  if (lastOrderId) {
    document.getElementById('trackInput').value = lastOrderId;
    sessionStorage.removeItem('last_order_id');
    // Auto search
    searchOrder(lastOrderId);
  }
});

function setupTracking() {
  const trackBtn = document.getElementById('trackBtn');
  const trackInput = document.getElementById('trackInput');

  trackBtn.addEventListener('click', () => {
    const query = trackInput.value.trim();
    if (!query) {
      showToast('Please enter an Order ID or phone number', 'error');
      return;
    }
    searchOrder(query);
  });

  trackInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') trackBtn.click();
  });
}

async function searchOrder(query) {
  const resultEl = document.getElementById('trackingResult');
  const notFoundEl = document.getElementById('trackingNotFound');
  
  // Show a simple loading indicator
  resultEl.innerHTML = '<div class="text-center" style="padding:var(--space-10);"><div class="spinner" style="margin:0 auto;"></div></div>';
  resultEl.style.display = 'block';
  notFoundEl.style.display = 'none';

  let found = await getOrderByOrderId(query);

  // Search by phone
  if (!found && /^\d{10}$/.test(query)) {
    const list = await getOrdersByPhone(query);
    if (list.length > 0) {
      found = list[0]; // Get the latest order
    }
  }

  if (found) {
    resultEl.style.display = 'block';
    notFoundEl.style.display = 'none';
    renderOrderTracking(found);
  } else {
    resultEl.style.display = 'none';
    notFoundEl.style.display = 'block';
  }
}


function renderOrderTracking(order) {
  const resultEl = document.getElementById('trackingResult');
  const currentStatusIdx = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  const orderDate = order.createdAt?.toDate
    ? order.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  resultEl.innerHTML = `
    <div class="tracking-card">
      <!-- Header -->
      <div class="tracking-header">
        <div class="tracking-header__info">
          <h3>Order ${order.orderId}</h3>
          <div class="tracking-header__date">Placed on ${orderDate}</div>
        </div>
        <span class="badge ${getStatusBadgeClass(order.status)}">${getStatusLabel(order.status)}</span>
      </div>

      ${isCancelled ? `
        <div style="padding:var(--space-4);background:#FFEBEE;border-radius:var(--radius-lg);text-align:center;margin-bottom:var(--space-6);">
          <span style="font-size:var(--text-lg);">❌</span>
          <p style="color:var(--color-error);font-weight:var(--weight-semibold);margin-top:var(--space-2);">This order has been cancelled</p>
        </div>
      ` : `
        <!-- Timeline -->
        <div class="order-timeline">
          ${STATUS_ORDER.map((status, idx) => {
            let stepClass = 'pending';
            if (idx < currentStatusIdx) stepClass = 'completed';
            else if (idx === currentStatusIdx) stepClass = 'active';

            return `
              <div class="timeline-item ${stepClass} timeline-step">
                <div class="timeline-item__dot">${STATUS_ICONS[status]}</div>
                <div class="timeline-item__title">${getStatusLabel(status)}</div>
                <div class="timeline-item__time">${stepClass === 'completed' ? 'Completed' : stepClass === 'active' ? 'In Progress' : 'Pending'}</div>
              </div>
            `;
          }).join('')}
        </div>
      `}

      <!-- Order Items -->
      <div class="tracking-items">
        <div class="tracking-items__title">Order Items</div>
        ${order.items.map(item => `
          <div class="order-summary__item">
            <span class="order-summary__item-name">${item.name} (${item.weight})</span>
            <span class="order-summary__item-qty">×${item.qty}</span>
            <span class="order-summary__item-price">${formatPrice(item.price * item.qty)}</span>
          </div>
        `).join('')}

        <div style="margin-top:var(--space-4);padding-top:var(--space-4);border-top:1px solid rgba(212,160,23,0.1);">
          <div class="cart-summary__row">
            <span class="label">Subtotal</span>
            <span class="value">${formatPrice(order.subtotal)}</span>
          </div>
          <div class="cart-summary__row">
            <span class="label">Delivery</span>
            <span class="value ${order.deliveryCharge === 0 ? 'free' : ''}">${order.deliveryCharge > 0 ? formatPrice(order.deliveryCharge) : 'FREE'}</span>
          </div>
          <div class="cart-summary__total">
            <span class="label">Total</span>
            <span class="value">${formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <!-- Delivery Info -->
      <div style="margin-top:var(--space-4);padding:var(--space-4);background:var(--color-bg-alt);border-radius:var(--radius-lg);">
        <div style="font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-2);">Delivering to</div>
        <div style="font-weight:var(--weight-semibold);">${order.customerName}</div>
        <div style="font-size:var(--text-sm);color:var(--color-text-secondary);">${order.address}${order.city ? ', ' + order.city : ''} - ${order.pincode}</div>
        <div style="font-size:var(--text-sm);color:var(--color-text-secondary);">📞 ${order.phone}</div>
      </div>
    </div>
  `;
}
