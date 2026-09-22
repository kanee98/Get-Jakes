/**
 * Checkout & Bank Transfer Payment Modal Component
 */
import confetti from 'canvas-confetti';
import { createOrderApi } from '../services/api.js';
import { getCurrentUser } from './AuthModal.js';

export function setupCheckoutModal(getCart, onOrderPlaced) {
  const modal = document.getElementById('checkoutModal');
  const form = document.getElementById('checkoutForm');
  const refDisplay = document.getElementById('orderRefDisplay');
  const totalAmountDisplay = document.getElementById('checkoutTotalAmount');

  function openCheckoutModal() {
    const cart = getCart();
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const refCode = `GJ-${randomNum}-PAY`;

    if (refDisplay) refDisplay.textContent = refCode;
    if (totalAmountDisplay) totalAmountDisplay.textContent = `$${totalAmount.toFixed(2)}`;

    // Autofill logged in user details if available
    const user = getCurrentUser();
    if (user) {
      const custNameInput = document.getElementById('custName');
      const custEmailInput = document.getElementById('custEmail');
      if (custNameInput && !custNameInput.value) custNameInput.value = user.fullName || '';
      if (custEmailInput && !custEmailInput.value) custEmailInput.value = user.email || '';
    }

    modal?.classList.add('open');
  }

  function closeCheckoutModal() {
    modal?.classList.remove('open');
  }

  modal?.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', closeCheckoutModal);
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cart = getCart();
    if (cart.length === 0) return;

    const name = document.getElementById('custName').value;
    const email = document.getElementById('custEmail').value;
    const address = document.getElementById('custAddress').value;
    const utr = document.getElementById('custUtr').value || 'Pending Wire Reference';
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const orderPayload = {
      customerName: name,
      customerEmail: email,
      shippingAddress: address,
      items: [...cart],
      total: totalAmount,
      paymentMethod: "Direct Bank Transfer",
      utrNumber: utr
    };

    const createdOrder = await createOrderApi(orderPayload);

    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    closeCheckoutModal();
    form.reset();

    if (onOrderPlaced) onOrderPlaced(createdOrder);
  });

  return { openCheckoutModal, closeCheckoutModal };
}
