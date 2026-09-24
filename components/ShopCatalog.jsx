'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Star, Eye, Plus, Check, X } from 'lucide-react';

export default function ShopCatalog() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="shop" className="section shop-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Artisanal Cake Dummies & Risers</h2>
          <p className="section-subtitle">
            Explore our curated catalog of multi-tier faux wedding cakes, food photo sets, and studio pedestals.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          <button
            className={`tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Props
          </button>
          <button
            className={`tab-btn ${activeCategory === 'wedding' ? 'active' : ''}`}
            onClick={() => setActiveCategory('wedding')}
          >
            Wedding Tier Dummies
          </button>
          <button
            className={`tab-btn ${activeCategory === 'photography' ? 'active' : ''}`}
            onClick={() => setActiveCategory('photography')}
          >
            Studio Photo Kits
          </button>
          <button
            className={`tab-btn ${activeCategory === 'pedestal' ? 'active' : ''}`}
            onClick={() => setActiveCategory('pedestal')}
          >
            Display Pedestals
          </button>
          <button
            className={`tab-btn ${activeCategory === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveCategory('custom')}
          >
            Custom & Commercial
          </button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Loading Prop Catalog...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            No props found in this category.
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((p) => (
              <div key={p.id} className="product-card">
                <div className="product-image-container">
                  <img src={p.image} alt={p.name} loading="lazy" />
                  <button onClick={() => setQuickViewProduct(p)} className="quick-view-overlay-btn">
                    <Eye style={{ width: 14, height: 14 }} /> Quick View
                  </button>
                </div>
                <div className="product-info">
                  <div className="product-rating">
                    <Star style={{ width: 14, height: 14, fill: '#0FB3B6', color: '#0FB3B6' }} />
                    <span>{p.rating} ({p.reviewsCount} reviews)</span>
                  </div>
                  <h3 className="product-title">{p.name}</h3>
                  <p className="product-desc">{p.description}</p>
                  
                  <div className="product-price-row">
                    <div>
                      <span className="product-price">${parseFloat(p.price).toFixed(2)}</span>
                      {p.originalPrice && (
                        <span className="product-price-orig">${parseFloat(p.originalPrice).toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  <div className="product-card-actions">
                    <button
                      onClick={() => addToCart(p)}
                      className="add-basket-btn"
                    >
                      Add to Basket
                    </button>
                    <button
                      onClick={() => setQuickViewProduct(p)}
                      className="card-quickview-icon-btn"
                      title="Quick View Specs"
                    >
                      <Eye style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="modal-overlay open">
          <div className="modal-content" style={{ padding: 32, maxWidth: 720, background: '#FFFFFF', color: '#0A0D12', border: '1px solid rgba(10,13,18,0.1)', boxShadow: '0 20px 50px rgba(10,13,18,0.15)' }}>
            <button onClick={() => setQuickViewProduct(null)} className="modal-close-btn" style={{ color: '#0A0D12' }}>
              <X style={{ width: 20, height: 20 }} />
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}>
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                style={{ width: '100%', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#0A0D12', margin: '0 0 8px 0', fontFamily: 'var(--font-heading)' }}>
                  {quickViewProduct.name}
                </h3>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0FB3B6', marginBottom: 12 }}>
                  ${parseFloat(quickViewProduct.price).toFixed(2)}
                </div>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: 16 }}>
                  {quickViewProduct.description}
                </p>

                {quickViewProduct.specs && (
                  <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 'var(--radius-sm)', marginBottom: 20, fontSize: '0.85rem', color: '#334155', border: '1px solid rgba(10,13,18,0.06)' }}>
                    <div><strong>Height:</strong> {quickViewProduct.specs.height}</div>
                    <div><strong>Tiers:</strong> {quickViewProduct.specs.tiers}</div>
                    <div><strong>Material:</strong> {quickViewProduct.specs.material}</div>
                  </div>
                )}

                <button
                  onClick={() => {
                    addToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Add to Prop Basket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}




