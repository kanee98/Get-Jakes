/**
 * Product Quick View Modal Component
 */
import { createIcons, icons } from 'lucide';

function refreshIcons() {
  createIcons({ icons });
}

export function openQuickViewModal(product, onAddToCart) {
  const modal = document.getElementById('quickViewModal');
  const content = document.getElementById('quickViewContent');
  if (!modal || !content || !product) return;

  content.innerHTML = `
    <button class="modal-close-btn close-modal-btn">
      <i data-lucide="x"></i>
    </button>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: center;">
      <div style="border-radius: var(--radius-md); overflow: hidden; height: 320px; background: #FFF;">
        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div>
        <span class="badge ${product.tag === 'Bestseller' ? 'badge-gold' : 'badge-brand'}" style="margin-bottom: 8px;">${product.tag}</span>
        <h2 style="font-size: 1.5rem; color: var(--color-black); margin-bottom: 8px;">${product.name}</h2>
        <div style="font-size: 1.4rem; font-weight: 800; color: var(--color-black); margin-bottom: 14px;">
          $${parseFloat(product.price).toFixed(2)}
        </div>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5;">
          ${product.description}
        </p>
        <button id="quickViewAddBtn" class="btn-cyan" style="width: 100%; justify-content: center;">
          <i data-lucide="plus"></i> Add to Prop Basket
        </button>
      </div>
    </div>
  `;

  modal.classList.add('open');
  refreshIcons();

  content.querySelector('.close-modal-btn')?.addEventListener('click', () => {
    modal.classList.remove('open');
  });

  content.querySelector('#quickViewAddBtn')?.addEventListener('click', () => {
    if (onAddToCart) onAddToCart(product);
    modal.classList.remove('open');
  });
}
