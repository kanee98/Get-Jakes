import { PRODUCTS, INITIAL_ORDERS, BANK_DETAILS } from './productsData.js';
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

      <!-- Recent Orders & Popular Products Quick Views -->
      <div class="admin-grid-2col" style="margin-top: 28px;">
        <!-- Recent Orders Panel -->
        <div class="admin-card">
          <div class="admin-card-header">
            <h3><i data-lucide="receipt" style="vertical-align: middle;"></i> Recent Bank Transfer Orders</h3>
            <button class="btn-text-link" onclick="document.querySelector('[data-tab=orders]').click()">View All (${adminOrders.length})</button>
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
                ${recentOrders.length === 0 ? `<tr><td colspan="4" style="text-align:center; padding: 20px; color: var(--text-muted);">No orders received yet.</td></tr>` : ''}
                ${recentOrders.map(o => `
                  <tr class="clickable-row" onclick="window.adminOpenOrderDetails('${o.orderId}')">
                    <td><strong>${o.orderId}</strong></td>
                    <td>
                      <div>${o.customerName}</div>
                      <small style="color: var(--text-muted); font-size: 0.75rem;">${o.customerEmail}</small>
                    </td>
                    <td><strong>${formatMoney(o.totalAmount)}</strong></td>
                    <td><span class="status-badge ${getStatusBadgeClass(o.status)}">${o.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Quick Catalog Preview Panel -->
        <div class="admin-card">
          <div class="admin-card-header">
            <h3><i data-lucide="package" style="vertical-align: middle;"></i> Top Storefront Props</h3>
            <button class="btn-text-link" onclick="document.querySelector('[data-tab=products]').click()">Manage (${adminProducts.length})</button>
          </div>
          <div class="admin-products-preview-list">
            ${adminProducts.slice(0, 4).map(p => `
              <div class="admin-product-preview-item">
                <img src="${p.image}" alt="${p.name}">
                <div class="preview-info">
                  <strong>${p.name}</strong>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">${p.category} • ${p.tag}</span>
                </div>
                <div class="preview-price">
                  <strong>${formatMoney(p.price)}</strong>
                  <button class="icon-btn-sm" title="Edit Product" onclick="window.adminEditProduct('${p.id}')">
                    <i data-lucide="edit-3"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   2. PRODUCTS TAB (CRUD & EDITING)
   ========================================================================== */
function renderProductsTab() {
  const filteredProducts = adminProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
                          (p.tag && p.tag.toLowerCase().includes(productSearchQuery.toLowerCase()));
    const matchesCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return `
    <div class="admin-products-section">
      <div class="admin-header-title">
        <div>
          <h2>Prop Catalog Management</h2>
          <p class="admin-subtext">Add new dummy cakes, update prices, specs, tags, and product images.</p>
        </div>
        <button id="adminAddProductBtn" class="btn-primary">
          <i data-lucide="plus"></i> Add New Product
        </button>
      </div>

      <!-- Controls Toolbar -->
      <div class="admin-toolbar">
        <div class="search-input-wrapper">
          <i data-lucide="search"></i>
          <input type="text" id="adminProductSearchInput" placeholder="Search prop name, tag, description..." value="${productSearchQuery}">
        </div>

        <div class="filter-group">
          <label>Category:</label>
          <select id="adminProductCategorySelect" class="form-select-sm">
            <option value="all" ${productCategoryFilter === 'all' ? 'selected' : ''}>All Categories</option>
            <option value="wedding" ${productCategoryFilter === 'wedding' ? 'selected' : ''}>Wedding Dummies</option>
            <option value="photography" ${productCategoryFilter === 'photography' ? 'selected' : ''}>Photo Kits</option>
            <option value="pedestal" ${productCategoryFilter === 'pedestal' ? 'selected' : ''}>Pedestals</option>
            <option value="custom" ${productCategoryFilter === 'custom' ? 'selected' : ''}>Custom/Commercial</option>
          </select>
        </div>

        <div style="margin-left: auto; color: var(--text-muted); font-size: 0.85rem;">
          Showing <strong>${filteredProducts.length}</strong> of <strong>${adminProducts.length}</strong> props
        </div>
      </div>

      <!-- Products Data Table -->
      <div class="admin-card" style="margin-top: 16px;">
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="width: 70px;">Image</th>
                <th>Product Details</th>
                <th>Category</th>
                <th>Price</th>
                <th>Tag</th>
                <th>Rating</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filteredProducts.length === 0 ? `
                <tr>
                  <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    No products found matching your search.
                  </td>
                </tr>
              ` : ''}
              ${filteredProducts.map(p => `
                <tr>
                  <td>
                    <img src="${p.image}" alt="${p.name}" class="admin-table-img">
                  </td>
                  <td>
                    <div style="font-weight: 600; color: var(--text-primary);">${p.name}</div>
                    <small style="color: var(--text-muted); font-size: 0.78rem; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">${p.description}</small>
                  </td>
                  <td>
                    <span class="admin-category-badge">${p.category}</span>
                  </td>
                  <td>
                    <div><strong>${formatMoney(p.price)}</strong></div>
                    ${p.originalPrice ? `<small style="text-decoration: line-through; color: var(--text-muted);">${formatMoney(p.originalPrice)}</small>` : ''}
                  </td>
                  <td>
                    <span class="badge ${p.tag === 'Bestseller' ? 'badge-gold' : 'badge-brand'}">${p.tag || 'Standard'}</span>
                  </td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 4px; font-size: 0.85rem;">
                      <i data-lucide="star" style="width: 13px; height: 13px; fill: var(--color-gold); color: var(--color-gold);"></i>
                      <span>${p.rating || 5.0} (${p.reviewsCount || 0})</span>
                    </div>
                  </td>
                  <td style="text-align: right;">
                    <button class="btn-action-edit" title="Edit Product" onclick="window.adminEditProduct('${p.id}')">
                      <i data-lucide="edit"></i> Edit
                    </button>
                    <button class="btn-action-delete" title="Delete Product" onclick="window.adminDeleteProduct('${p.id}')">
                      <i data-lucide="trash-2"></i>
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
  const searchInput = document.getElementById('adminProductSearchInput');
  const catSelect = document.getElementById('adminProductCategorySelect');
  const addBtn = document.getElementById('adminAddProductBtn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      productSearchQuery = e.target.value;
      renderAdminTabContent();
    });
  }

  if (catSelect) {
    catSelect.addEventListener('change', (e) => {
      productCategoryFilter = e.target.value;
      renderAdminTabContent();
    });
  }

  if (addBtn) {
    addBtn.addEventListener('click', () => openProductEditModal(null));
  }
}

