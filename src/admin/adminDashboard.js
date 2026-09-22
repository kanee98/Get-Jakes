import { PRODUCTS, INITIAL_ORDERS, BANK_DETAILS } from '../data/productsData.js';
import { createIcons, icons } from 'lucide';

// Helper for Lucide Icons
function refreshIcons() {
  createIcons({ icons });
}

// Currency Formatter
function formatMoney(amount) {
  return `$${parseFloat(amount || 0).toFixed(2)}`;
}

// Toast Notification Handler
export function showAdminToast(message, type = 'success') {
  let toastContainer = document.getElementById('adminToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'adminToastContainer';
    toastContainer.className = 'admin-toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `admin-toast ${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle-2' : type === 'warning' ? 'alert-triangle' : 'info'}"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  refreshIcons();

  setTimeout(() => {
    toast.classList.add('show');
  }, 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// State Management for Admin
let adminProducts = [];
let adminOrders = [];
let activeAdminTab = 'overview';
let productSearchQuery = '';
let productCategoryFilter = 'all';
let orderSearchQuery = '';
let orderStatusFilter = 'all';
let currentEditingProductId = null;
let currentViewingOrderId = null;

// Initialize Admin Dashboard
export function initAdminDashboard() {
  loadAdminData();
  setupAdminEventListeners();
  renderAdminDashboard();

  // Listen for external order placements from customer checkout
  window.addEventListener('vt_orders_updated', () => {
    loadAdminData();
    renderAdminDashboard();
  });
  window.addEventListener('gj_orders_updated', () => {
    loadAdminData();
    renderAdminDashboard();
  });
}

// Load products and orders from localStorage
export function loadAdminData() {
  const savedProducts = localStorage.getItem('gj_products') || localStorage.getItem('vt_products');
  if (savedProducts) {
    try {
      adminProducts = JSON.parse(savedProducts);
    } catch (e) {
      adminProducts = [...PRODUCTS];
    }
  } else {
    adminProducts = [...PRODUCTS];
    localStorage.setItem('gj_products', JSON.stringify(adminProducts));
  }

  const savedOrders = localStorage.getItem('gj_orders') || localStorage.getItem('vt_orders');
  if (savedOrders) {
    try {
      adminOrders = JSON.parse(savedOrders);
    } catch (e) {
      adminOrders = [...INITIAL_ORDERS];
    }
  } else {
    adminOrders = [...INITIAL_ORDERS];
    localStorage.setItem('gj_orders', JSON.stringify(adminOrders));
  }
}

// Save Products & Dispatch Update Event
function saveAdminProducts() {
  localStorage.setItem('gj_products', JSON.stringify(adminProducts));
  localStorage.setItem('vt_products', JSON.stringify(adminProducts));
  window.dispatchEvent(new CustomEvent('gj_products_updated', { detail: adminProducts }));
  window.dispatchEvent(new CustomEvent('vt_products_updated', { detail: adminProducts }));
}

// Save Orders & Dispatch Update Event
function saveAdminOrders() {
  localStorage.setItem('gj_orders', JSON.stringify(adminOrders));
  localStorage.setItem('vt_orders', JSON.stringify(adminOrders));
  window.dispatchEvent(new CustomEvent('gj_orders_updated', { detail: adminOrders }));
  window.dispatchEvent(new CustomEvent('vt_orders_updated', { detail: adminOrders }));
}

// Setup Event Listeners for Admin UI
function setupAdminEventListeners() {
  // Nav Trigger
  const navBtn = document.getElementById('adminPortalBtn');
  const modal = document.getElementById('adminDashboardModal');
  const closeBtn = document.getElementById('closeAdminModalBtn');

  if (navBtn) {
    navBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAdminDashboard();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  // Admin Sidebar / Top Nav Tabs
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.currentTarget.dataset.tab;
      activeAdminTab = tab;
      document.querySelectorAll('.admin-tab-btn').forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      renderAdminTabContent();
    });
  });

  // Product Form Submit
  const productForm = document.getElementById('adminProductForm');
  if (productForm) {
    productForm.addEventListener('submit', handleProductFormSubmit);
  }

  // Close Product Modal Button
  document.querySelectorAll('#adminProductModal .close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('adminProductModal').classList.remove('open');
    });
  });

  // Close Order Detail Modal Button
  document.querySelectorAll('#adminOrderDetailModal .close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('adminOrderDetailModal').classList.remove('open');
    });
  });
}

