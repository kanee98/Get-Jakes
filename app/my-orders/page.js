'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, LogIn, ShoppingBag, Sparkles } from 'lucide-react';

export default function MyOrdersPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function loadUserOrders() {
      if (!user) {
        setFetching(false);
        return;
      }
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          const userEmailClean = user.email ? user.email.toLowerCase().trim() : '';
          const filtered = data.filter(
            (o) => o.customerEmail && o.customerEmail.toLowerCase().trim() === userEmailClean
          );
          setOrders(filtered);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setFetching(false);
      }
    }
    loadUserOrders();
  }, [user]);

  if (loading || fetching) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading your orders...</p>
      </div>
    );
  }

  // 1. Unauthenticated View
  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 20px', maxWidth: 640 }}>
        <div style={{ background: 'var(--bg-secondary)', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: 'var(--shadow-sm)', color: 'var(--color-brand-dark)' }}>
            <Lock style={{ width: 32, height: 32 }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--color-black)', marginBottom: 8 }}>
            Please Sign In to View Your Orders
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto 24px' }}>
            Sign in with your Get Jakes customer account to track active wire transfers, view order details, and check delivery status.
          </p>
          <Link href="/auth/signin" className="btn-primary" style={{ display: 'inline-flex', margin: '0 auto' }}>
            <LogIn style={{ width: 18, height: 18 }} /> Sign In / Create Account
          </Link>
        </div>
      </div>
    );
  }

  // 2. Authenticated Customer with 0 Orders: Animated Empty State
  if (orders.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', maxWidth: 680 }}>
        <div className="empty-orders-animated">
          <div className="empty-orders-icon">
            <ShoppingBag style={{ width: 32, height: 32 }} />
          </div>
          <h2 className="empty-orders-title">You Haven't Shopped With Us Yet!</h2>
          <p className="empty-orders-text">
            Discover our artisanal collection of handcrafted wedding dummy cakes, studio photography props, and architectural pedestals engineered for studio perfection.
          </p>
          <Link href="/#shop" className="btn-primary" style={{ display: 'inline-flex', margin: '0 auto', boxShadow: '0 10px 25px rgba(15, 179, 182, 0.3)' }}>
            <Sparkles style={{ width: 18, height: 18 }} /> Explore Prop Catalog
          </Link>
        </div>
      </div>
    );
  }

  // 3. Customer Orders List
  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: 840 }}>
      <div style={{ marginBottom: 32 }}>
        <span className="badge badge-brand">Customer Portal</span>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--color-black)', margin: '8px 0' }}>Your Get Jakes Orders</h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Logged in as <strong>{user.email}</strong>. View live status of bank transfer verifications and order line items.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {orders.map((o) => {
          const displayId = o.id || o.order_ref_code;
          const displayDate = o.date ? new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';
          const statusText = o.status || 'Pending';

          return (
            <div key={o.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: 14, marginBottom: 14 }}>
                <div>
                  <span className="ref-code" style={{ fontSize: '1.2rem', color: 'var(--color-black)' }}>{displayId}</span>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>Placed on {displayDate}</div>
                </div>
                <span className={`status-badge ${statusText.includes('Verified') ? 'badge-status-verified' : statusText.includes('Shipped') ? 'badge-status-shipped' : 'badge-status-pending'}`}>
                  {statusText}
                </span>
              </div>

              <div style={{ marginBottom: 16 }}>
                {(o.items || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', marginBottom: 8 }}>
                    <span>{item.name} × {item.qty}</span>
                    <strong>${(parseFloat(item.price || 0) * parseInt(item.qty || 1)).toFixed(2)}</strong>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: 12, fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Payable:</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--color-black)' }}>${parseFloat(o.total || 0).toFixed(2)}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
