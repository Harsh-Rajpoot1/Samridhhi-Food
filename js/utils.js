// ============================================
// SHARED UTILITIES
// ============================================

/**
 * Format price in INR
 */
export function formatPrice(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

/**
 * Format date
 */
export function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format short date
 */
export function formatShortDate(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Generate unique order ID
 */
export function generateOrderId() {
  const prefix = 'SAC';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Show toast notification
 */
export function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠'
  };
  toast.innerHTML = `
    <span style="font-size: 1.2rem;">${icons[type] || '✓'}</span>
    <span class="toast__message">${message}</span>
    <button class="toast__close" onclick="this.parentElement.remove()">✕</button>
  `;

  container.appendChild(toast);

  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Scroll reveal observer
 */
export function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible', 'in');
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-print, .reveal-stamp, .reveal-left, .reveal-right, .reveal-scale, .stagger-children').forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Navbar scroll effect
 */
export function initNavbarScroll() {
  const navbar = document.querySelector('.navbar, .bar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * Mobile menu toggle
 */
export function initMobileMenu() {
  const toggle = document.querySelector('.navbar__toggle');
  const links = document.querySelector('.navbar__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });

    links.querySelectorAll('.navbar__link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  // Support details.mnav modern mobile menu
  document.querySelectorAll('.mnav-link').forEach(link => {
    link.addEventListener('click', () => {
      const details = link.closest('details');
      if (details) details.removeAttribute('open');
    });
  });

  // Close details.mnav when clicking outside
  document.addEventListener('click', (e) => {
    document.querySelectorAll('details.mnav[open]').forEach(details => {
      if (!details.contains(e.target)) {
        details.removeAttribute('open');
      }
    });
  });
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Get status label
 */
export function getStatusLabel(status) {
  const labels = {
    placed: 'Order Placed',
    confirmed: 'Confirmed',
    processing: 'Processing',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  return labels[status] || status;
}

/**
 * Get status badge class
 */
export function getStatusBadgeClass(status) {
  const classes = {
    placed: 'badge--info',
    confirmed: 'badge--primary',
    processing: 'badge--warning',
    out_for_delivery: 'badge--success',
    delivered: 'badge--success',
    cancelled: 'badge--error'
  };
  return classes[status] || 'badge--info';
}

/**
 * Category display names
 */
export const CATEGORIES = {
  all: 'All Products',
  wheat: 'Wheat Atta',
  multigrain: 'Multigrain',
  besan: 'Besan',
  maida: 'Maida',
  rice: 'Rice Flour',
  millet: 'Millet Flour'
};

/**
 * Category icons
 */
export const CATEGORY_ICONS = {
  wheat: '🌾',
  multigrain: '🌿',
  besan: '🫘',
  maida: '🍚',
  rice: '🍙',
  millet: '🌱'
};
