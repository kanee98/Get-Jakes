'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="hero-section">
      <div className="container hero-container">
        <div className="hero-content">
          <div className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Sparkles style={{ width: 14, height: 14 }} /> Artisanal Studio Craftsmanship
          </div>

          <h1 className="hero-title">
            Architectural Cake Props <br />
            <span>& High-Density Toppers</span>
          </h1>

          <p className="hero-subtitle">
            Engineered for luxury wedding venues, food photography lighting, and commercial bakery window displays. Lightweight, durable, and indistinguishable from real fondant.
          </p>

          <div className="hero-cta-group">
            <Link href="#shop" className="btn-primary">
              Explore Prop Catalog <ArrowRight style={{ width: 18, height: 18 }} />
            </Link>
            <Link href="#customQuote" className="btn-secondary">
              Bespoke Quote Calculator
            </Link>
          </div>

          <div className="hero-features">
            <div className="feature-item">
              <ShieldCheck style={{ width: 18, height: 18, color: 'var(--color-brand)' }} />
              <span>100% UV Protected Polymer Coating</span>
            </div>
            <div className="feature-item">
              <Truck style={{ width: 18, height: 18, color: 'var(--color-brand)' }} />
              <span>Studio Shipping & Safe Transport</span>
            </div>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <div className="hero-image-card">
            <img src="/images/hero_cake_prop.png" alt="Ophelia Gold Leaf Cake Prop" className="hero-img" />
            <div className="hero-badge-overlay">
              <span className="badge-tag">Signature Prop</span>
              <strong>Ophelia Cyan & Gold Leaf</strong>
              <div className="hero-price-tag">$279.00</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
