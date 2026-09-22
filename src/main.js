import { PRODUCTS, GALLERY_ITEMS, INITIAL_CHAT_FAQS, BANK_DETAILS, INITIAL_ORDERS } from './productsData.js';
import { initAdminDashboard } from './adminDashboard.js';
import { createIcons, icons } from 'lucide';
import confetti from 'canvas-confetti';

// State Management
let cart = JSON.parse(localStorage.getItem('gj_cart') || localStorage.getItem('vt_cart')) || [];
let orders = JSON.parse(localStorage.getItem('gj_orders') || localStorage.getItem('vt_orders')) || [];
let dynamicProducts = JSON.parse(localStorage.getItem('gj_products') || localStorage.getItem('vt_products')) || PRODUCTS;
let activeCategory = 'all';

// Initialize Lucide Icons
function initIcons() {
  createIcons({ icons });
}

// Format Currency
function formatCurrency(amount) {
  return `$${parseFloat(amount).toFixed(2)}`;
}

// Reload Dynamic Products from Storage
function reloadDynamicProducts() {
  const saved = localStorage.getItem('gj_products') || localStorage.getItem('vt_products');
  if (saved) {
    try {
      dynamicProducts = JSON.parse(saved);
    } catch (e) {
      dynamicProducts = [...PRODUCTS];
    }
  } else {
    dynamicProducts = [...PRODUCTS];
  }
}

// Animated Brand Loader Controller
function setupAppLoader() {
  const loader = document.getElementById('appLoader');
  const progressBar = document.getElementById('loaderProgressBar');
  const percentText = document.getElementById('loaderPercent');
  const statusText = document.getElementById('loaderStatusText');

  if (!loader) return;

  const statusSteps = [
    { p: 15, text: "Opening Get Jakes studio..." },
    { p: 40, text: "Sculpting dummy cake tiers..." },
    { p: 70, text: "Polishing waterproof finish..." },
    { p: 90, text: "Prepping props & toppers..." },
    { p: 100, text: "Welcome to Get Jakes!" }
  ];

  function runLoader() {
    loader.classList.remove('hide');
    let currentPercent = 0;
    if (progressBar) progressBar.style.width = '0%';
    if (percentText) percentText.textContent = '0%';

    const interval = setInterval(() => {
      currentPercent += 2;
      if (currentPercent > 100) currentPercent = 100;

      if (progressBar) progressBar.style.width = `${currentPercent}%`;
      if (percentText) percentText.textContent = `${currentPercent}%`;

      const matchedStep = statusSteps.find(s => currentPercent <= s.p);
      if (matchedStep && statusText) {
        statusText.textContent = matchedStep.text;
      }

      if (currentPercent >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('hide');
        }, 400);
      }
    }, 28);
  }

  runLoader();

  // Replay Loader handlers
  const replayBtn = document.getElementById('replayLoaderBtn');
  const headerLogoBtn = document.getElementById('headerLogoBtn');

  replayBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    runLoader();
  });

  headerLogoBtn?.addEventListener('click', (e) => {
    // Only replay loader if clicking near top or intentional
    if (window.scrollY < 100) {
      runLoader();
    }
  });
}

// Document Ready
document.addEventListener('DOMContentLoaded', () => {
  setupAppLoader();
  reloadDynamicProducts();
  initIcons();
  setupCookieBanner();
  renderProducts();
  renderGallery();
  updateCartBadge();
  setupCategoryTabs();
  setupCartDrawer();
  setupCheckoutModal();
  setupOrdersModal();
  setupChatWidget();
  setupQuoteCalculator();
  initAdminDashboard();

  // Listen for admin product catalog updates
  window.addEventListener('vt_products_updated', (e) => {
    dynamicProducts = e.detail || JSON.parse(localStorage.getItem('gj_products') || localStorage.getItem('vt_products')) || PRODUCTS;
    renderProducts();
  });

  window.addEventListener('gj_products_updated', (e) => {
    dynamicProducts = e.detail || JSON.parse(localStorage.getItem('gj_products')) || PRODUCTS;
    renderProducts();
  });

  // Listen for admin order updates
  window.addEventListener('vt_orders_updated', () => {
    orders = JSON.parse(localStorage.getItem('gj_orders') || localStorage.getItem('vt_orders')) || [];
  });
});

