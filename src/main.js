/**
 * Main Application Entry Point & Component Orchestrator
 */
import { setupHeaderComponent } from './components/Header.js';
import { setupFooterComponent } from './components/Footer.js';
import { setupAppLoader } from './components/Loader.js';
import { setupCookieBanner } from './components/CookieBanner.js';
import { renderGallery } from './components/Gallery.js';
import { setupQuoteCalculator } from './components/CustomQuote.js';
import { setupCategoryTabs, renderProductsGrid, reloadDynamicProducts } from './components/ShopCatalog.js';
import { setupCartDrawer, updateCartUI } from './components/CartDrawer.js';
import { setupCheckoutModal } from './components/CheckoutModal.js';
import { setupOrdersModal } from './components/OrdersModal.js';
import { openQuickViewModal } from './components/QuickViewModal.js';
import { setupChatWidget } from './components/ChatWidget.js';
import { initAdminDashboard } from './admin/adminDashboard.js';
import { createIcons, icons } from 'lucide';

// Initialize Lucide Icons
function initIcons() {
  createIcons({ icons });
}

// App State
let cart = JSON.parse(localStorage.getItem('gj_cart') || localStorage.getItem('vt_cart')) || [];
let orders = JSON.parse(localStorage.getItem('gj_orders') || localStorage.getItem('vt_orders')) || [];

document.addEventListener('DOMContentLoaded', () => {
  setupAppLoader();
  initIcons();
  setupHeaderComponent();
  setupFooterComponent();
  setupCookieBanner();
  renderGallery();
  setupQuoteCalculator();
  setupChatWidget();
  initAdminDashboard();

  // Setup Modals & Cart
  const { openCheckoutModal } = setupCheckoutModal(() => cart, handleOrderPlaced);
  const { openCart } = setupCartDrawer(cart, refreshCart, () => openCheckoutModal());
  const { openOrdersModal } = setupOrdersModal(() => orders);

  function refreshCart() {
    updateCartUI(cart, refreshCart);
  }

  function handleAddToCart(product) {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    localStorage.setItem('gj_cart', JSON.stringify(cart));
    localStorage.setItem('vt_cart', JSON.stringify(cart));
    refreshCart();
    openCart();
  }

  function handleOrderPlaced(newOrder) {
    orders.unshift(newOrder);
    localStorage.setItem('gj_orders', JSON.stringify(orders));
    localStorage.setItem('vt_orders', JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('gj_orders_updated', { detail: orders }));

    // Clear cart
    cart = [];
    localStorage.setItem('gj_cart', JSON.stringify(cart));
    localStorage.setItem('vt_cart', JSON.stringify(cart));
    refreshCart();

    // Show orders modal
    openOrdersModal();
  }

  // Render Shop Grid & Category Tabs
  setupCategoryTabs();
  renderProductsGrid(
    handleAddToCart,
    (product) => openQuickViewModal(product, handleAddToCart)
  );

  refreshCart();

  // Listen for catalog updates from Admin Portal
  window.addEventListener('gj_products_updated', () => {
    reloadDynamicProducts();
    renderProductsGrid(
      handleAddToCart,
      (product) => openQuickViewModal(product, handleAddToCart)
    );
  });
  window.addEventListener('vt_products_updated', () => {
    reloadDynamicProducts();
    renderProductsGrid(
      handleAddToCart,
      (product) => openQuickViewModal(product, handleAddToCart)
    );
  });

  // Listen for order updates
  window.addEventListener('gj_orders_updated', () => {
    orders = JSON.parse(localStorage.getItem('gj_orders') || localStorage.getItem('vt_orders')) || [];
  });
  window.addEventListener('vt_orders_updated', () => {
    orders = JSON.parse(localStorage.getItem('gj_orders') || localStorage.getItem('vt_orders')) || [];
  });
});
