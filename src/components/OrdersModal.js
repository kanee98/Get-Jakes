/**
 * My Orders Tracking Modal Component
 */
import { createIcons, icons } from 'lucide';
import { fetchOrdersApi } from '../services/api.js';
import { getCurrentUser } from './AuthModal.js';

function refreshIcons() {
  createIcons({ icons });
}

export function setupOrdersModal(getOrders, onOpenAuthModal) {
  const modal = document.getElementById('ordersModal');
  const container = document.getElementById('ordersListContainer');

  async function openOrdersModal() {
    await renderOrders();
    modal?.classList.add('open');
  }

  function closeOrdersModal() {
    modal?.classList.remove('open');
  }

  modal?.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', closeOrdersModal);
  });

  async function renderOrders() {
    if (!container) return;

    const user = getCurrentUser();

    // 1. Not Logged In State
    if (!user) {
      container.innerHTML = `
        <div style="background: var(--bg-secondary); border: 2px dashed var(--border-color); border-radius: var(--radius-lg); padding: 40px 24px; text-align: center;">
          <div style="width: 60px; height: 60px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: var(--shadow-sm); color: var(--color-brand-dark);">
            <i data-lucide="lock" style="width: 28px; height: 28px;"></i>
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--color-black); margin-bottom: 8px;">Please Sign In to View Your Orders</h3>
          <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 400px; margin: 0 auto 20px;">
            Sign in with your Get Jakes customer account to view your past purchases, track bank wire verification status, and manage deliveries.
          </p>
          <button id="btnOrdersModalSignIn" class="btn-primary" style="margin: 0 auto;">
            <i data-lucide="log-in"></i> Sign In / Create Account
          </button>
        </div>
      `;
      refreshIcons();

      document.getElementById('btnOrdersModalSignIn')?.addEventListener('click', () => {
        closeOrdersModal();
        if (onOpenAuthModal) onOpenAuthModal('login');
      });
      return;
    }

    // 2. Logged In Customer: Fetch orders filtered by email
    let allOrders = await fetchOrdersApi();
    if (!allOrders || allOrders.length === 0) {
      allOrders = getOrders ? getOrders() : [];
    }

    const userEmailClean = user.email ? user.email.toLowerCase().trim() : '';
    const userOrders = allOrders.filter(o => {
      const orderEmail = o.customerEmail ? o.customerEmail.toLowerCase().trim() : '';
      return orderEmail === userEmailClean || user.role === 'admin';
    });

    // 3. Logged In Customer with 0 Orders: Animated Empty State
    if (userOrders.length === 0) {
      container.innerHTML = `
        <div class="empty-orders-animated">
          <div class="empty-orders-icon">
            <i data-lucide="shopping-bag" style="width: 32px; height: 32px;"></i>
          </div>
          <h3 class="empty-orders-title">You Haven't Shopped With Us Yet!</h3>
          <p class="empty-orders-text">
            Discover our artisanal collection of handcrafted wedding dummy cakes, studio photography props, and architectural pedestals engineered for studio perfection.
          </p>
          <button id="btnOrdersExploreShop" class="btn-primary" style="margin: 0 auto; box-shadow: 0 10px 25px rgba(15, 179, 182, 0.3);">
            <i data-lucide="sparkles"></i> Explore Prop Catalog
          </button>
        </div>
      `;
      refreshIcons();

      document.getElementById('btnOrdersExploreShop')?.addEventListener('click', () => {
        closeOrdersModal();
        const shopSection = document.getElementById('shop');
        shopSection?.scrollIntoView({ behavior: 'smooth' });
      });
      return;
    }

    // 4. Logged In Customer with Orders List
    container.innerHTML = userOrders.map(o => {
      const displayId = o.id || o.orderId || o.order_ref_code;
      const displayDate = o.date ? (typeof o.date === 'string' && o.date.includes('T') ? new Date(o.date).toLocaleDateString() : o.date) : 'Recent';
      const displayTotal = o.total !== undefined ? o.total : o.totalAmount;
      const statusText = o.status || 'Pending';

      return `
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 20px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 12px;">
            <div>
              <span class="ref-code" style="font-size: 1.1rem; color: var(--color-black);">${displayId}</span>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Placed on ${displayDate}</div>
            </div>
            <span class="status-badge ${statusText.includes('Verified') ? 'badge-status-verified' : statusText.includes('Shipped') ? 'badge-status-shipped' : 'badge-status-pending'}">
              ${statusText}
            </span>
          </div>

          <div style="margin-bottom: 12px;">
            ${(o.items || []).map(item => `
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 6px;">
                <span>${item.name} × ${item.qty}</span>
                <strong>$${(parseFloat(item.price || 0) * parseInt(item.qty || 1)).toFixed(2)}</strong>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color); padding-top: 10px; font-size: 0.9rem;">
            <span style="color: var(--text-secondary);">Total Payable:</span>
            <strong style="font-size: 1.1rem; color: var(--color-black);">$${parseFloat(displayTotal || 0).toFixed(2)}</strong>
          </div>
        </div>
      `;
    }).join('');

    refreshIcons();
  }

  return { openOrdersModal, closeOrdersModal, renderOrders };
}