// Global scope bindings for inline onclicks
window.adminEditProduct = function(productId) {
  openProductEditModal(productId);
};

window.adminDeleteProduct = function(productId) {
  const product = adminProducts.find(p => p.id === productId);
  if (!product) return;

  if (confirm(`Are you sure you want to delete "${product.name}" from your catalog?`)) {
    adminProducts = adminProducts.filter(p => p.id !== productId);
    saveAdminProducts();
    showAdminToast(`Deleted product "${product.name}"`, 'warning');
    renderAdminTabContent();
  }
};

// Open Product Edit/Add Modal
export function openProductEditModal(productId = null) {
  currentEditingProductId = productId;
  const modal = document.getElementById('adminProductModal');
  const titleEl = document.getElementById('adminProductModalTitle');
  const form = document.getElementById('adminProductForm');

  if (!modal || !form) return;

  if (productId) {
    const p = adminProducts.find(item => item.id === productId);
    if (!p) return;
    titleEl.textContent = `Edit Product: ${p.name}`;
    document.getElementById('prodId').value = p.id;
    document.getElementById('prodName').value = p.name;
    document.getElementById('prodCategory').value = p.category;
    document.getElementById('prodPrice').value = p.price;
    document.getElementById('prodOrigPrice').value = p.originalPrice || '';
    document.getElementById('prodTag').value = p.tag || 'Handcrafted';
    document.getElementById('prodRating').value = p.rating || 5.0;
    document.getElementById('prodReviews').value = p.reviewsCount || 10;
    document.getElementById('prodImage').value = p.image || '/images/wedding_tier_prop.png';
    document.getElementById('prodDesc').value = p.description || '';
    document.getElementById('prodHeight').value = p.specs?.height || '';
    document.getElementById('prodTiers').value = p.specs?.tiers || '';
    document.getElementById('prodMaterial').value = p.specs?.material || '';
    document.getElementById('prodWeight').value = p.specs?.weight || '';
  } else {
    titleEl.textContent = 'Add New Cake Prop';
    form.reset();
    document.getElementById('prodId').value = `prop-${Date.now().toString().slice(-4)}`;
    document.getElementById('prodRating').value = 5.0;
    document.getElementById('prodReviews').value = 1;
    document.getElementById('prodImage').value = '/images/wedding_tier_prop.png';
  }

  modal.classList.add('open');
  refreshIcons();
}

