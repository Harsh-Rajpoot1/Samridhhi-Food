// ============================================
// HOME PAGE — Main Script
// ============================================

import { initScrollReveal, initNavbarScroll, initMobileMenu, formatPrice } from './utils.js';
import { updateCartBadge } from './cart.js';
import { SAMPLE_PRODUCTS, SAMPLE_TESTIMONIALS, getProductPlaceholder } from './sample-data.js';

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  updateCartBadge();
  renderFeaturedProducts();
  renderTestimonials();
  setHeroImage();

  // Init scroll reveal slightly delayed to allow DOM render
  requestAnimationFrame(() => {
    initScrollReveal();
  });
});

/**
 * Set hero image placeholder
 */
function setHeroImage() {
  const heroImg = document.getElementById('heroImage');
  if (heroImg) {
    heroImg.src = getProductPlaceholder({
      name: 'Fresh Atta',
      category: 'wheat'
    });
    heroImg.alt = 'Fresh Stone-Ground Wheat Flour';
  }
}

import { getFeaturedProducts } from './db.js';

/**
 * Render featured products
 */
async function renderFeaturedProducts() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  // Render skeletons first
  grid.innerHTML = Array(4).fill(0).map(() => `
    <div class="card" style="pointer-events: none;">
      <div class="skeleton" style="aspect-ratio: 4/3; width: 100%;"></div>
      <div class="card__body" style="padding: var(--space-6);">
        <div class="skeleton" style="height: 16px; width: 40%; margin-bottom: 8px;"></div>
        <div class="skeleton" style="height: 24px; width: 85%; margin-bottom: 12px;"></div>
        <div class="skeleton" style="height: 40px; width: 100%;"></div>
      </div>
    </div>
  `).join('');

  const featured = await getFeaturedProducts();

  grid.innerHTML = featured.map(product => {
    const imgSrc = product.imageUrl || getProductPlaceholder(product);
    const firstVariant = product.variants[0];

    return `
      <div class="card hover-lift">
        <div style="position: relative; aspect-ratio: 4/3; overflow: hidden; background: var(--color-bg-alt);">
          <img src="${imgSrc}" alt="${product.name}" class="card__image" style="width:100%; height:100%; object-fit: cover;">
        </div>
        <div class="card__body">
          <span class="card__tag">${getCategoryLabel(product.category)}</span>
          <h3 class="card__title">${product.name}</h3>
          <p class="card__desc">${product.description}</p>
          <div class="card__price">
            ${formatPrice(firstVariant.price)} <small>/ ${firstVariant.weight}</small>
          </div>
          <div class="card__actions">
            <a href="/products.html" class="btn btn--primary btn--sm" style="flex:1;">View Details</a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}


/**
 * Render testimonials
 */
function renderTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;

  grid.innerHTML = SAMPLE_TESTIMONIALS.map(t => `
    <div class="testimonial-card">
      <div class="testimonial-card__stars">${'★'.repeat(t.rating)}</div>
      <p class="testimonial-card__text">"${t.text}"</p>
      <div class="testimonial-card__author">
        <div class="testimonial-card__avatar">${t.initials}</div>
        <div>
          <div class="testimonial-card__name">${t.name}</div>
          <div class="testimonial-card__location">${t.location}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function getCategoryLabel(cat) {
  const labels = {
    wheat: 'Wheat Atta',
    multigrain: 'Multigrain',
    besan: 'Besan',
    maida: 'Maida',
    rice: 'Rice Flour',
    millet: 'Millet Flour'
  };
  return labels[cat] || cat;
}
