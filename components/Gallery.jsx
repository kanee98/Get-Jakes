'use client';

import { useState, useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

const DEFAULT_ITEMS = [
  { id: 1, title: "Aurelia 4-Tier Ballroom Display", category: "Wedding Showcase", image_url: "/images/wedding_tier_prop.png" },
  { id: 2, title: "Ophelia Cyan & Gold Leaf Statement", category: "Studio Portfolio", image_url: "/images/hero_cake_prop.png" },
  { id: 3, title: "Pastel Photography Prop Set", category: "Food Studio Kit", image_url: "/images/photo_prop_set.png" },
  { id: 4, title: "Imperial Ribbed Cylinder Risers", category: "Display Pedestal", image_url: "/images/pedestal_prop_set.png" }
];

export default function Gallery() {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setItems(data);
          }
        }
      } catch (err) {
        console.error('Failed to load gallery items:', err);
      }
    }
    loadGallery();
  }, []);

  return (
    <section id="gallery" className="section gallery-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Get Jakes In Action</h2>
          <p className="section-subtitle">
            Click any installation photo to expand in high-res studio detail.
          </p>
        </div>

        <div className="gallery-grid">
          {items.map((item) => (
            <div
              key={item.id}
              className="gallery-card"
              onClick={() => setActiveItem(item)}
              style={{ cursor: 'pointer' }}
            >
              <img src={item.image_url} alt={item.title} className="gallery-img" />
              <div className="gallery-overlay">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="gallery-cat">{item.category}</span>
                  <ZoomIn style={{ width: 18, height: 18, color: '#36DFE2' }} />
                </div>
                <h4 className="gallery-title">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Lightbox Modal Popup */}
      {activeItem && (
        <div className="modal-overlay open" onClick={() => setActiveItem(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 820,
              padding: 24,
              background: '#0A0D12',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(54,223,226,0.3)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
            }}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="modal-close-btn"
              style={{ color: '#FFFFFF', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#36DFE2', fontWeight: 800 }}>
                {activeItem.category}
              </span>
              <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', margin: '4px 0 0', fontFamily: 'var(--font-heading)' }}>
                {activeItem.title}
              </h3>
            </div>

            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', maxHeight: '560px', background: '#000000' }}>
              <img
                src={activeItem.image_url}
                alt={activeItem.title}
                style={{ width: '100%', height: '100%', maxHeight: '560px', objectFit: 'contain', display: 'block' }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
