/**
 * Main Application Entry Point & Component Orchestrator
 */
import loaderHtml from './templates/loader.html?raw';
import cookieBannerHtml from './templates/cookieBanner.html?raw';
import headerHtml from './templates/header.html?raw';
import heroHtml from './templates/hero.html?raw';
import shopHtml from './templates/shop.html?raw';
import galleryHtml from './templates/gallery.html?raw';
import customQuoteHtml from './templates/customQuote.html?raw';
import footerHtml from './templates/footer.html?raw';
import modalsHtml from './templates/modals.html?raw';
import chatWidgetHtml from './templates/chatWidget.html?raw';

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
import { setupAuthModal } from './components/AuthModal.js';
import { openQuickViewModal } from './components/QuickViewModal.js';
import { setupChatWidget } from './components/ChatWidget.js';
import { initAdminDashboard } from './admin/adminDashboard.js';
import { createIcons, icons } from 'lucide';

// Mount all modular HTML templates into structural roots
function mountTemplates() {
  const loaderRoot = document.getElementById('loader-root');
  const cookieRoot = document.getElementById('cookie-root');
  const headerRoot = document.getElementById('header-root');
  const heroRoot = document.getElementById('hero-root');
  const shopRoot = document.getElementById('shop-root');
  const galleryRoot = document.getElementById('gallery-root');
  const quoteRoot = document.getElementById('quote-root');
  const footerRoot = document.getElementById('footer-root');
  const modalsRoot = document.getElementById('modals-root');
  const chatRoot = document.getElementById('chat-root');

  if (loaderRoot) loaderRoot.innerHTML = loaderHtml;
  if (cookieRoot) cookieRoot.innerHTML = cookieBannerHtml;
  if (headerRoot) headerRoot.innerHTML = headerHtml;
  if (heroRoot) heroRoot.innerHTML = heroHtml;
  if (shopRoot) shopRoot.innerHTML = shopHtml;
  if (galleryRoot) galleryRoot.innerHTML = galleryHtml;
  if (quoteRoot) quoteRoot.innerHTML = customQuoteHtml;
  if (footerRoot) footerRoot.innerHTML = footerHtml;
  if (modalsRoot) modalsRoot.innerHTML = modalsHtml;
  if (chatRoot) chatRoot.innerHTML = chatWidgetHtml;
}

// Initialize Lucide Icons
function initIcons() {
  createIcons({ icons });
}

// App State
let cart = JSON.parse(localStorage.getItem('gj_cart') || localStorage.getItem('vt_cart')) || [];
let orders = JSON.parse(localStorage.getItem('gj_orders') || localStorage.getItem('vt_orders')) || [];

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Mount modular HTML templates into roots
  mountTemplates();

  // 2. Initialize App Components & Auth
  setupAppLoader();
  initIcons();

  const { openAuthModal } = setupAuthModal((user) => {
    if (user.role === 'customer') {
      openOrdersModal();
    }
  });

  function openAdminDashboardModal() {
    const adminModal = document.getElementById('adminDashboardModal');
    adminModal?.classList.add('open');
  }

  // 3. Setup Cart Drawer & Modals
  const { openCheckoutModal } = setupCheckoutModal(() => cart, handleOrderPlaced);
  const { openCart } = setupCartDrawer(cart, refreshCart, () => openCheckoutModal());
  const { openOrdersModal } = setupOrdersModal(() => orders, openAuthModal);

  setupHeaderComponent(
    (tab) => openAuthModal(tab),
    () => openOrdersModal(),
    () => openAdminDashboardModal()
  );

  setupFooterComponent();
  setupCookieBanner();
  renderGallery();
  setupQuoteCalculator();
  setupChatWidget();
  initAdminDashboard();

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

    cart = [];
    localStorage.setItem('gj_cart', JSON.stringify(cart));
    localStorage.setItem('vt_cart', JSON.stringify(cart));
    refreshCart();

    openOrdersModal();
  }

  // 4. Render Shop Grid & Category Filter Tabs
  setupCategoryTabs();
  await reloadDynamicProducts();
  renderProductsGrid(
    handleAddToCart,
    (product) => openQuickViewModal(product, handleAddToCart)
  );

  refreshCart();

  // 5. Global Store Events
  window.addEventListener('gj_products_updated', async () => {
    await reloadDynamicProducts();
    renderProductsGrid(
      handleAddToCart,
      (product) => openQuickViewModal(product, handleAddToCart)
    );
  });

  window.addEventListener('gj_orders_updated', () => {
    orders = JSON.parse(localStorage.getItem('gj_orders') || localStorage.getItem('vt_orders')) || [];
  });
});
