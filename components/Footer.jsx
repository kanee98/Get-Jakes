'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <div className="footer-brand">
            <img src="/logo.png" alt="Get Jakes Logo" className="footer-logo" />
            <span className="footer-brand-title">GET JAKES</span>
          </div>
          <p className="footer-desc">
            Handcrafting high-density foam & polymer fondant dummy cakes, food photography studio props, and architectural pedestals for ballrooms, bakeries, and grand showcases worldwide.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Studio Navigation</h4>
          <ul className="footer-links">
            <li><Link href="/">Home Overview</Link></li>
            <li><Link href="/#shop">Prop Catalog</Link></li>
            <li><Link href="/#gallery">Studio Gallery</Link></li>
            <li><Link href="/#customQuote">Bespoke Quote Calculator</Link></li>
            <li><Link href="/my-orders">Customer Orders</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Prop Categories</h4>
          <ul className="footer-links">
            <li><Link href="/#shop">Wedding Tier Dummies</Link></li>
            <li><Link href="/#shop">Food Photography Kits</Link></li>
            <li><Link href="/#shop">Architectural Pedestals</Link></li>
            <li><Link href="/#shop">Commercial Bakery Windows</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Craft Studio Support</h4>
          <p className="footer-text">
            <strong>Studio Hours:</strong> Mon - Sat: 9:00 AM - 6:00 PM EST
          </p>
          <p className="footer-text">
            <strong>Direct Email:</strong> support@getjakes.com
          </p>
          <p className="footer-text">
            <strong>Hotline:</strong> +1 (800) GET-JAKES
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; {new Date().getFullYear()} Get Jakes Cake Props & Toppers LLC. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