/* Cookie Consent Management */
function setupCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const consent = localStorage.getItem('gj_cookie_consent') || localStorage.getItem('vt_cookie_consent');

  if (!consent) {
    setTimeout(() => {
      banner.classList.add('show');
    }, 1800);
  }

  document.getElementById('acceptCookiesBtn').addEventListener('click', () => {
    localStorage.setItem('gj_cookie_consent', 'all');
    banner.classList.remove('show');
  });

  document.getElementById('essentialCookiesBtn').addEventListener('click', () => {
    localStorage.setItem('gj_cookie_consent', 'essential');
    banner.classList.remove('show');
  });

  document.getElementById('reopenCookiesBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    banner.classList.add('show');
  });
}

/* Category Tabs Setup */
function setupCategoryTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.category;
      renderProducts();
    });
  });
}

/* Render Products Grid */
function renderProducts() {
  const container = document.getElementById('productsGrid');
  const filtered = activeCategory === 'all' 
    ? dynamicProducts 
    : dynamicProducts.filter(p => p.category === activeCategory);

  if (filtered.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No props found in this category.</p>`;
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-image-container">
        <span class="badge ${p.tag === 'Bestseller' ? 'badge-gold' : 'badge-brand'} product-tag">${p.tag}</span>
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <button class="quick-view-btn" data-id="${p.id}">
          <i data-lucide="eye" style="width: 14px; height: 14px; vertical-align: middle;"></i> Quick View
        </button>
      </div>
      <div class="product-info">
        <div class="product-rating">
          <i data-lucide="star" style="width: 14px; height: 14px; fill: var(--color-brand); color: var(--color-brand);"></i>
          <span>${p.rating} (${p.reviewsCount} reviews)</span>
        </div>
        <h3 class="product-title">${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-footer">
          <div>
            <span class="product-price">${formatCurrency(p.price)}</span>
            ${p.originalPrice ? `<span class="original-price">${formatCurrency(p.originalPrice)}</span>` : ''}
          </div>
          <button class="add-cart-btn add-to-cart-action" data-id="${p.id}" title="Add to Cart">
            <i data-lucide="plus"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  initIcons();

  // Attach event listeners for Quick View & Add to Cart
  container.querySelectorAll('.add-to-cart-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      addToCart(id);
    });
  });

  container.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      openQuickView(id);
    });
  });
}

/* Add Item to Cart */
function addToCart(productId, qty = 1) {
  const item = dynamicProducts.find(p => p.id === productId);
  if (!item) return;

  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...item, qty });
  }

  saveCart();
  openCartDrawer();
}

/* Save Cart to LocalStorage */
function saveCart() {
  localStorage.setItem('gj_cart', JSON.stringify(cart));
  localStorage.setItem('vt_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartItems();
}

/* Update Cart Badge Count */
function updateCartBadge() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cartCountBadge');
  if (badge) badge.textContent = count;
}

/* Cart Drawer Controls */
function setupCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const openBtn = document.getElementById('cartDrawerBtn');
  const closeBtn = document.getElementById('closeCartBtn');
  const checkoutBtn = document.getElementById('proceedCheckoutBtn');

  openBtn.addEventListener('click', openCartDrawer);
  closeBtn.addEventListener('click', closeCartDrawer);
  backdrop.addEventListener('click', closeCartDrawer);

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert("Your cart is empty! Add props before proceeding to checkout.");
      return;
    }
    closeCartDrawer();
    openCheckoutModal();
  });
}

function openCartDrawer() {
  renderCartItems();
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('drawerBackdrop').classList.add('open');
}

function closeCartDrawer() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('drawerBackdrop').classList.remove('open');
}

/* Render Cart Items inside Drawer */
function renderCartItems() {
  const container = document.getElementById('drawerCartItems');
  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotal');

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <i data-lucide="shopping-bag" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 12px;"></i>
        <h4 style="font-size: 1.1rem; color: var(--text-secondary);">Your basket is currently empty</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Explore our Get Jakes prop collection and add items to your order.</p>
      </div>
    `;
    subtotalEl.textContent = '$0.00';
    totalEl.textContent = '$0.00';
    initIcons();
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-price">${formatCurrency(item.price)}</div>
        <div class="qty-control">
          <button class="qty-btn dec-qty" data-id="${item.id}">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn inc-qty" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="icon-btn remove-item" data-id="${item.id}" style="width: 32px; height: 32px;" title="Remove Item">
        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
      </button>
    </div>
  `).join('');

  subtotalEl.textContent = formatCurrency(subtotal);
  totalEl.textContent = formatCurrency(subtotal);

  initIcons();

  // Attach quantity change listeners
  container.querySelectorAll('.dec-qty').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const target = cart.find(i => i.id === id);
      if (target && target.qty > 1) {
        target.qty--;
      } else {
        cart = cart.filter(i => i.id !== id);
      }
      saveCart();
    });
  });

  container.querySelectorAll('.inc-qty').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const target = cart.find(i => i.id === id);
      if (target) target.qty++;
      saveCart();
    });
  });

  container.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      cart = cart.filter(i => i.id !== id);
      saveCart();
    });
  });
}

/* Quick View Modal */
function openQuickView(productId) {
  const item = dynamicProducts.find(p => p.id === productId);
  if (!item) return;

  const modal = document.getElementById('quickViewModal');
  const container = document.getElementById('quickViewContent');

  container.innerHTML = `
    <button class="modal-close-btn close-modal-btn">
      <i data-lucide="x"></i>
    </button>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: center;">
      <div style="border-radius: var(--radius-md); overflow: hidden; height: 320px; background: var(--bg-secondary);">
        <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div>
        <span class="badge badge-brand" style="margin-bottom: 8px;">${item.tag}</span>
        <h2 style="font-size: 1.6rem; color: var(--color-black); margin-bottom: 8px;">${item.name}</h2>
        <div style="font-size: 1.4rem; font-weight: 800; color: var(--color-black); margin-bottom: 12px;">${formatCurrency(item.price)}</div>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 16px;">${item.description}</p>
        
        <div style="background: var(--bg-secondary); padding: 12px 16px; border-radius: var(--radius-sm); font-size: 0.82rem; margin-bottom: 20px;">
          ${Object.entries(item.specs).map(([key, val]) => `<div><strong>${key.toUpperCase()}:</strong> ${val}</div>`).join('')}
        </div>

        <button id="quickAddBtn" class="btn-primary" style="width: 100%; justify-content: center;">
          <i data-lucide="shopping-bag"></i> Add to Cart (${formatCurrency(item.price)})
        </button>
      </div>
    </div>
  `;

  initIcons();
  modal.classList.add('open');

  container.querySelector('.close-modal-btn').addEventListener('click', () => {
    modal.classList.remove('open');
  });

  document.getElementById('quickAddBtn').addEventListener('click', () => {
    addToCart(item.id);
    modal.classList.remove('open');
  });
}

/* Render Interactive Gallery */
function renderGallery() {
  const container = document.getElementById('galleryGrid');
  container.innerHTML = GALLERY_ITEMS.map(g => `
    <div class="gallery-card" data-id="${g.id}">
      <img src="${g.image}" alt="${g.title}" loading="lazy">
      <div class="gallery-overlay">
        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-brand); font-weight: 800;">${g.client}</span>
        <h3 style="font-size: 1.2rem; margin: 4px 0;">${g.title}</h3>
        <p style="font-size: 0.82rem; opacity: 0.9; margin-bottom: 12px;">${g.desc}</p>
        <button class="btn-secondary" style="padding: 6px 14px; font-size: 0.78rem; border-color: #FFF; color: #FFF; background: rgba(0,0,0,0.6);" onclick="alert('Inquiring about Get Jakes custom replica for: ${g.title}')">
          Request Similar Display
        </button>
      </div>
    </div>
  `).join('');
}

/* Custom Quote Calculator Setup */
function setupQuoteCalculator() {
  const tiersSelect = document.getElementById('quoteTiers');
  const priceDisplay = document.getElementById('quoteEstimatePrice');
  const form = document.getElementById('customQuoteForm');

  const prices = { "1": 95, "2": 175, "3": 245, "4": 385, "5": 580 };

  tiersSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    priceDisplay.textContent = formatCurrency(prices[val] || 245);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const contact = document.getElementById('quoteContact').value;
    const tiers = tiersSelect.value;
    alert(`Thank you! Your quote request for a ${tiers}-tier Get Jakes custom prop has been logged. Our studio specialist will contact ${contact} within 2 hours.`);
    form.reset();
  });
}

/* Checkout & Bank Transfer Modal */
function setupCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  const form = document.getElementById('checkoutForm');
  const closeBtns = modal.querySelectorAll('.close-modal-btn');
  const orderRefDisplay = document.getElementById('orderRefDisplay');
  const checkoutTotalAmount = document.getElementById('checkoutTotalAmount');

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => modal.classList.remove('open'));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('custName').value;
    const email = document.getElementById('custEmail').value;
    const address = document.getElementById('custAddress').value;
    const utr = document.getElementById('custUtr').value || 'Pending Transfer Verification';
    const refCode = orderRefDisplay.textContent;
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const newOrder = {
      orderId: refCode,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      customerName: name,
      customerEmail: email,
      shippingAddress: address,
      items: [...cart],
      totalAmount: total,
      paymentMethod: 'Direct Bank Transfer',
      utrNumber: utr,
      status: 'Awaiting Bank Transfer Verification'
    };

    orders.unshift(newOrder);
    localStorage.setItem('gj_orders', JSON.stringify(orders));
    localStorage.setItem('vt_orders', JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('vt_orders_updated', { detail: orders }));

    // Clear Cart
    cart = [];
    saveCart();

    modal.classList.remove('open');

    // Trigger Celebration Confetti!
    confetti({
      particleCount: 140,
      spread: 80,
      colors: ['#36DFE2', '#0FB3B6', '#0F1415'],
      origin: { y: 0.6 }
    });

    alert(`Order ${refCode} Placed Successfully!\n\nPlease complete your transfer of ${formatCurrency(total)} to ${BANK_DETAILS.bankName} (Acc: ${BANK_DETAILS.accountNumber}) using Reference Code: ${refCode}.`);

    // Open Orders Modal
    openOrdersModal();
  });
}

function openCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const refCode = `GJ-${Math.floor(1000 + Math.random() * 9000)}-PAY`;

  document.getElementById('orderRefDisplay').textContent = refCode;
  document.getElementById('checkoutTotalAmount').textContent = formatCurrency(total);

  modal.classList.add('open');
}

/* Orders Page & Tracker Modal */
function setupOrdersModal() {
  const modal = document.getElementById('ordersModal');
  const openNavBtn = document.getElementById('navMyOrders');
  const openHeaderBtn = document.getElementById('ordersBtn');
  const openFooterLink = document.getElementById('footerOrdersLink');
  const closeBtns = modal.querySelectorAll('.close-modal-btn');

  const openAction = (e) => {
    e.preventDefault();
    openOrdersModal();
  };

  openNavBtn?.addEventListener('click', openAction);
  openHeaderBtn?.addEventListener('click', openAction);
  openFooterLink?.addEventListener('click', openAction);

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => modal.classList.remove('open'));
  });
}

function openOrdersModal() {
  const modal = document.getElementById('ordersModal');
  const container = document.getElementById('ordersListContainer');

  if (orders.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <i data-lucide="package-x" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 12px;"></i>
        <h3 style="font-size: 1.1rem; color: var(--text-secondary);">No orders placed yet</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Orders placed via Bank Transfer will be tracked here in real-time.</p>
      </div>
    `;
  } else {
    container.innerHTML = orders.map(order => `
      <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 20px; margin-bottom: 20px; border: 1px solid var(--border-color);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 12px;">
          <div>
            <strong style="color: var(--color-black); font-size: 1.1rem;">${order.orderId}</strong>
            <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 12px;">Placed on ${order.date}</span>
          </div>
          <span class="badge badge-brand">${order.status}</span>
        </div>

        <div style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 12px;">
          <strong>Items Ordered:</strong> ${order.items.map(i => `${i.name} (x${i.qty})`).join(', ')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
          <div>
            <span>Payment Mode: <strong>${order.paymentMethod}</strong></span><br>
            <span>UTR Ref: <strong style="font-family: monospace;">${order.utrNumber}</strong></span>
          </div>
          <div style="font-size: 1.2rem; font-weight: 800; color: var(--color-black);">
            ${formatCurrency(order.totalAmount)}
          </div>
        </div>
      </div>
    `).join('');
  }

  initIcons();
  modal.classList.add('open');
}

