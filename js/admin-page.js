// ============================================
// ADMIN DASHBOARD — Script
// ============================================

import { formatPrice, showToast, getStatusLabel, getStatusBadgeClass, CATEGORIES } from './utils.js';
import { getProductPlaceholder } from './sample-data.js';
import {
  getProducts, getOrders, getDeliveryRates, getStoreSettings,
  addProduct, updateProduct, deleteProduct, updateOrderStatus,
  addDeliveryRate, updateDeliveryRate, deleteDeliveryRate,
  updateStoreSettings, onOrdersSnapshot
} from './db.js';

// ---- State ----
let products = [];
let orders = [];
let deliveryRates = [];
let editingProductId = null; // Stores index or ID
let editingZoneId = null;    // Stores index or ID

// ---- Init ----
document.addEventListener('DOMContentLoaded', async () => {
  setupLogin();
  setupNavigation();
  setupProductModal();
  setupZoneModal();
  setupOrderFilter();
  setupSettings();

  // Setup real-time listener for orders
  onOrdersSnapshot((updatedOrders) => {
    orders = updatedOrders;
    // Refresh active section
    const activeLink = document.querySelector('.admin-nav-link.active');
    if (activeLink) {
      const section = activeLink.dataset.section;
      if (section === 'dashboard') loadDashboard();
      else if (section === 'orders') {
        const filterSelect = document.getElementById('orderStatusFilter');
        renderOrders(filterSelect ? filterSelect.value : 'all');
      }
    }
    
    // Update sidebar badge
    const pending = orders.filter(o => o.status === 'placed' || o.status === 'confirmed' || o.status === 'processing').length;
    const badge = document.getElementById('pendingOrdersBadge');
    if (badge) {
      badge.textContent = pending;
      badge.style.display = pending > 0 ? 'inline' : 'none';
    }
  });

  // Load initial data
  await loadAllData();
});

async function loadAllData() {
  products = await getProducts();
  deliveryRates = await getDeliveryRates();
}

// ---- Login ----
function setupLogin() {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (email && password) {
      document.getElementById('adminLogin').style.display = 'none';
      document.getElementById('adminDashboard').style.display = 'block';
      loadDashboard();
      showToast('Welcome to Admin Panel!', 'success');
    } else {
      document.getElementById('loginError').classList.add('show');
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    document.getElementById('adminLogin').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
    showToast('Logged out successfully', 'success');
  });
}

// ---- Navigation ----
function setupNavigation() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      document.getElementById('adminSidebar').classList.toggle('open');
    });

    if (window.innerWidth <= 768) {
      sidebarToggle.style.display = 'block';
    }
    window.addEventListener('resize', () => {
      sidebarToggle.style.display = window.innerWidth <= 768 ? 'block' : 'none';
    });
  }
}

// Make switchSection global
window.switchSection = async function(sectionName) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));

  const section = document.getElementById(`section-${sectionName}`);
  if (section) section.classList.add('active');

  document.querySelectorAll('.admin-nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === sectionName);
  });

  switch (sectionName) {
    case 'dashboard':
      await loadDashboard();
      break;
    case 'products':
      await renderProducts();
      break;
    case 'orders':
      const filterSelect = document.getElementById('orderStatusFilter');
      await renderOrders(filterSelect ? filterSelect.value : 'all');
      break;
    case 'delivery':
      await renderDeliveryRates();
      break;
  }

  document.getElementById('adminSidebar')?.classList.remove('open');
};

// ---- Dashboard ----
async function loadDashboard() {
  products = await getProducts();
  orders = await getOrders();
  
  const totalOrders = orders.length;
  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pending = orders.filter(o => o.status === 'placed' || o.status === 'confirmed' || o.status === 'processing').length;
  const totalProducts = products.length;

  document.getElementById('statTotalOrders').textContent = totalOrders;
  document.getElementById('statRevenue').textContent = formatPrice(revenue);
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statProducts').textContent = totalProducts;

  const badge = document.getElementById('pendingOrdersBadge');
  if (badge) {
    badge.textContent = pending;
    badge.style.display = pending > 0 ? 'inline' : 'none';
  }

  const recentOrders = orders.slice(0, 5);
  const tbody = document.getElementById('recentOrdersBody');
  
  tbody.innerHTML = recentOrders.map(order => {
    const date = order.createdAt?.toDate
      ? order.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      : new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    return `
      <tr>
        <td><strong>${order.orderId}</strong></td>
        <td>${order.customerName}</td>
        <td>${order.items.length} item${order.items.length > 1 ? 's' : ''}</td>
        <td><strong>${formatPrice(order.total)}</strong></td>
        <td><span class="badge ${getStatusBadgeClass(order.status)}">${getStatusLabel(order.status)}</span></td>
        <td>${date}</td>
      </tr>
    `;
  }).join('');

  if (recentOrders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:var(--space-8);color:var(--color-text-muted);">No orders yet</td></tr>';
  }
}

