// ============================================
// WHATSAPP FLOATING WIDGET (Supports Both Numbers)
// Numbers: 7392866843 & 8808992699
// ============================================

export function initWhatsappWidget() {
  const floatBtn = document.getElementById('whatsappFloat');
  const menu = document.getElementById('whatsappMenu');
  const closeBtn = document.getElementById('whatsappClose');

  if (!floatBtn || !menu) return;

  function toggleMenu(e) {
    if (e) e.preventDefault();
    const isActive = menu.classList.contains('active');
    if (isActive) {
      menu.classList.remove('active');
      menu.setAttribute('aria-hidden', 'true');
    } else {
      menu.classList.add('active');
      menu.setAttribute('aria-hidden', 'false');
    }
  }

  function closeMenu() {
    menu.classList.remove('active');
    menu.setAttribute('aria-hidden', 'true');
  }

  floatBtn.addEventListener('click', toggleMenu);

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !floatBtn.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhatsappWidget);
  } else {
    initWhatsappWidget();
  }
}
