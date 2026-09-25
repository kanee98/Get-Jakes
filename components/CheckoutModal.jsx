'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Landmark, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutModal() {
  const { cart, isCheckoutOpen, setIsCheckoutOpen, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { showAlert } = useModal();
  const router = useRouter();

  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custUtr, setCustUtr] = useState('');
  const [refCode, setRefCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isCheckoutOpen) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setRefCode(`GJ-${randomNum}-PAY`);

      if (user) {
        if (!custName) setCustName(user.fullName || '');
        if (!custEmail) setCustEmail(user.email || '');
      }
    }
  }, [isCheckoutOpen, user]);

  if (!isCheckoutOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: custName,
          customerEmail: custEmail,
          shippingAddress: custAddress,
          items: cart,
          total: totalAmount,
          paymentMethod: 'Direct Bank Transfer',
          utrNumber: custUtr || 'Pending Wire Reference'
        })
      });

      if (!res.ok) {
        throw new Error('Failed to submit order');
      }

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      clearCart();
      setIsCheckoutOpen(false);
      router.push('/my-orders');
    } catch (err) {
      await showAlert('Order Error', 'Error placing order: ' + err.message, 'warning');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay open">
      <div className="modal-content" style={{ padding: 32, maxWidth: 680 }}>
        <button onClick={() => setIsCheckoutOpen(false)} className="modal-close-btn">
          <X style={{ width: 20, height: 20 }} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-brand)', margin: 0 }}>
            Bank Details & Order Placement
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Complete your order below. Transfer the total amount using the provided studio bank details.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                placeholder="Jane Doe"
                required
              />
            </div>
            <div>
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                value={custEmail}
                onChange={(e) => setCustEmail(e.target.value)}
                placeholder="jane@example.com"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Delivery Address *</label>
            <input
              type="text"
              className="form-input"
              value={custAddress}
              onChange={(e) => setCustAddress(e.target.value)}
              placeholder="123 Studio St, Suite 4B, New York, NY"
              required
            />
          </div>

          <div className="ref-code-box">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
              Your Order Reference Code
            </div>
            <div className="ref-code">{refCode}</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Include this code in your bank transfer memo/remarks so we can match your payment.
            </p>
          </div>

          <div className="bank-details-card">
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-black)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Landmark style={{ color: 'var(--color-brand-dark)' }} /> Artisanal Commerce Bank Details
            </h3>
            <div className="bank-row">
              <span style={{ color: 'var(--text-secondary)' }}>Bank Name:</span>
              <strong>Artisanal Commerce Bank</strong>
            </div>
            <div className="bank-row">
              <span style={{ color: 'var(--text-secondary)' }}>Account Holder:</span>
              <strong>Get Jakes Props & Toppers LLC</strong>
            </div>
            <div className="bank-row">
              <span style={{ color: 'var(--text-secondary)' }}>Account Number:</span>
              <strong style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--color-black)' }}>
                9876 5432 1098 4421
              </strong>
            </div>
            <div className="bank-row">
              <span style={{ color: 'var(--text-secondary)' }}>IFSC / Sort Code:</span>
              <strong style={{ fontFamily: 'monospace' }}>ACTB0009841</strong>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Transaction UTR / Reference No. (Optional)</label>
            <input
              type="text"
              className="form-input"
              value={custUtr}
              onChange={(e) => setCustUtr(e.target.value)}
              placeholder="e.g. UTR-99823145 or Bank Reference"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Payable Amount:</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-black)' }}>
                ${totalAmount.toFixed(2)}
              </div>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary">
              <CheckCircle2 style={{ width: 18, height: 18 }} /> {submitting ? 'Placing Order...' : 'Confirm & Submit Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
