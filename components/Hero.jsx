'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Eye, Layers } from 'lucide-react';

export default function Hero() {
  return (
    <>
      {/* Full-Width E-Commerce Banner Hero */}
      <section id="hero" className="hero-banner-section">
        <div className="hero-banner-bg" style={{ backgroundImage: "url('/images/hero_cake_prop.png')" }}>
          <div className="hero-banner-overlay"></div>
        </div>

        <div className="container hero-banner-content">
          <h1 className="hero-banner-title">
            Premier supplier of architectural <br />
            cake props in the market
          </h1>
          <p className="hero-banner-subtitle">
            Handcrafted 100% water-resistant & food-grade polymer props engineered for grand venue displays, food photography, and luxury bakeries.
          </p>
          <div className="hero-banner-actions">
            <Link href="#shop" className="btn-primary" style={{ background: '#36DFE2', color: '#0A0D12' }}>
              Explore Prop Catalog <ArrowRight style={{ width: 18, height: 18 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* "Your trusted cake prop crafting service" Intro Block */}
      <section className="trusted-service-section">
        <div className="container" style={{ textAlign: 'center', maxWidth: 840 }}>
          <h2 className="trusted-service-title">
            Your trusted cake prop crafting service
          </h2>
          <p className="trusted-service-desc">
            At Get Jakes, we design and produce museum-grade faux wedding cake dummies, studio photography props, and custom cake toppers. Each piece is hand-finished with food-grade polymer coatings to withstand event transport, outdoor venue lighting, and multi-day commercial displays.
          </p>
          <Link href="#customQuote" className="btn-primary" style={{ marginTop: 24, display: 'inline-flex' }}>
            Request Custom Quote
          </Link>
        </div>
      </section>

      {/* 3-Column Trust Features Block */}
      <section className="trust-features-section">
        <div className="container">
          <div className="hero-trust-grid">
            <div className="trust-card">
              <div className="trust-icon-box">
                <ShieldCheck style={{ width: 26, height: 26, color: '#0FB3B6' }} />
              </div>
              <div>
                <h4 className="trust-title">Water & UV Protected</h4>
                <p className="trust-desc">100% water-resistant polymer coating. Safe for food displays and outdoor venue lighting.</p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon-box">
                <Truck style={{ width: 26, height: 26, color: '#0FB3B6' }} />
              </div>
              <div>
                <h4 className="trust-title">Express Crate Postage</h4>
                <p className="trust-desc">Fast courier delivery with tracked wooden studio crates. Free express upgrades on orders $150+.</p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon-box">
                <Eye style={{ width: 26, height: 26, color: '#0FB3B6' }} />
              </div>
              <div>
                <h4 className="trust-title">Free Preview Service</h4>
                <p className="trust-desc">Get an instant digital preview of your custom cake prop design before printing & dispatch.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}




