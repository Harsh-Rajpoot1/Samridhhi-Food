// ============================================
// STORE POLICIES MODAL (Privacy, Terms, Shipping, Refund)
// ============================================

const POLICIES = {
  privacy: {
    title: 'Privacy Policy',
    tag: 'Your data is safe with us',
    content: `
      <p>At <strong>Shree Samvriddhi Foods</strong>, your privacy and trust are our highest priorities. We are committed to safeguarding all personal information you provide when placing an order or contacting us.</p>
      <h4>Information We Collect</h4>
      <p>When you place an order, we collect your name, contact phone number, delivery address, and pincode solely for the purpose of milling, packing, and delivering your freshly stone-ground flour.</p>
      <h4>How We Use Your Data</h4>
      <ul>
        <li>To fulfill and deliver your flour orders within 24 hours.</li>
        <li>To send WhatsApp or SMS tracking and order status updates.</li>
        <li>To provide customer support regarding your chakki orders.</li>
      </ul>
      <h4>Data Protection &amp; Third Parties</h4>
      <p>We <strong>never sell, rent, or trade</strong> your personal contact or address data to any advertising or data brokerage third parties. All transactions and details are held strictly confidential.</p>
    `
  },
  terms: {
    title: 'Terms & Conditions',
    tag: 'Fresh Chakki Orders & Service Terms',
    content: `
      <p>By placing an order on <strong>Shree Samvriddhi Foods</strong>, you agree to the following terms and conditions:</p>
      <h4>Freshly Ground to Order</h4>
      <p>Every product ordered from our flour mill is ground fresh daily using traditional slow stone chakkis without artificial additives or preservatives. Grain consistency and natural texture reflect authentic whole-grain stone milling.</p>
      <h4>Pricing &amp; Availability</h4>
      <p>All prices listed on the website are in Indian Rupees (INR) inclusive of applicable taxes. In the rare event of raw grain shortage, our team will promptly contact you via phone or WhatsApp.</p>
      <h4>FSSAI Statutory Compliance</h4>
      <p>Shree Samvriddhi Foods is registered under the Food Safety and Standards Act, 2006 (FSSAI Registration No. <strong>22726102000723</strong>) for general food manufacturing.</p>
    `
  },
  shipping: {
    title: 'Shipping & Delivery Policy',
    tag: 'Doorstep Freshness within 24 Hours',
    content: `
      <h4>Fast 24-Hour Dispatch &amp; Delivery</h4>
      <p>We grind your flour fresh after order placement. Orders placed before 4:00 PM are milled, sealed, and delivered directly to your doorstep within 24 hours in local coverage zones.</p>
      <h4>Delivery Rates &amp; Free Shipping</h4>
      <ul>
        <li><strong>Free Delivery:</strong> All orders above ₹500 qualify for FREE doorstep delivery in local areas.</li>
        <li><strong>Standard Local Rate:</strong> Nominal flat delivery charges (₹30 – ₹80) apply based on pincode distance for orders under ₹500.</li>
      </ul>
      <h4>Packaging Standard</h4>
      <p>All flours are packed in food-grade, multi-layer moisture-resistant bags to ensure freshness and prevent atmospheric contamination during transit.</p>
    `
  },
  refund: {
    title: 'Refund & Replacement Policy',
    tag: '100% Quality & Freshness Guarantee',
    content: `
      <h4>Freshness Assurance</h4>
      <p>We take pride in delivering the highest quality, authentic stone-ground flours. If you receive an order where the packaging is torn, damaged, or the product quality does not meet our pure chakki standard, we will gladly replace it or issue a full refund.</p>
      <h4>How to Request a Replacement / Refund</h4>
      <ol>
        <li>Contact our chakki helpline via WhatsApp or phone at <strong>+91 98765 43210</strong> within 48 hours of delivery.</li>
        <li>Share your Order ID (e.g. <code>SAC-XXXX</code>) and a brief photo of the packaging issue.</li>
        <li>Our team will arrange a free replacement bag or process an immediate refund via original payment mode or UPI within 2 business days.</li>
      </ol>
    `
  }
};

export function initPolicyModal() {
  if (document.getElementById('policyModal')) {
    attachPolicyTriggers();
    return;
  }

  const modalHtml = `
    <div class="fssai-modal-overlay" id="policyModal" style="display:none;" role="dialog" aria-modal="true">
      <div class="fssai-modal" style="max-width:640px;">
        <div class="fssai-modal__header">
          <div>
            <span class="fssai-modal__gov-tag" id="policyModalTag" style="color:var(--color-saffron-deep);">Policy</span>
            <h2 class="fssai-modal__title" id="policyModalTitle">Policy Details</h2>
          </div>
          <button type="button" class="fssai-modal__close" id="policyModalClose">✕</button>
        </div>
        <div class="fssai-modal__body" id="policyModalBody" style="font-size:var(--text-sm);line-height:1.6;color:var(--color-ink-soft);">
        </div>
        <div class="fssai-modal__footer" style="justify-content:flex-end;">
          <button type="button" class="btn btn--primary btn--sm" id="policyModalOk">Got it</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modal = document.getElementById('policyModal');
  const close = () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  document.getElementById('policyModalClose')?.addEventListener('click', close);
  document.getElementById('policyModalOk')?.addEventListener('click', close);
  modal?.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  attachPolicyTriggers();
}

export function openPolicy(policyKey) {
  const policy = POLICIES[policyKey] || POLICIES.privacy;
  const modal = document.getElementById('policyModal');
  if (!modal) {
    initPolicyModal();
    return openPolicy(policyKey);
  }

  document.getElementById('policyModalTitle').textContent = policy.title;
  document.getElementById('policyModalTag').textContent = policy.tag;
  document.getElementById('policyModalBody').innerHTML = policy.content;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function attachPolicyTriggers() {
  document.querySelectorAll('[data-open-policy]').forEach(btn => {
    btn.removeEventListener('click', handlePolicyClick);
    btn.addEventListener('click', handlePolicyClick);
  });
}

function handlePolicyClick(e) {
  e.preventDefault();
  const key = this.getAttribute('data-open-policy');
  openPolicy(key);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPolicyModal);
  } else {
    initPolicyModal();
  }
}