// ---- Products Management ----
async function renderProducts() {
  products = await getProducts();
  const tbody = document.getElementById('productsTableBody');
  
  tbody.innerHTML = products.map((product, idx) => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:var(--space-3);">
          <div style="width:40px;height:40px;border-radius:var(--radius-md);overflow:hidden;background:var(--color-bg-alt);flex-shrink:0;">
            <img src="${product.imageUrl || getProductPlaceholder(product)}" alt="" style="width:100%;height:100%;object-fit:cover;">
          </div>
          <strong>${product.name}</strong>
        </div>
      </td>
      <td><span class="badge badge--primary">${CATEGORIES[product.category] || product.category}</span></td>
      <td>${product.variants.map(v => `${v.weight}: ${formatPrice(v.price)}`).join(', ')}</td>
      <td>${product.featured ? '⭐ Yes' : 'No'}</td>
      <td><span class="badge ${product.inStock ? 'badge--success' : 'badge--error'}">${product.inStock ? 'In Stock' : 'Out'}</span></td>
      <td>
        <div class="admin-table-actions">
          <button class="btn btn--secondary btn--sm edit-product-btn" data-id="${product.id}">✏️ Edit</button>
          <button class="btn btn--ghost btn--sm delete-product-btn" data-id="${product.id}" style="color:var(--color-error);">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.edit-product-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditProduct(btn.dataset.id));
  });

  tbody.querySelectorAll('.delete-product-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const product = products.find(p => p.id === id);
      if (product && confirm(`Delete "${product.name}"?`)) {
        await deleteProduct(id);
        await renderProducts();
        showToast('Product deleted', 'warning');
      }
    });
  });
}

function setupProductModal() {
  document.getElementById('addProductBtn').addEventListener('click', () => {
    editingProductId = null;
    document.getElementById('productModalTitle').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('variantList').innerHTML = `
      <div class="variant-row">
        <input type="text" class="form-input" placeholder="Weight (e.g. 1 kg)" style="width:40%;">
        <input type="number" class="form-input" placeholder="Price (₹)" style="width:40%;">
        <button type="button" class="btn btn--ghost btn--icon btn--sm" onclick="this.parentElement.remove()">✕</button>
      </div>
    `;
    document.getElementById('productModal').classList.add('active');
  });

  document.getElementById('saveProductBtn').addEventListener('click', saveProduct);
}

function openEditProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  editingProductId = productId;

  document.getElementById('productModalTitle').textContent = 'Edit Product';
  document.getElementById('prodName').value = product.name;
  document.getElementById('prodCategory').value = product.category;
  document.getElementById('prodDesc').value = product.description || '';
  document.getElementById('prodFeatured').checked = product.featured;
  document.getElementById('prodInStock').checked = product.inStock;

  const variantList = document.getElementById('variantList');
  variantList.innerHTML = product.variants.map(v => `
    <div class="variant-row">
      <input type="text" class="form-input" placeholder="Weight" style="width:40%;" value="${v.weight}">
      <input type="number" class="form-input" placeholder="Price" style="width:40%;" value="${v.price}">
      <button type="button" class="btn btn--ghost btn--icon btn--sm" onclick="this.parentElement.remove()">✕</button>
    </div>
  `).join('');

  document.getElementById('productModal').classList.add('active');
}

