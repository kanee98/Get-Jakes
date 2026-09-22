/**
 * Prop & Topper Shop Catalog Component
 */
import { PRODUCTS } from '../data/productsData.js';
import { fetchProductsApi } from '../services/api.js';
import { createIcons, icons } from 'lucide';

let dynamicProducts = JSON.parse(localStorage.getItem('gj_products') || localStorage.getItem('vt_products')) || PRODUCTS;
let activeCategory = 'all';

function refreshIcons() {
  createIcons({ icons });
}

export async function reloadDynamicProducts() {
  const fetched = await fetchProductsApi();
  if (fetched && fetched.length > 0) {
    dynamicProducts = fetched;
  } else {
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
}

export function setupCategoryTabs(onCategoryChange) {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.dataset.category;
      if (onCategoryChange) onCategoryChange(activeCategory);
      renderProductsGrid();
    });
  });
}

export function renderProductsGrid(onAddToCart, onQuickView) {
  const container = document.getElementById('productsGrid');
  if (!container) return;

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
        <div class="product-bottom">
          <div>
            <span class="product-price">$${parseFloat(p.price).toFixed(2)}</span>
            ${p.originalPrice ? `<span class="product-price-orig">$${parseFloat(p.originalPrice).toFixed(2)}</span>` : ''}
          </div>
          <button class="add-cart-btn" data-id="${p.id}" title="Add to Prop Basket">
            <i data-lucide="plus" style="width: 18px; height: 18px;"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  refreshIcons();

  // Attach button listeners
  container.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const product = dynamicProducts.find(p => p.id === id);
      if (product && onAddToCart) onAddToCart(product);
    });
  });

  container.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const product = dynamicProducts.find(p => p.id === id);
      if (product && onQuickView) onQuickView(product);
    });
  });
}
