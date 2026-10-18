// ============================================
// FSSAI LICENSE & CERTIFICATE MODAL
// Government of Uttar Pradesh / FSSAI Registration
// Registration Number: 22726102000723
// ============================================

export const FSSAI_DATA = {
  regNumber: '22726102000723',
  fboName: 'Shree Samvriddhi Foods',
  fssAct: 'Food Safety and Standards Act, 2006 (FSS Act, 2006)',
  authority: 'Government of Uttar Pradesh, Department of Food Safety and Drug Administration',
  kindOfBusiness: 'General Manufacturing',
  place: 'Lucknow',
  issuedOn: '15-09-2026',
  validUpto: '14-09-2027',
  userId: '109635',
  registeredAddress: '00 Near ITI Hostel, Indaurabagh, Lucknow, Indara, Bakshi Ka Talab Tahsil, Lucknow, Uttar Pradesh - 226202',
  nearestLandmark: 'ITI Hostel',
  annualTurnoverLimit: 'Upto Rs. 1.5 Crore only',
  portalUrl: 'https://foscos.fssai.gov.in',
  helpline: '1800112100',
  approvedProducts: [
    { no: 1, name: 'Wheat Flour (Atta) and Resultant Wheat Flour', code: '06.2.1', category: 'Cereals & Flours' },
    { no: 2, name: 'Besan (Gram Flour)', code: '06.2.1', category: 'Pulses & Flours' },
    { no: 3, name: 'Bajra Flour (Pearl Millet Flour)', code: '06.2.1', category: 'Millets & Flours' },
    { no: 4, name: 'Jowar Flour (Sorghum Flour)', code: '06.2.1', category: 'Millets & Flours' },
    { no: 5, name: 'Whole Maize (Corn) Flour', code: '06.2.1', category: 'Cereals & Flours' },
    { no: 6, name: 'Wheat Bran (Choker)', code: '6.2.1', category: 'Cereals & By-products' },
    { no: 7, name: 'Ragi Flour (Finger Millet)', code: '6.2.1', category: 'Millets & Flours' },
    { no: 8, name: 'Multigrain Flour (Atta)', code: '6.2.1', category: 'Mixed Flours' },
    { no: 9, name: 'Mixed Millet Flour', code: '6.2.1', category: 'Millets & Flours' },
    { no: 10, name: 'Rice Flour for preparation of Fortified Rice Kernel (FRK)', code: '6.2.1', category: 'Rice & Flours' },
    { no: 11, name: 'Protein Rich Wheat Flour (Protein Prachur Atta)', code: '06.2.1', category: 'Fortified Flours' }
  ]
};

/**
 * Injects and initializes the FSSAI Modal in the DOM
 */
