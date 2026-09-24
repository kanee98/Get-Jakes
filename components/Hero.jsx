'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Eye, Layers } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="hero-section">
      {/* Soft Logo Blue Ambient Orbs */}
      <div className="hero-ambient-glow glow-blue"></div>
      <div className="hero-ambient-glow glow-light-blue"></div>

      <div className="container hero-container">
        {/* Left Column: High-Impact Copy */}
        <div className="hero-content">
          <h1 className="hero-title">
            Transform Grand Venues With <br />
            <span className="hero-blue-text">Architectural Cake Props</span>
          </h1>

          <p className="hero-subtitle">
            Premier supplier of handcrafted dummy cakes, custom cake toppers, food photography props, and architectural event pedestals. Guaranteed 100% water-resistant & food-grade polymer coating.
          </p>

          <div className="hero-cta-group">
            <Link href="#shop" className="btn-primary">
              Explore Prop Catalog <ArrowRight style={{ width: 18, height: 18 }} />
            </Link>
            <Link href="#customQuote" className="btn-secondary">
              Bespoke Price Estimator
            </Link>
          </div>
        </div>

        {/* Right Column: Static Display Stage */}
        <div className="hero-image-wrapper">
          <div className="hero-image-card static-stage-card">
            <div className="hero-stage-img-container">
              <img
                src="/images/hero_cake_prop.png"
                alt="Ophelia Gold Leaf Cake Prop"
                className="hero-img"
              />
            </div>

            {/* Bottom Floating Card Info */}
            <div className="hero-badge-overlay float-layer">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0A0D12', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                    Ophelia Cyan & Gold Leaf
                  </h3>
                </div>
                <div className="hero-price-tag">$279.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Trust Feature Columns (printsoncakes.com.au style) */}
      <div className="container" style={{ marginTop: 54 }}>
        <div className="hero-trust-grid">
          <div className="trust-card">
            <div className="trust-icon-box">
              <ShieldCheck style={{ width: 22, height: 22, color: '#0FB3B6' }} />
            </div>
            <div>
              <h4 className="trust-title">Water & UV Protected</h4>
              <p className="trust-desc">100% water-resistant polymer coating. Safe for food displays and outdoor venue lighting.</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">
              <Truck style={{ width: 22, height: 22, color: '#0FB3B6' }} />
            </div>
            <div>
              <h4 className="trust-title">Express Crate Postage</h4>
              <p className="trust-desc">Fast courier delivery with tracked wooden studio crates. Free express upgrades on orders $150+.</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">
              <Eye style={{ width: 22, height: 22, color: '#0FB3B6' }} />
            </div>
            <div>
              <h4 className="trust-title">Free Preview Service</h4>
              <p className="trust-desc">Get an instant 3D digital preview of your custom cake prop design before printing & dispatch.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




