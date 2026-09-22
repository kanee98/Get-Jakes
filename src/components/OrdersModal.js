/**
 * My Orders Tracking Modal Component
 */
import { createIcons, icons } from 'lucide';
import { fetchOrdersApi } from '../services/api.js';

function refreshIcons() {
  createIcons({ icons });
}

export function setupOrdersModal(getOrders) {
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

    let orders = await fetchOrdersApi();
    if (!orders || orders.length === 0) {
      orders = getOrders ? getOrders() : [];
    }

    if (!orders || orders.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 50px 20px;">
          <i data-lucide="receipt" style="width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.4;"></i>
          <p>You haven't placed any orders yet.</p>
        </div>
      `;
      refreshIcons();
      return;
    }

    container.innerHTML = orders.map(o => {
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