async function saveProduct() {
  const name = document.getElementById('prodName').value.trim();
  const category = document.getElementById('prodCategory').value;
  const description = document.getElementById('prodDesc').value.trim();
  const featured = document.getElementById('prodFeatured').checked;
  const inStock = document.getElementById('prodInStock').checked;

  if (!name) {
    showToast('Please enter product name', 'error');
    return;
  }

  const variantRows = document.querySelectorAll('#variantList .variant-row');
  const variants = [];
  variantRows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const weight = inputs[0].value.trim();
    const price = parseFloat(inputs[1].value);
    if (weight && price > 0) {
      variants.push({ weight, price });
    }
  });

  if (variants.length === 0) {
    showToast('Add at least one price variant', 'error');
    return;
  }

  const productData = {
    name,
    category,
    description,
    imageUrl: '',
    variants,
    featured,
    inStock
  };

  try {
    if (editingProductId !== null) {
      await updateProduct(editingProductId, productData);
      showToast('Product updated successfully!', 'success');
    } else {
      await addProduct(productData);
      showToast('Product added successfully!', 'success');
    }

    closeProductModal();
    await renderProducts();
  } catch (err) {
    console.error('Error saving product:', err);
    showToast('Error saving product', 'error');
  }
}

window.closeProductModal = function() {
  document.getElementById('productModal').classList.remove('active');
  editingProductId = null;
};

window.addVariantRow = function() {
  const row = document.createElement('div');
  row.className = 'variant-row';
  row.innerHTML = `
    <input type="text" class="form-input" placeholder="Weight (e.g. 5 kg)" style="width:40%;">
    <input type="number" class="form-input" placeholder="Price (₹)" style="width:40%;">
    <button type="button" class="btn btn--ghost btn--icon btn--sm" onclick="this.parentElement.remove()">✕</button>
  `;
  document.getElementById('variantList').appendChild(row);
};

// ---- Orders Management ----
async function renderOrders(statusFilter = 'all') {
  orders = await getOrders();
  let filtered = orders;
  if (statusFilter !== 'all') {
    filtered = orders.filter(o => o.status === statusFilter);
  }

  const tbody = document.getElementById('ordersTableBody');
  tbody.innerHTML = filtered.map((order) => {
    const date = order.createdAt?.toDate
      ? order.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
      : new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

    return `
      <tr>
        <td><strong>${order.orderId}</strong></td>
        <td>${order.customerName}</td>
        <td>${order.phone}</td>
        <td>${order.items.length}</td>
        <td><strong>${formatPrice(order.total)}</strong></td>
        <td style="text-transform:uppercase;font-size:var(--text-xs);font-weight:600;">${order.paymentMode}</td>
        <td>
          <select class="status-select status-select--${order.status}" data-id="${order.id}" onchange="changeOrderStatus(this)">
            <option value="placed" ${order.status === 'placed' ? 'selected' : ''}>📋 Placed</option>
            <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>✅ Confirmed</option>
            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>⚙️ Processing</option>
            <option value="out_for_delivery" ${order.status === 'out_for_delivery' ? 'selected' : ''}>🚚 Out for Delivery</option>
            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>📦 Delivered</option>
            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>❌ Cancelled</option>
          </select>
        </td>
        <td style="font-size:var(--text-xs);white-space:nowrap;">${date}</td>
        <td>
          <button class="btn btn--ghost btn--sm view-order-btn" data-id="${order.id}">👁️ View</button>
        </td>
      </tr>
    `;
  }).join('');

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:var(--space-8);color:var(--color-text-muted);">No orders found</td></tr>';
  }

  tbody.querySelectorAll('.view-order-btn').forEach(btn => {
    btn.addEventListener('click', () => viewOrderDetail(btn.dataset.id));
  });
}

window.changeOrderStatus = async function(selectEl) {
  const docId = selectEl.dataset.id;
  const newStatus = selectEl.value;

  selectEl.className = `status-select status-select--${newStatus}`;

  try {
    await updateOrderStatus(docId, newStatus);
    showToast(`Order status updated to "${getStatusLabel(newStatus)}"`, 'success');
  } catch (err) {
    console.error('Failed to update status:', err);
    showToast('Failed to update status', 'error');
  }
};