// Open Admin Dashboard
export function openAdminDashboard() {
  loadAdminData();
  const modal = document.getElementById('adminDashboardModal');
  if (modal) {
    modal.classList.add('open');
    renderAdminDashboard();
  }
}

// Render Admin Dashboard Container
export function renderAdminDashboard() {
  renderAdminTabContent();
  refreshIcons();
}

// Render Tab Contents
function renderAdminTabContent() {
  const container = document.getElementById('adminMainContent');
  if (!container) return;

  switch (activeAdminTab) {
    case 'overview':
      container.innerHTML = renderOverviewTab();
      attachOverviewTabEvents();
      break;
    case 'products':
      container.innerHTML = renderProductsTab();
      attachProductsTabEvents();
      break;
    case 'orders':
      container.innerHTML = renderOrdersTab();
      attachOrdersTabEvents();
      break;
    case 'settings':
      container.innerHTML = renderSettingsTab();
      attachSettingsTabEvents();
      break;
    default:
      container.innerHTML = renderOverviewTab();
      attachOverviewTabEvents();
  }

  refreshIcons();
}

/* ==========================================================================
   1. OVERVIEW TAB
   ========================================================================== */
function renderOverviewTab() {
  const totalRevenue = adminOrders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  
  const pendingVerificationCount = adminOrders.filter(
    o => o.status === 'Awaiting Bank Transfer Verification'
  ).length;

  const verifiedOrdersCount = adminOrders.filter(
    o => o.status === 'Payment Verified' || o.status === 'In Production' || o.status === 'Shipped' || o.status === 'Delivered'
  ).length;

  const totalProducts = adminProducts.length;
  const recentOrders = [...adminOrders].slice(0, 5);

  return `
    <div class="admin-overview">
      <div class="admin-header-title">
        <div>
          <h2>Dashboard Overview</h2>
          <p class="admin-subtext">Real-time studio sales, product metrics, and bank wire verification queue.</p>
        </div>
        <div class="admin-header-actions">
          <button id="quickAddProductBtn" class="btn-primary" style="padding: 8px 18px; font-size: 0.85rem;">
            <i data-lucide="plus"></i> New Cake Prop
          </button>
          <button id="quickResetProductsBtn" class="btn-secondary" style="padding: 8px 16px; font-size: 0.85rem;" title="Reset products to seed default">
            <i data-lucide="rotate-ccw"></i> Reset Defaults
          </button>
        </div>
      </div>

      <!-- Metric Cards Grid -->
      <div class="admin-metrics-grid">
        <div class="metric-card">
          <div class="metric-icon brand">
            <i data-lucide="dollar-sign"></i>
          </div>
          <div class="metric-info">
            <span class="metric-label">Total Revenue</span>
            <span class="metric-value">${formatMoney(totalRevenue)}</span>
            <span class="metric-hint positive"><i data-lucide="trending-up"></i> Bank Wires Verified</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon gold">
            <i data-lucide="shopping-bag"></i>
          </div>
          <div class="metric-info">
            <span class="metric-label">Total Orders</span>
            <span class="metric-value">${adminOrders.length}</span>
            <span class="metric-hint">${verifiedOrdersCount} processed</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon warning">
            <i data-lucide="clock"></i>
          </div>
          <div class="metric-info">
            <span class="metric-label">Pending Verifications</span>
            <span class="metric-value">${pendingVerificationCount}</span>
            <span class="metric-hint highlight">Action Required</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon accent">
            <i data-lucide="layers"></i>
          </div>
          <div class="metric-info">
            <span class="metric-label">Active Prop Catalog</span>
            <span class="metric-value">${totalProducts}</span>
            <span class="metric-hint">In Storefront</span>
          </div>
        </div>
      </div>

      <!-- Recent Orders Panel -->
      <div class="admin-grid-2col" style="margin-top: 28px;">
        <div class="admin-card">
          <div class="admin-card-header">
            <h3><i data-lucide="receipt" style="vertical-align: middle;"></i> Recent Bank Transfer Orders</h3>
            <button class="btn-text-link" id="viewAllOrdersLink">View All Orders →</button>
          </div>
          <div class="admin-table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${recentOrders.map(o => `
                  <tr class="clickable-row view-order-row" data-id="${o.orderId}">
                    <td><strong class="ref-code" style="font-size: 0.85rem;">${o.orderId}</strong></td>
                    <td>${o.customerName}</td>
                    <td><strong>${formatMoney(o.totalAmount)}</strong></td>
                    <td>
                      <span class="status-badge ${getStatusBadgeClass(o.status)}">${o.status}</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-card-header">
            <h3><i data-lucide="package" style="vertical-align: middle;"></i> Catalog Highlights</h3>
            <button class="btn-text-link" id="viewAllProductsLink">Manage Catalog →</button>
          </div>
          <div class="admin-products-preview-list">
            ${adminProducts.slice(0, 4).map(p => `
              <div class="admin-product-preview-item">
                <img src="${p.image}" alt="${p.name}">
                <div class="preview-info">
                  <strong>${p.name}</strong>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${p.category} • ${p.tag}</span>
                </div>
                <div class="preview-price">
                  <strong>${formatMoney(p.price)}</strong>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function attachOverviewTabEvents() {
  document.getElementById('quickAddProductBtn')?.addEventListener('click', openAddProductModal);
  document.getElementById('quickResetProductsBtn')?.addEventListener('click', handleResetProducts);
  document.getElementById('viewAllOrdersLink')?.addEventListener('click', () => {
    activeAdminTab = 'orders';
    updateActiveTabUI();
    renderAdminTabContent();
  });
  document.getElementById('viewAllProductsLink')?.addEventListener('click', () => {
    activeAdminTab = 'products';
    updateActiveTabUI();
    renderAdminTabContent();
  });

  document.querySelectorAll('.view-order-row').forEach(row => {
    row.addEventListener('click', () => {
      openOrderDetailModal(row.dataset.id);
    });
  });
}

/* ==========================================================================
   2. PRODUCTS TAB
   ========================================================================== */
function renderProductsTab() {
  let filtered = [...adminProducts];

  if (productSearchQuery) {
    const q = productSearchQuery.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  if (productCategoryFilter !== 'all') {
    filtered = filtered.filter(p => p.category === productCategoryFilter);
  }

  return `
    <div class="admin-products">
      <div class="admin-header-title">
        <div>
          <h2>Cake Prop Catalog</h2>
          <p class="admin-subtext">Add, edit, or update active dummy cake props and studio pedestals.</p>
        </div>
        <button id="addNewProductBtn" class="btn-primary" style="padding: 8px 18px; font-size: 0.85rem;">
          <i data-lucide="plus"></i> Add New Prop
        </button>
      </div>

      <!-- Toolbar Search & Filter -->
      <div class="admin-toolbar" style="margin-bottom: 20px;">
        <div class="search-input-wrapper">
          <i data-lucide="search" style="width: 16px; height: 16px; color: var(--text-muted);"></i>
          <input type="text" id="productSearchInput" placeholder="Search prop name or description..." value="${productSearchQuery}">
        </div>

        <div class="filter-group">
          <label>Category:</label>
          <select id="productCategoryFilter" class="form-select-sm">
            <option value="all" ${productCategoryFilter === 'all' ? 'selected' : ''}>All Categories</option>
            <option value="wedding" ${productCategoryFilter === 'wedding' ? 'selected' : ''}>Wedding Tier Dummies</option>
            <option value="photography" ${productCategoryFilter === 'photography' ? 'selected' : ''}>Studio Photo Kits</option>
            <option value="pedestal" ${productCategoryFilter === 'pedestal' ? 'selected' : ''}>Display Pedestals</option>
            <option value="custom" ${productCategoryFilter === 'custom' ? 'selected' : ''}>Custom & Commercial</option>
          </select>
        </div>
      </div>

      <!-- Products Table -->
      <div class="admin-card">
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Prop Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Tag</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length === 0 ? `
                <tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">No props match search.</td></tr>
              ` : filtered.map(p => `
                <tr>
                  <td><img src="${p.image}" class="admin-table-img" alt="${p.name}"></td>
                  <td><strong>${p.name}</strong></td>
                  <td><span class="admin-category-badge">${p.category}</span></td>
                  <td><strong>${formatMoney(p.price)}</strong></td>
                  <td><span class="badge badge-brand">${p.tag}</span></td>
                  <td>
                    <button class="btn-action-edit edit-product-btn" data-id="${p.id}">
                      <i data-lucide="edit-2"></i> Edit
                    </button>
                    <button class="btn-action-delete delete-product-btn" data-id="${p.id}">
                      <i data-lucide="trash-2"></i> Delete
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function attachProductsTabEvents() {
  document.getElementById('addNewProductBtn')?.addEventListener('click', openAddProductModal);

  const searchInput = document.getElementById('productSearchInput');
  searchInput?.addEventListener('input', (e) => {
    productSearchQuery = e.target.value;
    renderAdminTabContent();
  });

  const catFilter = document.getElementById('productCategoryFilter');
  catFilter?.addEventListener('change', (e) => {
    productCategoryFilter = e.target.value;
    renderAdminTabContent();
  });

  document.querySelectorAll('.edit-product-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openEditProductModal(btn.dataset.id);
    });
  });

  document.querySelectorAll('.delete-product-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      handleDeleteProduct(btn.dataset.id);
    });
  });
}

/* ==========================================================================
   3. ORDERS TAB
   ========================================================================== */
function renderOrdersTab() {
  let filtered = [...adminOrders];

  if (orderSearchQuery) {
    const q = orderSearchQuery.toLowerCase();
    filtered = filtered.filter(o => 
      o.orderId.toLowerCase().includes(q) || 
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q)
    );
  }

  if (orderStatusFilter !== 'all') {
    filtered = filtered.filter(o => o.status === orderStatusFilter);
  }

  return `
    <div class="admin-orders">
      <div class="admin-header-title">
        <div>
          <h2>Bank Transfer Orders</h2>
          <p class="admin-subtext">Manage order queue, verify wire UTR reference numbers, and update fulfillment status.</p>
        </div>
      </div>

      <div class="admin-toolbar" style="margin-bottom: 20px;">
        <div class="search-input-wrapper">
          <i data-lucide="search" style="width: 16px; height: 16px; color: var(--text-muted);"></i>
          <input type="text" id="orderSearchInput" placeholder="Search by Order Ref ID, name, email..." value="${orderSearchQuery}">
        </div>

        <div class="filter-group">
          <label>Status Filter:</label>
          <select id="orderStatusFilter" class="form-select-sm">
            <option value="all" ${orderStatusFilter === 'all' ? 'selected' : ''}>All Orders</option>
            <option value="Awaiting Bank Transfer Verification" ${orderStatusFilter === 'Awaiting Bank Transfer Verification' ? 'selected' : ''}>Awaiting Wire Verification</option>
            <option value="Payment Verified" ${orderStatusFilter === 'Payment Verified' ? 'selected' : ''}>Payment Verified</option>
            <option value="In Production" ${orderStatusFilter === 'In Production' ? 'selected' : ''}>In Production</option>
            <option value="Shipped" ${orderStatusFilter === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${orderStatusFilter === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Cancelled" ${orderStatusFilter === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </div>
      </div>

      <div class="admin-card">
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order Ref ID</th>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>UTR / Wire Ref</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length === 0 ? `
                <tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">No orders found.</td></tr>
              ` : filtered.map(o => `
                <tr>
                  <td><strong class="ref-code" style="font-size: 0.88rem;">${o.orderId}</strong></td>
                  <td>
                    <strong>${o.customerName}</strong>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${o.customerEmail}</div>
                  </td>
                  <td>${o.date}</td>
                  <td><strong>${formatMoney(o.totalAmount)}</strong></td>
                  <td><code style="background: var(--bg-secondary); padding: 2px 6px; border-radius: 4px; font-size: 0.78rem;">${o.utrNumber}</code></td>
                  <td>
                    <select class="status-select ${getStatusBadgeClass(o.status)} order-status-select" data-id="${o.orderId}">
                      <option value="Awaiting Bank Transfer Verification" ${o.status === 'Awaiting Bank Transfer Verification' ? 'selected' : ''}>Awaiting Verification</option>
                      <option value="Payment Verified" ${o.status === 'Payment Verified' ? 'selected' : ''}>Payment Verified</option>
                      <option value="In Production" ${o.status === 'In Production' ? 'selected' : ''}>In Production</option>
                      <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                      <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                      <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button class="btn-action-view view-order-detail-btn" data-id="${o.orderId}">
                      <i data-lucide="eye"></i> Details
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function attachOrdersTabEvents() {
  document.getElementById('orderSearchInput')?.addEventListener('input', (e) => {
    orderSearchQuery = e.target.value;
    renderAdminTabContent();
  });

  document.getElementById('orderStatusFilter')?.addEventListener('change', (e) => {
    orderStatusFilter = e.target.value;
    renderAdminTabContent();
  });

  document.querySelectorAll('.order-status-select').forEach(select => {
    select.addEventListener('change', (e) => {
      handleOrderStatusChange(select.dataset.id, e.target.value);
    });
  });

  document.querySelectorAll('.view-order-detail-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openOrderDetailModal(btn.dataset.id);
    });
  });
}

/* ==========================================================================
   4. SETTINGS TAB
   ========================================================================== */
function renderSettingsTab() {
  return `
    <div class="admin-settings">
      <div class="admin-header-title">
        <div>
          <h2>Store Settings & Bank Wire Details</h2>
          <p class="admin-subtext">Configure default studio bank accounts displayed during customer checkout.</p>
        </div>
      </div>

      <div class="admin-card" style="max-width: 680px;">
        <h3 style="margin-bottom: 16px; color: var(--color-brand); font-size: 1.1rem;">
          <i data-lucide="landmark" style="vertical-align: middle;"></i> Artisanal Commerce Bank Details
        </h3>
        <form id="bankSettingsForm">
          <div class="form-group">
            <label class="form-label">Bank Name</label>
            <input type="text" id="setBankName" class="form-input" value="${BANK_DETAILS.bankName}">
          </div>
          <div class="form-group">
            <label class="form-label">Account Holder</label>
            <input type="text" id="setAccName" class="form-input" value="${BANK_DETAILS.accountName}">
          </div>
          <div class="form-group">
            <label class="form-label">Account Number</label>
            <input type="text" id="setAccNum" class="form-input" value="${BANK_DETAILS.accountNumber}">
          </div>
          <div class="form-group">
            <label class="form-label">IFSC / Sort Code</label>
            <input type="text" id="setIfsc" class="form-input" value="${BANK_DETAILS.ifscCode}">
          </div>
          <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
            <button type="submit" class="btn-primary">
              <i data-lucide="save"></i> Save Bank Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function attachSettingsTabEvents() {
  document.getElementById('bankSettingsForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showAdminToast('Bank transfer details updated successfully.');
  });
}

/* ==========================================================================
   MODAL HANDLERS (ADD/EDIT PRODUCT & ORDER DETAILS)
   ========================================================================== */
function openAddProductModal() {
  currentEditingProductId = null;
  document.getElementById('adminProductModalTitle').textContent = 'Add New Cake Prop';
  const form = document.getElementById('adminProductForm');
  if (form) form.reset();

  document.getElementById('prodId').value = '';
  document.getElementById('adminProductModal').classList.add('open');
}

function openEditProductModal(productId) {
  const p = adminProducts.find(item => item.id === productId);
  if (!p) return;

  currentEditingProductId = productId;
  document.getElementById('adminProductModalTitle').textContent = 'Edit Cake Prop';
  
  document.getElementById('prodId').value = p.id;
  document.getElementById('prodName').value = p.name || '';
  document.getElementById('prodCategory').value = p.category || 'wedding';
  document.getElementById('prodPrice').value = p.price || '';
  document.getElementById('prodOrigPrice').value = p.originalPrice || '';
  document.getElementById('prodTag').value = p.tag || 'Handcrafted';
  document.getElementById('prodRating').value = p.rating || 4.9;
  document.getElementById('prodReviews').value = p.reviewsCount || 10;
  document.getElementById('prodImage').value = p.image || '';
  document.getElementById('prodDesc').value = p.description || '';

  if (p.specs) {
    document.getElementById('prodHeight').value = p.specs.height || '';
    document.getElementById('prodTiers').value = p.specs.tiers || '';
    document.getElementById('prodMaterial').value = p.specs.material || '';
    document.getElementById('prodWeight').value = p.specs.weight || '';
  }

  document.getElementById('adminProductModal').classList.add('open');
}

function handleProductFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('prodId').value || `prop-${Date.now().toString().slice(-4)}`;
  const name = document.getElementById('prodName').value;
  const category = document.getElementById('prodCategory').value;
  const price = parseFloat(document.getElementById('prodPrice').value);
  const origPrice = parseFloat(document.getElementById('prodOrigPrice').value) || null;
  const tag = document.getElementById('prodTag').value;
  const rating = parseFloat(document.getElementById('prodRating').value) || 4.9;
  const reviews = parseInt(document.getElementById('prodReviews').value) || 12;
  const image = document.getElementById('prodImage').value;
  const desc = document.getElementById('prodDesc').value;

  const specs = {
    height: document.getElementById('prodHeight').value || '24 inches',
    tiers: document.getElementById('prodTiers').value || '3 Tiers',
    material: document.getElementById('prodMaterial').value || 'EPS Foam + Fondant',
    weight: document.getElementById('prodWeight').value || '3.5 lbs'
  };

  const productData = {
    id, name, category, price, originalPrice: origPrice, rating, reviewsCount: reviews, image, tag, description: desc, specs
  };

  if (currentEditingProductId) {
    const index = adminProducts.findIndex(p => p.id === currentEditingProductId);
    if (index > -1) adminProducts[index] = productData;
    showAdminToast('Prop updated successfully.');
  } else {
    adminProducts.unshift(productData);
    showAdminToast('New prop added to catalog.');
  }

  saveAdminProducts();
  document.getElementById('adminProductModal').classList.remove('open');
  renderAdminTabContent();
}

function handleDeleteProduct(productId) {
  if (confirm('Are you sure you want to delete this cake prop from catalog?')) {
    adminProducts = adminProducts.filter(p => p.id !== productId);
    saveAdminProducts();
    showAdminToast('Prop deleted from catalog.', 'warning');
    renderAdminTabContent();
  }
}

function handleResetProducts() {
  if (confirm('Reset prop catalog to seed defaults?')) {
    adminProducts = [...PRODUCTS];
    saveAdminProducts();
    showAdminToast('Catalog reset to defaults.');
    renderAdminTabContent();
  }
}

function handleOrderStatusChange(orderId, newStatus) {
  const order = adminOrders.find(o => o.orderId === orderId);
  if (order) {
    order.status = newStatus;
    saveAdminOrders();
    showAdminToast(`Order ${orderId} status set to ${newStatus}.`);
    renderAdminTabContent();
  }
}

function openOrderDetailModal(orderId) {
  const o = adminOrders.find(item => item.orderId === orderId);
  if (!o) return;

  const content = document.getElementById('adminOrderDetailContent');
  if (!content) return;

  content.innerHTML = `
    <div style="margin-bottom: 20px;">
      <span class="ref-code" style="font-size: 1.4rem;">${o.orderId}</span>
      <div style="font-size: 0.85rem; color: var(--text-muted);">Placed on ${o.date} • ${o.paymentMethod}</div>
    </div>

    <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 20px;">
      <h4 style="font-size: 0.95rem; color: var(--color-black); margin-bottom: 8px;">Customer Information</h4>
      <div style="font-size: 0.88rem;"><strong>Name:</strong> ${o.customerName}</div>
      <div style="font-size: 0.88rem;"><strong>Email:</strong> ${o.customerEmail}</div>
      <div style="font-size: 0.88rem;"><strong>Delivery Address:</strong> ${o.shippingAddress}</div>
      <div style="font-size: 0.88rem; margin-top: 6px;"><strong>Wire UTR Ref:</strong> <code>${o.utrNumber}</code></div>
    </div>

    <h4 style="font-size: 0.95rem; color: var(--color-black); margin-bottom: 12px;">Order Items</h4>
    <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
      ${o.items.map(item => `
        <div style="display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
          <img src="${item.image}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;">
          <div style="flex: 1;">
            <strong style="font-size: 0.88rem;">${item.name}</strong>
            <div style="font-size: 0.78rem; color: var(--text-muted);">$${item.price.toFixed(2)} × ${item.qty}</div>
          </div>
          <strong>$${(item.price * item.qty).toFixed(2)}</strong>
        </div>
      `).join('')}
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color); padding-top: 12px;">
      <span style="font-size: 0.9rem; color: var(--text-muted);">Total Order Amount:</span>
      <strong style="font-size: 1.4rem; color: var(--color-black);">${formatMoney(o.totalAmount)}</strong>
    </div>
  `;

  document.getElementById('adminOrderDetailModal').classList.add('open');
  refreshIcons();
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Payment Verified': return 'badge-status-verified';
    case 'In Production': return 'badge-status-production';
    case 'Shipped': return 'badge-status-shipped';
    case 'Delivered': return 'badge-status-delivered';
    case 'Cancelled': return 'badge-status-cancelled';
    default: return 'badge-status-pending';
  }
}

function updateActiveTabUI() {
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    if (btn.dataset.tab === activeAdminTab) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}