/* Pop-Up Live Chat Widget Setup */
function setupChatWidget() {
  const triggerBtn = document.getElementById('chatTriggerBtn');
  const closeBtn = document.getElementById('closeChatBtn');
  const windowEl = document.getElementById('chatWindow');
  const chipsContainer = document.getElementById('chatFaqChips');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');

  // Render initial FAQ chips
  chipsContainer.innerHTML = INITIAL_CHAT_FAQS.map((faq, idx) => `
    <button type="button" class="faq-chip" data-idx="${idx}">
      ❓ ${faq.q}
    </button>
  `).join('');

  chipsContainer.querySelectorAll('.faq-chip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.dataset.idx;
      const selected = INITIAL_CHAT_FAQS[idx];
      appendChatMessage(selected.q, 'user');
      setTimeout(() => {
        appendChatMessage(selected.a, 'bot');
      }, 500);
    });
  });

  triggerBtn.addEventListener('click', () => {
    windowEl.classList.toggle('open');
  });

  closeBtn.addEventListener('click', () => {
    windowEl.classList.remove('open');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendChatMessage(text, 'user');
    input.value = '';

    // Auto simulated reply logic
    setTimeout(() => {
      const lower = text.toLowerCase();
      let botReply = "Thank you for reaching out! Our Get Jakes studio specialist will assist you shortly. You can also view our Bank Transfer payment details or custom quote builder on the page.";

      if (lower.includes('bank') || lower.includes('transfer') || lower.includes('pay')) {
        botReply = `To pay via Bank Transfer, proceed to checkout in your cart. You will receive reference code GJ-XXXX-PAY and bank account ${BANK_DETAILS.accountNumber} (${BANK_DETAILS.bankName}).`;
      } else if (lower.includes('waterproof') || lower.includes('clean')) {
        botReply = "All Get Jakes cake props & toppers are coated in waterproof polymer finish! Simply wipe clean with a warm soft damp cloth.";
      } else if (lower.includes('order') || lower.includes('track')) {
        botReply = "You can view and track all your placed orders anytime by clicking the 'Orders' button in the top navigation bar.";
      }

      appendChatMessage(botReply, 'bot');
    }, 600);
  });
}

function appendChatMessage(text, sender) {
  const container = document.getElementById('chatMessages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${sender}`;
  msgDiv.innerHTML = text;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

