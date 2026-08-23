// ============================================
// PRODUCTS PAGE — Script
// ============================================

import { initMobileMenu, formatPrice, debounce, initScrollReveal, CATEGORIES } from './utils.js';
import { updateCartBadge, addToCart } from './cart.js';
import { SAMPLE_PRODUCTS, getProductPlaceholder } from './sample-data.js';

import { getProducts } from './db.js';

let allProducts = [];
let filteredProducts = [];
let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'default';

document.addEventListener('DOMContentLoaded', async () => {
  initMobileMenu();
  updateCartBadge();

  // Render skeletons first
  const grid = document.getElementById('productsGrid');
  if (grid) {
    grid.innerHTML = Array(8).fill(0).map(() => `
      <div class="product-card" style="pointer-events: none;">
        <div class="skeleton" style="aspect-ratio: 1; width: 100%;"></div>
        <div class="product-card__body" style="padding: var(--space-5);">
          <div class="skeleton" style="height: 12px; width: 30%; margin-bottom: 8px;"></div>
          <div class="skeleton" style="height: 20px; width: 80%; margin-bottom: 8px;"></div>
          <div class="skeleton" style="height: 36px; width: 100%; margin-bottom: 12px;"></div>
          <div class="skeleton" style="height: 32px; width: 100%;"></div>
        </div>
      </div>
    `).join('');
  }

  // Load products from DB
  allProducts = await getProducts();
  filteredProducts = [...allProducts];

  // Check URL params for category
  const params = new URLSearchParams(window.location.search);
  if (params.get('cat')) {
    currentCategory = params.get('cat');
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === currentCategory);
    });
  }

  applyFilters();
  setupFilters();

  requestAnimationFrame(() => initScrollReveal());
});


function setupFilters() {
  // Category filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      applyFilters();
    });
  });

  // Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      applyFilters();
    }, 300));
  }

  // Sort select
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFilters();
    });
  }
}

function applyFilters() {
  filteredProducts = allProducts.filter(p => {
    const catMatch = currentCategory === 'all' || p.category === currentCategory;
    const searchMatch = !currentSearch ||
      p.name.toLowerCase().includes(currentSearch) ||
      p.description.toLowerCase().includes(currentSearch) ||
      p.category.toLowerCase().includes(currentSearch);
    return catMatch && searchMatch;
  });

  // Sort
  switch (currentSort) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.variants[0].price - b.variants[0].price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.variants[0].price - a.variants[0].price);
      break;
    case 'name':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const countEl = document.getElementById('productsCount');
  if (!grid) return;

  if (countEl) {
    const catLabel = currentCategory === 'all' ? 'all' : CATEGORIES[currentCategory] || currentCategory;
    countEl.textContent = `Showing ${filteredProducts.length} ${catLabel} product${filteredProducts.length !== 1 ? 's' : ''}`;
  }

  if (filteredProducts.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="empty-state__icon">🔍</div>
        <h3 class="empty-state__title">No products found</h3>
        <p class="empty-state__desc">Try adjusting your filters or search terms</p>
        <button class="btn btn--primary" onclick="document.querySelector('.filter-btn').click()">Show All Products</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredProducts.map((product, idx) => {
    const imgSrc = product.imageUrl || getProductPlaceholder(product);
    const firstVariant = product.variants[0];

    return `
      <div class="product-card ${!product.inStock ? 'out-of-stock' : ''}" data-product-id="${product.id}">
        <div class="product-card__image">
          <img src="${imgSrc}" alt="${product.name}" loading="lazy">
          ${product.featured ? '<span class="product-card__badge"><span class="badge badge--primary">⭐ Featured</span></span>' : ''}
          ${product.inStock ? `
            <div class="product-card__quick-add">
              <button class="btn btn--primary btn--sm add-to-cart-btn" data-idx="${idx}">+ Add</button>
            </div>
          ` : ''}
        </div>
        <div class="product-card__body">
          <div class="product-card__category">${CATEGORIES[product.category] || product.category}</div>
          <h3 class="product-card__name">${product.name}</h3>
          <p class="product-card__desc">${product.description}</p>
          <div class="product-card__variants">
            ${product.variants.map((v, vi) => `
              <button class="variant-btn ${vi === 0 ? 'active' : ''}"
                data-product-idx="${idx}" data-variant-idx="${vi}"
                data-price="${v.price}">
                ${v.weight}
              </button>
            `).join('')}
          </div>
          <div class="product-card__footer">
            <div class="product-card__price" id="price-${idx}">
              ${formatPrice(firstVariant.price)} <small>/ ${firstVariant.weight}</small>
            </div>
            ${product.inStock ? `
              <button class="btn btn--primary btn--sm add-to-cart-btn" data-idx="${idx}">🛒 Add</button>
            ` : `
              <span class="badge badge--error">Out of Stock</span>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach variant button listeners
  grid.querySelectorAll('.variant-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const productIdx = parseInt(btn.dataset.productIdx);
      const variantIdx = parseInt(btn.dataset.variantIdx);
      const product = filteredProducts[productIdx];
      const variant = product.variants[variantIdx];

      // Update active state within this card
      btn.closest('.product-card__variants').querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update price display
      const priceEl = document.getElementById(`price-${productIdx}`);
      if (priceEl) {
        priceEl.innerHTML = `${formatPrice(variant.price)} <small>/ ${variant.weight}</small>`;
      }

      // Update add to cart buttons data
      btn.closest('.product-card').querySelectorAll('.add-to-cart-btn').forEach(addBtn => {
        addBtn.dataset.variantIdx = variantIdx;
      });
    });
  });

  // Attach add to cart listeners
  grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productIdx = parseInt(btn.dataset.idx);
      const product = filteredProducts[productIdx];
      const variantIdx = parseInt(btn.dataset.variantIdx || 0);

      // Find active variant
      const card = btn.closest('.product-card');
      const activeVariant = card?.querySelector('.variant-btn.active');
      const finalVariantIdx = activeVariant ? parseInt(activeVariant.dataset.variantIdx) : variantIdx;

      addToCart(product, finalVariantIdx, 1);
    });
  });

  // Re-init scroll reveal for new elements
  requestAnimationFrame(() => initScrollReveal());
}