function viewOrderDetail(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  
  const body = document.getElementById('orderDetailBody');
  const date = order.createdAt?.toDate
    ? order.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  body.innerHTML = `
    <div style="margin-bottom:var(--space-6);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);">
        <h3>${order.orderId}</h3>
        <span class="badge ${getStatusBadgeClass(order.status)}">${getStatusLabel(order.status)}</span>
      </div>
      <div style="font-size:var(--text-sm);color:var(--color-text-muted);">${date}</div>
    </div>

    <div style="background:var(--color-bg-alt);padding:var(--space-4);border-radius:var(--radius-lg);margin-bottom:var(--space-6);">
      <div style="font-weight:var(--weight-semibold);margin-bottom:var(--space-2);">📍 Delivery Address</div>
      <div style="font-size:var(--text-sm);">
        <strong>${order.customerName}</strong><br>
        ${order.address}<br>
        ${order.city ? order.city + ' - ' : ''}${order.pincode}<br>
        📞 ${order.phone}
      </div>
    </div>

    <div style="margin-bottom:var(--space-6);">
      <div style="font-weight:var(--weight-semibold);margin-bottom:var(--space-3);">🛍️ Items</div>
      ${order.items.map(item => `
        <div style="display:flex;justify-content:space-between;padding:var(--space-2) 0;font-size:var(--text-sm);border-bottom:1px solid rgba(212,160,23,0.06);">
          <span>${item.name} (${item.weight}) × ${item.qty}</span>
          <strong>${formatPrice(item.price * item.qty)}</strong>
        </div>
      `).join('')}
    </div>

    <div style="background:var(--color-primary-50);padding:var(--space-4);border-radius:var(--radius-lg);">
      <div style="display:flex;justify-content:space-between;font-size:var(--text-sm);margin-bottom:var(--space-2);">
        <span>Subtotal</span><span>${formatPrice(order.subtotal)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:var(--text-sm);margin-bottom:var(--space-2);">
        <span>Delivery</span><span>${order.deliveryCharge > 0 ? formatPrice(order.deliveryCharge) : 'FREE'}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-weight:var(--weight-bold);font-size:var(--text-lg);padding-top:var(--space-2);border-top:1px solid rgba(212,160,23,0.2);">
        <span>Total</span><span style="color:var(--color-primary-600);">${formatPrice(order.total)}</span>
      </div>
    </div>

    <div style="margin-top:var(--space-4);font-size:var(--text-sm);color:var(--color-text-muted);">
      Payment: <strong style="text-transform:uppercase;">${order.paymentMode}</strong>
    </div>
  `;

  document.getElementById('orderDetailModal').classList.add('active');
}

function setupOrderFilter() {
  const filterSelect = document.getElementById('orderStatusFilter');
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      renderOrders(e.target.value);
    });
  }
}

// ---- Delivery Rates ----
async function renderDeliveryRates() {
  deliveryRates = await getDeliveryRates();
  const container = document.getElementById('deliveryZonesList');
  
  container.innerHTML = deliveryRates.map((zone) => `
    <div class="zone-card admin-card" style="border-radius:var(--radius-xl);">
      <div class="zone-card__info" style="flex:1;">
        <h4>${zone.zoneName}</h4>
        <div style="font-size:var(--text-sm);color:var(--color-text-muted);margin-top:var(--space-1);">
          Free delivery above ${formatPrice(zone.freeAbove || 0)}
        </div>
        <div class="zone-card__pincodes">
          ${(zone.pincodes || []).map(p => `<span class="zone-card__pincode">${p}</span>`).join('')}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:var(--space-3);">
        <div class="zone-card__rate">
          <div class="rate-value">${formatPrice(zone.rate)}</div>
          <div class="rate-label">per order</div>
        </div>
        <div style="display:flex;gap:var(--space-2);">
          <button class="btn btn--secondary btn--sm edit-zone-btn" data-id="${zone.id}">✏️ Edit</button>
          <button class="btn btn--ghost btn--sm delete-zone-btn" data-id="${zone.id}" style="color:var(--color-error);">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');

  if (deliveryRates.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🚚</div>
        <h3 class="empty-state__title">No delivery zones</h3>
        <p class="empty-state__desc">Add your first delivery zone to start accepting orders</p>
      </div>
    `;
  }

  container.querySelectorAll('.edit-zone-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditZone(btn.dataset.id));
  });

  container.querySelectorAll('.delete-zone-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const zone = deliveryRates.find(r => r.id === id);
      if (zone && confirm(`Delete zone "${zone.zoneName}"?`)) {
        await deleteDeliveryRate(id);
        await renderDeliveryRates();
        showToast('Zone deleted', 'warning');
      }
    });
  });
}