// Handle Form Submission for Product Add/Edit
function handleProductFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('prodId').value || `prop-${Date.now().toString().slice(-4)}`;
  const name = document.getElementById('prodName').value;
  const category = document.getElementById('prodCategory').value;
  const price = parseFloat(document.getElementById('prodPrice').value) || 0;
  const origPriceVal = document.getElementById('prodOrigPrice').value;
  const originalPrice = origPriceVal ? parseFloat(origPriceVal) : undefined;
  const tag = document.getElementById('prodTag').value;
  const rating = parseFloat(document.getElementById('prodRating').value) || 5.0;
  const reviewsCount = parseInt(document.getElementById('prodReviews').value, 10) || 0;
  const image = document.getElementById('prodImage').value || '/images/wedding_tier_prop.png';
  const description = document.getElementById('prodDesc').value;

  const height = document.getElementById('prodHeight').value;
  const tiers = document.getElementById('prodTiers').value;
  const material = document.getElementById('prodMaterial').value;
  const weight = document.getElementById('prodWeight').value;

  const specs = {};
  if (height) specs.height = height;
  if (tiers) specs.tiers = tiers;
  if (material) specs.material = material;
  if (weight) specs.weight = weight;

  const productData = {
    id,
    name,
    category,
    price,
    originalPrice,
    tag,
    rating,
    reviewsCount,
    image,
    description,
    specs: Object.keys(specs).length > 0 ? specs : { material: "Polymer Fondant Compound" }
  };

  const existingIndex = adminProducts.findIndex(p => p.id === id);
  if (existingIndex >= 0) {
    adminProducts[existingIndex] = productData;
    showAdminToast(`Updated prop "${name}" successfully!`, 'success');
  } else {
    adminProducts.unshift(productData);
    showAdminToast(`Added new prop "${name}" to store!`, 'success');
  }

  saveAdminProducts();

  document.getElementById('adminProductModal').classList.remove('open');
  renderAdminTabContent();
}


/* ==========================================================================
   3. ORDERS TAB (WIRE VERIFICATION & TRACKING)
   ========================================================================== */
function renderOrdersTab() {
  const filteredOrders = adminOrders.filter(o => {
    const matchesSearch = o.orderId.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                          o.customerEmail.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                          (o.utrNumber && o.utrNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()));
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return `
    <div class="admin-orders-section">
      <div class="admin-header-title">
        <div>
          <h2>Order & Payment Management</h2>
          <p class="admin-subtext">Verify direct bank transfer payments, update status, and manage shipping.</p>
        </div>
      </div>

      <!-- Controls Toolbar -->
      <div class="admin-toolbar">
        <div class="search-input-wrapper">
          <i data-lucide="search"></i>
          <input type="text" id="adminOrderSearchInput" placeholder="Search by Order Ref ID, Customer, Email or UTR..." value="${orderSearchQuery}">
        </div>

        <div class="filter-group">
          <label>Filter Status:</label>
          <select id="adminOrderStatusSelect" class="form-select-sm">
            <option value="all" ${orderStatusFilter === 'all' ? 'selected' : ''}>All Orders (${adminOrders.length})</option>
            <option value="Awaiting Bank Transfer Verification" ${orderStatusFilter === 'Awaiting Bank Transfer Verification' ? 'selected' : ''}>Awaiting Bank Wire</option>
            <option value="Payment Verified" ${orderStatusFilter === 'Payment Verified' ? 'selected' : ''}>Payment Verified</option>
            <option value="In Production" ${orderStatusFilter === 'In Production' ? 'selected' : ''}>In Production</option>
            <option value="Shipped" ${orderStatusFilter === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${orderStatusFilter === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Cancelled" ${orderStatusFilter === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </div>
      </div>

      <!-- Orders Data Table -->
      <div class="admin-card" style="margin-top: 16px;">
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Date</th>
                <th>Customer Info</th>
                <th>Items</th>
                <th>Total</th>
                <th>Bank UTR Ref</th>
                <th>Status</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${filteredOrders.length === 0 ? `
                <tr>
                  <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ` : ''}
              ${filteredOrders.map(o => `
                <tr>
                  <td>
                    <strong style="color: var(--color-brand); font-family: monospace; font-size: 0.95rem;">${o.orderId}</strong>
                  </td>
                  <td><span style="font-size: 0.8rem; color: var(--text-secondary);">${o.date}</span></td>
                  <td>
                    <div style="font-weight: 600;">${o.customerName}</div>
                    <small style="color: var(--text-muted); font-size: 0.75rem;">${o.customerEmail}</small>
                  </td>
                  <td>
                    <span style="font-size: 0.82rem; color: var(--text-secondary);">
                      ${o.items ? o.items.map(i => `${i.name} (x${i.qty})`).join(', ') : 'Prop items'}
                    </span>
                  </td>
                  <td><strong style="font-size: 0.95rem;">${formatMoney(o.totalAmount)}</strong></td>
                  <td>
                    <span style="font-family: monospace; font-size: 0.8rem; background: var(--bg-secondary); padding: 2px 6px; border-radius: 4px;">
                      ${o.utrNumber || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <select class="status-select ${getStatusBadgeClass(o.status)}" onchange="window.adminChangeOrderStatus('${o.orderId}', this.value)">
                      <option value="Awaiting Bank Transfer Verification" ${o.status === 'Awaiting Bank Transfer Verification' ? 'selected' : ''}>Awaiting Verification</option>
                      <option value="Payment Verified" ${o.status === 'Payment Verified' ? 'selected' : ''}>Payment Verified</option>
                      <option value="In Production" ${o.status === 'In Production' ? 'selected' : ''}>In Production</option>
                      <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                      <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                      <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                  </td>
                  <td style="text-align: right;">
                    <button class="btn-action-view" onclick="window.adminOpenOrderDetails('${o.orderId}')">
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
  const searchInput = document.getElementById('adminOrderSearchInput');
  const statusSelect = document.getElementById('adminOrderStatusSelect');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      orderSearchQuery = e.target.value;
      renderAdminTabContent();
    });
  }

  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      orderStatusFilter = e.target.value;
      renderAdminTabContent();
    });
  }
}

