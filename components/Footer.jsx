'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const { setIsCheckoutOpen } = useCart();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Brand Info Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <img
              src="/logo.png"
              alt="Get Jakes Logo"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: '0 4px 12px rgba(54, 223, 226, 0.4)'
              }}
            />
            <div>
              <h3
                className="footer-brand-title"
                style={{
                  fontFamily: 'var(--font-brand) !important',
                  fontSize: '1.4rem',
                  color: '#FFFFFF',
                  margin: 0,
                  lineHeight: 1
                }}
              >
                GET JAKES
              </h3>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.18em', color: '#0FB3B6', fontWeight: 800 }}>
                CAKE PROPS & TOPPERS
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginBottom: '16px', maxWidth: '300px', lineHeight: 1.6 }}>
            Premium handcrafted dummy cakes, custom cake toppers, food photography props, and architectural event pedestals.
          </p>
        </div>

        {/* Shop Collection Column */}
        <div>
          <h4 className="footer-title">Shop Collection</h4>
          <ul className="footer-links">
            <li><Link href="/#shop">Wedding Tier Dummies</Link></li>
            <li><Link href="/#shop">Photo Studio Sets</Link></li>
            <li><Link href="/#shop">Display Risers</Link></li>
            <li><Link href="/#customQuote">Custom Toppers & Sizing</Link></li>
          </ul>
        </div>

        {/* Customer Service Column */}
        <div>
          <h4 className="footer-title">Customer Service</h4>
          <ul className="footer-links">
            <li><Link href="/my-orders">Track My Order</Link></li>
            <li><a href="#bankInfoFooter" onClick={(e) => { e.preventDefault(); setIsCheckoutOpen(true); }}>Bank Details Info</a></li>
            <li><Link href="/#hero">Care & Cleaning Guide</Link></li>
          </ul>
        </div>

        {/* Bank Payment Info Column */}
        <div>
          <h4 className="footer-title">Bank Payment Info</h4>
          <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.6 }}>
            Direct transfers supported via Artisanal Commerce Bank.<br />
            <strong style={{ color: '#36DFE2' }}>Order Ref ID generated at checkout.</strong>
          </p>
        </div>
      </div>

      {/* Footer Bottom with FusionLabz Credit */}
      <div className="container footer-bottom">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B' }}>
            © {new Date().getFullYear()} Get Jakes Props & Toppers. All rights reserved.
          </p>

          <p
            className="fusionlabz-credit"
            style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: '#CBD5E1' }}
          >
            Made with{' '}
            <Heart
              className="heart-icon"
              style={{
                width: 16,
                height: 16,
                color: '#EF4444',
                fill: '#EF4444',
                display: 'inline-block',
                verticalAlign: 'middle'
              }}
            />{' '}
            in Sri Lanka 🇱🇰 by{' '}
            <a
              href="https://fusionlabz.lk/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#36DFE2',
                fontWeight: 700,
                textDecoration: 'none',
                letterSpacing: '0.02em',
                transition: 'color 0.2s'
              }}
            >
              FusionLabz
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}