export function initFssaiModal() {
  if (document.getElementById('fssaiModal')) {
    attachTriggers();
    return;
  }

  const modalHtml = `
  <div class="fssai-modal-overlay" id="fssaiModal" role="dialog" aria-modal="true" aria-labelledby="fssaiModalTitle" style="display:none;">
    <div class="fssai-modal">
      <!-- Modal Header -->
      <div class="fssai-modal__header">
        <div class="fssai-modal__header-left">
          <img src="images/fssai-logo.svg" alt="FSSAI Logo" class="fssai-modal__logo">
          <div>
            <div class="fssai-modal__gov-tag">Government of Uttar Pradesh · Dept. of Food Safety &amp; Drug Administration</div>
            <h2 class="fssai-modal__title" id="fssaiModalTitle">Registration Certificate under FSS Act, 2006</h2>
          </div>
        </div>
        <button type="button" class="fssai-modal__close" id="fssaiCloseBtn" aria-label="Close Certificate Modal">✕</button>
      </div>

      <!-- Registration Number Banner -->
      <div class="fssai-modal__badge-strip">
        <div class="fssai-reg-box">
          <span class="fssai-reg-box__label">पंजीकरण संख्या / REGISTRATION NO.</span>
          <span class="fssai-reg-box__num" id="fssaiRegNum">22726102000723</span>
          <button type="button" class="fssai-copy-btn" id="fssaiCopyBtn" title="Copy Registration Number">📋 Copy</button>
        </div>
        <div class="fssai-status-pill">
          <span class="fssai-status-dot"></span>
          <span>Status: <strong>Active &amp; Valid</strong></span>
          <span class="fssai-valid-date">Valid Upto: <strong>14-09-2027</strong></span>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="fssai-modal__tabs">
        <button type="button" class="fssai-tab active" data-fssai-tab="overview">📄 Certificate Details</button>
        <button type="button" class="fssai-tab" data-fssai-tab="products">🌾 Approved Products (${FSSAI_DATA.approvedProducts.length})</button>
        <button type="button" class="fssai-tab" data-fssai-tab="verify">🛡️ Government Verification</button>
      </div>

      <!-- Tab Content Area -->
      <div class="fssai-modal__body">
        <!-- TAB 1: Certificate Overview -->
        <div class="fssai-tab-panel active" id="fssaiTab-overview">
          <div class="fssai-card-grid">
            <div class="fssai-info-item">
              <span class="fssai-info-label">Food Business Operator (FBO) Name</span>
              <span class="fssai-info-value"><strong>${FSSAI_DATA.fboName}</strong></span>
            </div>
            <div class="fssai-info-item">
              <span class="fssai-info-label">Kind of Business (कारोबार का प्रकार)</span>
              <span class="fssai-info-value"><strong>${FSSAI_DATA.kindOfBusiness}</strong></span>
            </div>
            <div class="fssai-info-item">
              <span class="fssai-info-label">Registration Number</span>
              <span class="fssai-info-value mono"><strong>${FSSAI_DATA.regNumber}</strong></span>
            </div>
            <div class="fssai-info-item">
              <span class="fssai-info-label">Issuing Authority &amp; Place</span>
              <span class="fssai-info-value">${FSSAI_DATA.place}, Uttar Pradesh (User ID: ${FSSAI_DATA.userId})</span>
            </div>
            <div class="fssai-info-item">
              <span class="fssai-info-label">Date of Issue (जारी दिनांक)</span>
              <span class="fssai-info-value">${FSSAI_DATA.issuedOn}</span>
            </div>
            <div class="fssai-info-item">
              <span class="fssai-info-label">Fee Paid Validity (भुगतान फीस वैधता)</span>
              <span class="fssai-info-value text-success"><strong>${FSSAI_DATA.validUpto}</strong></span>
            </div>
            <div class="fssai-info-item fssai-info-item--full">
              <span class="fssai-info-label">Registered Premises Address (स्थान का पता)</span>
              <span class="fssai-info-value">
                ${FSSAI_DATA.registeredAddress}<br>
                <small class="text-muted">Nearest Landmark: <strong>${FSSAI_DATA.nearestLandmark}</strong> · Devrai Kala, Lucknow PIN 226202</small>
              </span>
            </div>
            <div class="fssai-info-item fssai-info-item--full">
              <span class="fssai-info-label">Statutory Declaration</span>
              <span class="fssai-info-value fssai-legal-note">
                This Registration certificate is issued under and is subject to the provisions of <strong>Food Safety and Standards Act, 2006</strong>, all of which are strictly complied with by Shree Samvriddhi Foods. Allowed to conduct food business activities with annual turnover up to ₹1.5 Crore.
              </span>
            </div>
          </div>
        </div>

        <!-- TAB 2: Approved Products Annexure -->
        <div class="fssai-tab-panel" id="fssaiTab-products">
          <div class="fssai-annexure-meta">
            <div>
              <strong>Sub-Food Category 06.2:</strong> Flours and starches (including soybean powder)
            </div>
            <div class="text-muted text-xs">Standardised food items authorized for manufacture as per FoSCoS</div>
          </div>
          <div class="fssai-table-wrap">
            <table class="fssai-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Standardised Product Name</th>
                  <th>Food Category</th>
                  <th>FSSAI Code</th>
                  <th>Kind of Business</th>
                </tr>
              </thead>
              <tbody>
                ${FSSAI_DATA.approvedProducts.map(p => `
                  <tr>
                    <td><span class="fssai-num-badge">${p.no}</span></td>
                    <td><strong>${p.name}</strong></td>
                    <td><span class="fssai-cat-pill">${p.category}</span></td>
                    <td><code class="fssai-code">${p.code}</code></td>
                    <td><span class="badge-mfg">Manufacturer</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 3: Verification & Portals -->
        <div class="fssai-tab-panel" id="fssaiTab-verify">
          <div class="fssai-verify-grid">
            <div class="fssai-verify-card">
              <div class="fssai-verify-icon">🏛️</div>
              <h3>Verify on FoSCoS National Portal</h3>
              <p>You can verify this registration directly on the Food Safety Compliance System (FoSCoS) of the Food Safety and Standards Authority of India using Registration Number <strong>${FSSAI_DATA.regNumber}</strong>.</p>
              <a href="https://foscos.fssai.gov.in" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--sm">
                Open foscos.fssai.gov.in ↗
              </a>
            </div>
            <div class="fssai-verify-card">
              <div class="fssai-verify-icon">📱</div>
              <h3>Food Safety Connect Mobile App</h3>
              <p>Government of India's official app for consumers to check license status, report concerns, and learn about food safety regulations.</p>
              <div class="fssai-verify-actions">
                <a href="https://play.google.com/store/apps/details?id=com.fssai" target="_blank" rel="noopener noreferrer" class="btn btn--secondary btn--sm">Android Play Store ↗</a>
                <a href="https://apps.apple.com/in/app/food-safety-connect/id1547472099" target="_blank" rel="noopener noreferrer" class="btn btn--secondary btn--sm">Apple iOS ↗</a>
              </div>
            </div>
          </div>
          <div class="fssai-tollfree-bar">
            <span>📞 National Food Safety Toll-Free Helpline: <strong>1800-11-2100</strong></span>
            <span>📍 Place of Registration: <strong>Lucknow, Uttar Pradesh</strong></span>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="fssai-modal__footer">
        <div class="fssai-modal__footer-disclaimer">
          Official computer generated registration certificate issued under FSS Act, 2006.
        </div>
        <div style="display:flex;gap:var(--space-2);">
          <button type="button" class="btn btn--secondary btn--sm" id="fssaiPrintBtn">🖨️ Print Certificate</button>
          <button type="button" class="btn btn--primary btn--sm" id="fssaiCloseModalBtn">Close</button>
        </div>
      </div>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  attachModalEvents();
  attachTriggers();
}

