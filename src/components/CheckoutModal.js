/**
 * Checkout & Bank Transfer Payment Modal Component
 */
import confetti from 'canvas-confetti';

export function setupCheckoutModal(getCart, onOrderPlaced) {
  const modal = document.getElementById('checkoutModal');
  const form = document.getElementById('checkoutForm');
  const refDisplay = document.getElementById('orderRefDisplay');
  const totalAmountDisplay = document.getElementById('checkoutTotalAmount');

  function openCheckoutModal() {
    const cart = getCart();
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    // Generate unique Bank Transfer Reference Code
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const refCode = `GJ-${randomNum}-PAY`;

    if (refDisplay) refDisplay.textContent = refCode;
    if (totalAmountDisplay) totalAmountDisplay.textContent = `$${totalAmount.toFixed(2)}`;

    modal?.classList.add('open');
  }

  function closeCheckoutModal() {
    modal?.classList.remove('open');
  }

  modal?.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', closeCheckoutModal);
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const cart = getCart();
    if (cart.length === 0) return;

    const name = document.getElementById('custName').value;
    const email = document.getElementById('custEmail').value;
    const address = document.getElementById('custAddress').value;
    const utr = document.getElementById('custUtr').value || 'Pending Wire Reference';
    const refCode = refDisplay.textContent;
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const newOrder = {
      orderId: refCode,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      customerName: name,
      customerEmail: email,
      shippingAddress: address,
      items: [...cart],
      totalAmount: totalAmount,
      paymentMethod: "Direct Bank Transfer",
      utrNumber: utr,
      status: "Awaiting Bank Transfer Verification",
      adminNotes: "Order submitted via store checkout."
    };

    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    closeCheckoutModal();
    form.reset();

    if (onOrderPlaced) onOrderPlaced(newOrder);
  });

  return { openCheckoutModal, closeCheckoutModal };
}
