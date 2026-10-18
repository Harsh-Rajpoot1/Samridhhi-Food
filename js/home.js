// ============================================
// HOME PAGE — Editorial / Artisanal Script
// Inspired by milletnyou.com aesthetic
// ============================================

import { initScrollReveal, initNavbarScroll, formatPrice, CATEGORIES } from './utils.js';
import { updateCartBadge } from './cart.js';
import { SAMPLE_TESTIMONIALS, getProductPlaceholder } from './sample-data.js';
import { getProducts, getFeaturedProducts } from './db.js';

let carouselTimer = null;
let carouselIndex = 0;
let carouselPaused = false;
let carouselPlates = [];
let carouselTicks = [];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileNav();
  updateCartBadge();
  setupHeroCarousel();
  renderManifest();
  renderTestimonials();

  // Reveal elements on scroll
  requestAnimationFrame(() => {
    setTimeout(initScrollReveal, 60);
  });
});

/**
 * Handle mobile details nav closing on link click
 */
function initMobileNav() {
  document.querySelectorAll('.mnav-link').forEach(link => {
    link.addEventListener('click', () => {
      const details = link.closest('details');
      if (details) details.removeAttribute('open');
    });
  });
}

/**
 * Setup Hero Product Showcase Carousel
 */
async function setupHeroCarousel() {
  const platesContainer = document.getElementById('heroPlates');
  const ticksContainer = document.getElementById('carTicks');
  const toggleBtn = document.getElementById('carToggle');
  if (!platesContainer) return;

  let items = await getFeaturedProducts();
  if (!items || items.length === 0) {
    const all = await getProducts();
    items = all.slice(0, 4);
  }

  const panels = ['panel-apricot', 'panel-coral', 'panel-saffron', 'panel-teal'];

  platesContainer.innerHTML = items.map((product, idx) => {
    const variant = product.variants?.[0] || { price: 45, weight: '1 kg' };
    const imgSrc = product.imageUrl || (idx === 0 ? 'images/hero.jpg' : getProductPlaceholder(product));
    const panelClass = panels[idx % panels.length];
    const catLabel = CATEGORIES[product.category] || product.category;

    return `
      <div class="plate ${panelClass} ${idx === 0 ? 'is-active' : ''}" data-idx="${idx}">
        <img src="${imgSrc}" alt="${product.name}" class="plate-img" loading="eager">
        <div class="plate-info">
          <div>
            <div class="plate-cat">${catLabel}</div>
            <div class="plate-name">${product.name}</div>
          </div>
          <div class="plate-price">
            ${formatPrice(variant.price)}
            <small>/ ${variant.weight}</small>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (ticksContainer) {
    ticksContainer.innerHTML = items.map((_, idx) => `
      <button type="button" class="car-tick ${idx === 0 ? 'is-active' : ''}" data-idx="${idx}" aria-label="Go to slide ${idx + 1}"></button>
    `).join('');

    carouselTicks = Array.from(ticksContainer.querySelectorAll('.car-tick'));
    carouselTicks.forEach(tick => {
      tick.addEventListener('click', () => {
        const idx = parseInt(tick.getAttribute('data-idx'), 10);
        goToSlide(idx);
      });
    });
  }

  carouselPlates = Array.from(platesContainer.querySelectorAll('.plate'));

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      carouselPaused = !carouselPaused;
      toggleBtn.textContent = carouselPaused ? 'Play' : 'Pause';
    });
  }

  // Hover to pause
  platesContainer.addEventListener('mouseenter', () => { carouselPaused = true; });
  platesContainer.addEventListener('mouseleave', () => {
    if (toggleBtn && toggleBtn.textContent !== 'Play') {
      carouselPaused = false;
    }
  });

  startCarousel();
}

function startCarousel() {
  if (carouselTimer) clearInterval(carouselTimer);
  carouselTimer = setInterval(() => {
    if (carouselPaused || carouselPlates.length <= 1) return;
    goToSlide((carouselIndex + 1) % carouselPlates.length);
  }, 4000);
}

function goToSlide(nextIndex) {
  if (carouselPlates.length === 0) return;
  carouselPlates[carouselIndex]?.classList.remove('is-active');
  carouselTicks[carouselIndex]?.classList.remove('is-active');

  carouselIndex = nextIndex;

  carouselPlates[carouselIndex]?.classList.add('is-active');
  carouselTicks[carouselIndex]?.classList.add('is-active');
}

/**
 * Render Manifest list ("This week's goods")
 */
async function renderManifest() {
  const container = document.getElementById('manifestRows');
  const countEl = document.getElementById('productCount');
  if (!container) return;

  const products = await getProducts();

  if (countEl) {
    countEl.textContent = `${products.length} items declared`;
  }

  container.innerHTML = products.map((product) => {
    const variant = product.variants?.[0] || { price: 45, weight: '1 kg' };
    const imgSrc = product.imageUrl || getProductPlaceholder(product);
    const catLabel = CATEGORIES[product.category] || product.category;

    return `
      <a href="products.html?id=${product.id}" class="good">
        <img src="${imgSrc}" alt="${product.name}" loading="lazy">
        <div class="good-text">
          <span class="name">${product.name}</span>
          <span class="decl">${product.description}</span>
        </div>
        <span class="cat">${catLabel}</span>
        <div class="gprice">
          ${formatPrice(variant.price)}
          <small>/ ${variant.weight}</small>
        </div>
      </a>
    `;
  }).join('');

  // Re-observe newly rendered rows for scroll reveal
  initScrollReveal();
}

/**
 * Render Testimonials
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