/**
 * Open the FSSAI modal
 */
export function openFssaiModal(defaultTab = 'overview') {
  const modal = document.getElementById('fssaiModal');
  if (!modal) {
    initFssaiModal();
    return openFssaiModal(defaultTab);
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Activate requested tab
  switchFssaiTab(defaultTab);
}

/**
 * Close the FSSAI modal
 */
export function closeFssaiModal() {
  const modal = document.getElementById('fssaiModal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

/**
 * Switch tabs in the FSSAI modal
 */
export function switchFssaiTab(tabId) {
  const modal = document.getElementById('fssaiModal');
  if (!modal) return;

  modal.querySelectorAll('.fssai-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.fssaiTab === tabId);
  });

  modal.querySelectorAll('.fssai-tab-panel').forEach(p => {
    p.classList.toggle('active', p.id === `fssaiTab-${tabId}`);
  });
}

function attachModalEvents() {
  const modal = document.getElementById('fssaiModal');
  if (!modal) return;

  // Close triggers
  document.getElementById('fssaiCloseBtn')?.addEventListener('click', closeFssaiModal);
  document.getElementById('fssaiCloseModalBtn')?.addEventListener('click', closeFssaiModal);

  // Click outside modal dialog to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeFssaiModal();
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeFssaiModal();
    }
  });

  // Tab switching
  modal.querySelectorAll('.fssai-tab').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      switchFssaiTab(tabBtn.dataset.fssaiTab);
    });
  });

  // Copy registration number
  const copyBtn = document.getElementById('fssaiCopyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(FSSAI_DATA.regNumber).then(() => {
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
      });
    });
  }

  // Print button
  document.getElementById('fssaiPrintBtn')?.addEventListener('click', () => {
    window.print();
  });
}

/**
 * Wire up all buttons/links on the page that trigger the modal
 */
function attachTriggers() {
  document.querySelectorAll('[data-open-fssai], .fssai-trigger').forEach(el => {
    el.removeEventListener('click', handleTriggerClick);
    el.addEventListener('click', handleTriggerClick);
  });
}

function handleTriggerClick(e) {
  e.preventDefault();
  const tab = this.getAttribute('data-fssai-tab') || 'overview';
  openFssaiModal(tab);
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initFssaiModal());
  } else {
    initFssaiModal();
  }
}
