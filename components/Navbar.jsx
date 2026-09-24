'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { User, ShoppingBag, ShieldCheck, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <header className="header">
      <div className="container nav-wrapper">
        <Link href="/" className="brand-logo" title="Get Jakes Home" onClick={() => setMobileMenuOpen(false)}>
          <img src="/logo.png" alt="Get Jakes Logo" className="brand-logo-img" />
          <div className="brand-title">
            GET JAKES
            <span>CAKE PROPS & TOPPERS</span>
          </div>
        </Link>

        {/* Desktop Links & Mobile Dropdown */}
        <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li><Link href="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
          <li><Link href="/#shop" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Prop Catalog</Link></li>
          <li><Link href="/#gallery" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Gallery</Link></li>
          <li><Link href="/#customQuote" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Custom Props</Link></li>
          <li><Link href="/my-orders" className="nav-link" onClick={() => setMobileMenuOpen(false)}>My Orders</Link></li>
        </ul>

        <div className="header-actions" style={{ position: 'relative' }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="btn-secondary"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                title="Account Menu"
              >
                {user.role === 'admin' ? (
                  <ShieldCheck style={{ width: 16, height: 16, color: 'var(--color-brand)' }} />
                ) : (
                  <User style={{ width: 16, height: 16 }} />
                )}
                <span className="user-name-text" style={{ marginLeft: 4, fontWeight: 700 }}>
                  {user.fullName ? user.fullName.split(' ')[0] : 'Account'}
                </span>
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '8px',
                    minWidth: '200px',
                    zIndex: 1500
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Signed in as <strong>{user.email}</strong>
                  </div>

                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: 'var(--color-brand)'
                      }}
                    >
                      <ShieldCheck style={{ width: 16, height: 16 }} /> Admin Dashboard
                    </Link>
                  )}

                  <Link
                    href="/my-orders"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      fontSize: '0.88rem',
                      color: 'var(--color-black)'
                    }}
                  >
                    <User style={{ width: 16, height: 16 }} /> My Orders
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      padding: '10px 12px',
                      fontSize: '0.88rem',
                      color: '#DC2626',
                      cursor: 'pointer',
                      borderTop: '1px solid var(--border-color)'
                    }}
                  >
                    <LogOut style={{ width: 16, height: 16 }} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/signin" className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
              <User style={{ width: 16, height: 16 }} />
              <span className="user-name-text" style={{ marginLeft: 4 }}>Sign In</span>
            </Link>
          )}

          <button
            onClick={() => setIsCartOpen(true)}
            className="icon-btn"
            title="Shopping Basket"
            style={{ position: 'relative' }}
          >
            <ShoppingBag style={{ width: 20, height: 20 }} />
            <span className="cart-count">{cartCount}</span>
          </button>

          {/* Hamburger Mobile Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-nav-toggle icon-btn"
            title="Toggle Navigation Menu"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
          </button>
        </div>
      </div>
    </header>
  );
}