// Global Order Action Handlers
window.adminChangeOrderStatus = function(orderId, newStatus) {
  const order = adminOrders.find(o => o.orderId === orderId);
  if (!order) return;

  order.status = newStatus;
  saveAdminOrders();
  showAdminToast(`Order ${orderId} updated to "${newStatus}"`, 'success');
  renderAdminTabContent();
};

window.adminOpenOrderDetails = function(orderId) {
  currentViewingOrderId = orderId;
  const order = adminOrders.find(o => o.orderId === orderId);
  if (!order) return;

  const modal = document.getElementById('adminOrderDetailModal');
  const container = document.getElementById('adminOrderDetailContent');

  if (!modal || !container) return;

  container.innerHTML = `
    <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border-color); padding-bottom: 16px;">
      <div>
        <span class="badge badge-gold" style="margin-bottom: 6px;">Order Details</span>
        <h2 style="font-size: 1.6rem; color: var(--color-brand);">${order.orderId}</h2>
        <span style="font-size: 0.85rem; color: var(--text-muted);">Placed on ${order.date}</span>
      </div>
      <div>
        <select class="status-select ${getStatusBadgeClass(order.status)}" style="padding: 6px 12px; font-size: 0.9rem;" onchange="window.adminChangeOrderStatus('${order.orderId}', this.value); window.adminOpenOrderDetails('${order.orderId}');">
          <option value="Awaiting Bank Transfer Verification" ${order.status === 'Awaiting Bank Transfer Verification' ? 'selected' : ''}>Awaiting Bank Wire</option>
          <option value="Payment Verified" ${order.status === 'Payment Verified' ? 'selected' : ''}>Payment Verified</option>
          <option value="In Production" ${order.status === 'In Production' ? 'selected' : ''}>In Production</option>
          <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </div>
    </div>

    <!-- Customer & Bank Wire Info Cards -->
    <div class="admin-grid-2col" style="gap: 16px; margin-bottom: 20px;">
      <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-sm); font-size: 0.88rem;">
        <h4 style="color: var(--color-brand); margin-bottom: 8px; font-size: 0.95rem;"><i data-lucide="user" style="width: 14px; height: 14px;"></i> Customer Information</h4>
        <div><strong>Name:</strong> ${order.customerName}</div>
        <div><strong>Email:</strong> ${order.customerEmail}</div>
        <div><strong>Shipping Address:</strong> ${order.shippingAddress}</div>
      </div>

      <div style="background: var(--bg-secondary); padding: 16px; border-radius: var(--radius-sm); font-size: 0.88rem;">
        <h4 style="color: var(--color-brand); margin-bottom: 8px; font-size: 0.95rem;"><i data-lucide="landmark" style="width: 14px; height: 14px;"></i> Wire Payment Reference</h4>
        <div><strong>Payment Method:</strong> ${order.paymentMethod}</div>
        <div><strong>UTR Reference No:</strong> <span style="font-family: monospace; font-weight: 700; color: var(--color-brand);">${order.utrNumber || 'Pending'}</span></div>
        <div><strong>Bank Name:</strong> ${BANK_DETAILS.bankName}</div>
      </div>
    </div>

    <!-- Items Breakdown -->
    <h4 style="margin-bottom: 12px; font-size: 1rem;"><i data-lucide="package" style="vertical-align: middle;"></i> Ordered Prop Items</h4>
    <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 20px;">
      <table class="admin-table">
        <thead>
          <tr style="background: var(--bg-secondary);">
            <th>Prop Name</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th style="text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${(order.items || []).map(i => `
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="${i.image}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;">
                  <strong>${i.name}</strong>
                </div>
              </td>
              <td>${formatMoney(i.price)}</td>
              <td>x${i.qty}</td>
              <td style="text-align: right;"><strong>${formatMoney(i.price * i.qty)}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(140,36,67,0.06); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 20px;">
      <span style="font-size: 1rem; font-weight: 600;">Total Payable Amount</span>
      <span style="font-size: 1.5rem; font-weight: 800; color: var(--color-brand);">${formatMoney(order.totalAmount)}</span>
    </div>

    <!-- Admin Notes Section -->
    <div>
      <label class="form-label">Admin Notes & Tracking Memo</label>
      <textarea id="adminOrderNotesInput" class="form-input" rows="3" placeholder="Add tracking numbers, wire verification notes or customer communication logs...">${order.adminNotes || ''}</textarea>
      <button class="btn-primary" style="margin-top: 10px; padding: 8px 16px; font-size: 0.85rem;" onclick="window.adminSaveOrderNotes('${order.orderId}')">
        <i data-lucide="save"></i> Save Admin Notes
      </button>
    </div>
  `;

  refreshIcons();
  modal.classList.add('open');
};

window.adminSaveOrderNotes = function(orderId) {
  const notes = document.getElementById('adminOrderNotesInput').value;
  const order = adminOrders.find(o => o.orderId === orderId);
  if (order) {
    order.adminNotes = notes;
    saveAdminOrders();
    showAdminToast(`Saved notes for order ${orderId}`, 'success');
  }
};


/* ==========================================================================
   4. SETTINGS TAB
   ========================================================================== */
function renderSettingsTab() {
  return `
    <div class="admin-settings-section">
      <div class="admin-header-title">
        <div>
          <h2>Storefront & Wire Settings</h2>
          <p class="admin-subtext">Configure studio wire bank account details and admin preferences.</p>
        </div>
      </div>

      <div class="admin-card" style="max-width: 680px; padding: 24px;">
        <h3 style="margin-bottom: 16px; color: var(--color-brand);"><i data-lucide="landmark" style="vertical-align: middle;"></i> Bank Wire Wire Account Info</h3>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 20px;">This bank information is rendered during customer checkout for Direct Wire Transfers.</p>

        <form id="adminSettingsForm">
          <div class="form-group">
            <label class="form-label">Bank Name</label>
            <input type="text" class="form-input" value="${BANK_DETAILS.bankName}" readonly style="background: var(--bg-secondary);">
          </div>
          <div class="form-group">
            <label class="form-label">Account Holder Name</label>
            <input type="text" class="form-input" value="${BANK_DETAILS.accountName}" readonly style="background: var(--bg-secondary);">
          </div>
          <div class="form-group">
            <label class="form-label">Account Number</label>
            <input type="text" class="form-input" value="${BANK_DETAILS.accountNumber}" readonly style="background: var(--bg-secondary);">
          </div>
          <div class="form-group">
            <label class="form-label">Support Email</label>
            <input type="text" class="form-input" value="${BANK_DETAILS.supportEmail}" readonly style="background: var(--bg-secondary);">
          </div>
          <div style="margin-top: 20px;">
            <button type="button" class="btn-secondary" onclick="alert('Bank settings are configured in productsData.js and sync live with checkout.')">
              <i data-lucide="shield-check"></i> System Operational
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function attachSettingsTabEvents() {}

// Helper for status badge CSS classes
function getStatusBadgeClass(status) {
  switch (status) {
    case 'Awaiting Bank Transfer Verification':
      return 'badge-status-pending';
    case 'Payment Verified':
      return 'badge-status-verified';
    case 'In Production':
      return 'badge-status-production';
    case 'Shipped':
      return 'badge-status-shipped';
    case 'Delivered':
      return 'badge-status-delivered';
    case 'Cancelled':
      return 'badge-status-cancelled';
    default:
      return 'badge-status-pending';
  }
}