function setupZoneModal() {
  document.getElementById('addZoneBtn').addEventListener('click', () => {
    editingZoneId = null;
    document.getElementById('zoneModalTitle').textContent = 'Add Delivery Zone';
    document.getElementById('zoneForm').reset();
    document.getElementById('zoneModal').classList.add('active');
  });

  document.getElementById('saveZoneBtn').addEventListener('click', saveZone);
}

function openEditZone(zoneId) {
  const zone = deliveryRates.find(r => r.id === zoneId);
  if (!zone) return;
  editingZoneId = zoneId;

  document.getElementById('zoneModalTitle').textContent = 'Edit Delivery Zone';
  document.getElementById('zoneName').value = zone.zoneName;
  document.getElementById('zonePincodes').value = (zone.pincodes || []).join(', ');
  document.getElementById('zoneRate').value = zone.rate;
  document.getElementById('zoneFreeAbove').value = zone.freeAbove || 0;

  document.getElementById('zoneModal').classList.add('active');
}

async function saveZone() {
  const zoneName = document.getElementById('zoneName').value.trim();
  const pincodesStr = document.getElementById('zonePincodes').value.trim();
  const rate = parseFloat(document.getElementById('zoneRate').value);
  const freeAbove = parseFloat(document.getElementById('zoneFreeAbove').value) || 0;

  if (!zoneName || !pincodesStr || isNaN(rate)) {
    showToast('Please fill all required fields', 'error');
    return;
  }

  const pincodes = pincodesStr.split(',').map(p => p.trim()).filter(p => p.length > 0);
  const zoneData = { zoneName, pincodes, rate, freeAbove };

  try {
    if (editingZoneId !== null) {
      await updateDeliveryRate(editingZoneId, zoneData);
      showToast('Zone updated!', 'success');
    } else {
      await addDeliveryRate(zoneData);
      showToast('Zone added!', 'success');
    }

    closeZoneModal();
    await renderDeliveryRates();
  } catch (err) {
    console.error('Error saving zone:', err);
    showToast('Error saving zone', 'error');
  }
}

window.closeZoneModal = function() {
  document.getElementById('zoneModal').classList.remove('active');
  editingZoneId = null;
};

// ---- Store Settings ----
async function setupSettings() {
  const form = document.getElementById('settingsForm');
  if (form) {
    try {
      const saved = await getStoreSettings();
      if (saved) {
        if (saved.storeName) document.getElementById('settingStoreName').value = saved.storeName;
        if (saved.phone) document.getElementById('settingPhone').value = saved.phone;
        if (saved.whatsapp) document.getElementById('settingWhatsapp').value = saved.whatsapp;
        if (saved.freeDeliveryThreshold) document.getElementById('settingFreeDelivery').value = saved.freeDeliveryThreshold;
        if (saved.address) document.getElementById('settingAddress').value = saved.address;
        if (saved.fssaiRegNo) document.getElementById('settingFssaiRegNo').value = saved.fssaiRegNo;
        if (saved.fssaiValidUpto) document.getElementById('settingFssaiValidUpto').value = saved.fssaiValidUpto;
        if (saved.fssaiAddress) document.getElementById('settingFssaiAddress').value = saved.fssaiAddress;
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const settings = {
        storeName: document.getElementById('settingStoreName').value,
        phone: document.getElementById('settingPhone').value,
        whatsapp: document.getElementById('settingWhatsapp').value,
        freeDeliveryThreshold: parseFloat(document.getElementById('settingFreeDelivery').value) || 500,
        address: document.getElementById('settingAddress').value,
        fssaiRegNo: document.getElementById('settingFssaiRegNo').value,
        fssaiValidUpto: document.getElementById('settingFssaiValidUpto').value,
        fssaiAddress: document.getElementById('settingFssaiAddress').value
      };
      
      try {
        await updateStoreSettings(settings);
        showToast('Settings & FSSAI credentials saved successfully!', 'success');
      } catch (err) {
        console.error('Error saving settings:', err);
        showToast('Error saving settings', 'error');
      }
    });
  }
}
