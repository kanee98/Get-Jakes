/**
 * Shopping Cart Drawer Component
 */
import { createIcons, icons } from 'lucide';

function refreshIcons() {
  createIcons({ icons });
}

export function setupCartDrawer(cart, onCartUpdated, onProceedCheckout) {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const openBtn = document.getElementById('cartDrawerBtn');
  const closeBtn = document.getElementById('closeCartBtn');
  const checkoutBtn = document.getElementById('proceedCheckoutBtn');

  function openCart() {
    drawer?.classList.add('open');
    backdrop?.classList.add('open');
  }

  function closeCart() {
    drawer?.classList.remove('open');
    backdrop?.classList.remove('open');
  }

  openBtn?.addEventListener('click', openCart);
  closeBtn?.addEventListener('click', closeCart);
  backdrop?.addEventListener('click', closeCart);

  checkoutBtn?.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your prop basket is empty. Please add items to proceed.');
      return;
    }
    closeCart();
    if (onProceedCheckout) onProceedCheckout();
  });

  return { openCart, closeCart };
}

export function updateCartUI(cart, onCartUpdated) {
  const badge = document.getElementById('cartCountBadge');
  const itemsContainer = document.getElementById('drawerCartItems');
  const subtotalDisplay = document.getElementById('cartSubtotal');
  const totalDisplay = document.getElementById('cartTotal');

  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  if (badge) badge.textContent = totalCount;

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const formattedTotal = `$${totalAmount.toFixed(2)}`;

  if (subtotalDisplay) subtotalDisplay.textContent = formattedTotal;
  if (totalDisplay) totalDisplay.textContent = formattedTotal;

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 60px 20px;">
        <i data-lucide="shopping-bag" style="width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.4;"></i>
        <p>Your prop basket is currently empty.</p>
      </div>
    `;
    refreshIcons();
    return;
  }

  itemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-price">$${parseFloat(item.price).toFixed(2)}</div>
        <div class="qty-controls">
          <button class="qty-btn dec-qty-btn" data-id="${item.id}">-</button>
          <span style="font-size: 0.85rem; font-weight: 700;">${item.qty}</span>
          <button class="qty-btn inc-qty-btn" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="remove-item-btn" data-id="${item.id}" style="color: var(--text-muted); padding: 4px;">
        <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
      </button>
    </div>
  `).join('');

  refreshIcons();

  itemsContainer.querySelectorAll('.inc-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const target = cart.find(i => i.id === id);
      if (target) {
        target.qty += 1;
        saveAndSyncCart(cart, onCartUpdated);
      }
    });
  });

  itemsContainer.querySelectorAll('.dec-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const target = cart.find(i => i.id === id);
      if (target) {
        target.qty -= 1;
        if (target.qty <= 0) {
          const index = cart.findIndex(i => i.id === id);
          if (index > -1) cart.splice(index, 1);
        }
        saveAndSyncCart(cart, onCartUpdated);
      }
    });
  });

  itemsContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const index = cart.findIndex(i => i.id === id);
      if (index > -1) cart.splice(index, 1);
      saveAndSyncCart(cart, onCartUpdated);
    });
  });
}

function saveAndSyncCart(cart, onCartUpdated) {
  localStorage.setItem('gj_cart', JSON.stringify(cart));
  localStorage.setItem('vt_cart', JSON.stringify(cart));
  if (onCartUpdated) onCartUpdated();
}
