'use client';

import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, Trash2, Landmark } from 'lucide-react';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, setIsCheckoutOpen, updateQuantity, removeFromCart, totalAmount } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="drawer-backdrop open" onClick={() => setIsCartOpen(false)} />
      <aside className="cart-drawer open">
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/logo.png" alt="Get Jakes" style={{ width: 24, height: 24, borderRadius: '50%' }} />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Your Prop Basket</h3>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="icon-btn">
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
              <p>Your prop basket is currently empty.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-details">
                  <h4 className="cart-item-title">{item.name}</h4>
                  <div className="cart-item-price">${parseFloat(item.price).toFixed(2)}</div>
                  <div className="qty-controls">
                    <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn">
                      <Minus style={{ width: 12, height: 12 }} />
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.qty}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="qty-btn">
                      <Plus style={{ width: 12, height: 12 }} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer' }}
                >
                  <Trash2 style={{ width: 16, height: 16 }} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>${totalAmount.toFixed(2)}</strong>
            </div>
            <div className="summary-row">
              <span>Shipping Estimate</span>
              <span style={{ color: '#0FB3B6', fontWeight: 700 }}>FREE Studio Shipping</span>
            </div>
            <div className="summary-row total">
              <span>Total Due</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="btn-primary"
              style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}
            >
              <Landmark style={{ width: 18, height: 18 }} /> Checkout via Bank Transfer
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
