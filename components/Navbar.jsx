'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { User, ShoppingBag, ShieldCheck, LogOut, Menu, X, Search, Sparkles, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [announcement, setAnnouncement] = useState('Free Express Crate Shipping on orders over $150!');

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const res = await fetch('/api/announcements');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setAnnouncement(data[0].message);
          }
        }
      } catch (err) {
        console.error('Failed to fetch announcement:', err);
      }
    }
    loadAnnouncements();
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const shopSection = document.getElementById('shop');
      if (shopSection) {
        shopSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push('/#shop');
      }
    }
  };

  return (
    <>
      {/* Announcement Bar (printsoncakes.com.au style) */}
      <div className="announcement-bar">
        <div className="container announcement-content">
          <span><Truck style={{ width: 14, height: 14, verticalAlign: 'middle', marginRight: 6 }} /> {announcement}</span>
        </div>
      </div>

      <header className="header">
        <div className="container nav-wrapper">
          {/* Brand Logo */}
          <Link href="/" className="brand-logo" title="Get Jakes Home" onClick={() => setMobileMenuOpen(false)}>
            <img src="/logo.png" alt="Get Jakes Logo" className="brand-logo-img" />
            <div className="brand-title">
              GET JAKES
              <span>CAKE PROPS & TOPPERS</span>
            </div>
          </Link>

          {/* E-Commerce Search Bar */}
          <form onSubmit={handleSearchSubmit} className="header-search-form">
            <Search className="search-icon" style={{ width: 16, height: 16 }} />
            <input
              type="text"
              placeholder="Search cake dummies, risers, custom toppers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>

          {/* Desktop Navigation Links */}
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
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                  title="Account Menu"
                >
                  {user.role === 'admin' ? (
                    <ShieldCheck style={{ width: 16, height: 16, color: 'var(--color-brand)' }} />
                  ) : (
                    <User style={{ width: 16, height: 16 }} />
                  )}
                  <span className="user-name-text" style={{ marginLeft: 6, fontWeight: 700 }}>
                    {user.fullName ? user.fullName.split(' ')[0] : 'Account'}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: '#FFFFFF',
                      border: '1px solid rgba(15, 23, 42, 0.1)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12)',
                      padding: '8px',
                      minWidth: '200px',
                      zIndex: 1500
                    }}
                  >
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(15,23,42,0.08)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
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
                        color: '#0A0D12'
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
                        borderTop: '1px solid rgba(15,23,42,0.08)'
                      }}
                    >
                      <LogOut style={{ width: 16, height: 16 }} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/signin" className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                <User style={{ width: 16, height: 16 }} />
                <span className="user-name-text" style={{ marginLeft: 6 }}>Sign In</span>
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
    </>
  );
}

