'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer class="footer">
      <div class="container footer-grid">
        <div class="footer-col">
          <div class="footer-brand">
            <img src="/logo.png" alt="Get Jakes Logo" class="footer-logo" />
            <span class="footer-brand-title">GET JAKES</span>
          </div>
          <p class="footer-desc">
            Handcrafting high-density foam & polymer fondant dummy cakes, food photography studio props, and architectural pedestals for ballrooms, bakeries, and grand showcases worldwide.
          </p>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Studio Navigation</h4>
          <ul class="footer-links">
            <li><Link href="/">Home Overview</Link></li>
            <li><Link href="/#shop">Prop Catalog</Link></li>
            <li><Link href="/#gallery">Studio Gallery</Link></li>
            <li><Link href="/#customQuote">Bespoke Quote Calculator</Link></li>
            <li><Link href="/my-orders">Customer Orders</Link></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Prop Categories</h4>
          <ul class="footer-links">
            <li><Link href="/#shop">Wedding Tier Dummies</Link></li>
            <li><Link href="/#shop">Food Photography Kits</Link></li>
            <li><Link href="/#shop">Architectural Pedestals</Link></li>
            <li><Link href="/#shop">Commercial Bakery Windows</Link></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Craft Studio Support</h4>
          <p class="footer-text">
            <strong>Studio Hours:</strong> Mon - Sat: 9:00 AM - 6:00 PM EST
          </p>
          <p class="footer-text">
            <strong>Direct Email:</strong> support@getjakes.com
          </p>
          <p class="footer-text">
            <strong>Hotline:</strong> +1 (800) GET-JAKES
          </p>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container footer-bottom-inner">
          <p>&copy; {new Date().getFullYear()} Get Jakes Cake Props & Toppers LLC. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
