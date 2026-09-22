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
          <span className="badge badge-brand">Prop & Topper Catalog</span>
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
                  <span className={`badge ${p.tag === 'Bestseller' ? 'badge-gold' : 'badge-brand'} product-tag`}>
                    {p.tag}
                  </span>
                  <img src={p.image} alt={p.name} loading="lazy" />
                  <button onClick={() => setQuickViewProduct(p)} className="quick-view-btn">
                    <Eye style={{ width: 14, height: 14, verticalAlign: 'middle', marginRight: 4 }} /> Quick View
                  </button>
                </div>
                <div className="product-info">
                  <div className="product-rating">
                    <Star style={{ width: 14, height: 14, fill: 'var(--color-brand)', color: 'var(--color-brand)' }} />
                    <span>{p.rating} ({p.reviewsCount} reviews)</span>
                  </div>
                  <h3 className="product-title">{p.name}</h3>
                  <p className="product-desc">{p.description}</p>
                  <div className="product-bottom">
                    <div>
                      <span className="product-price">${parseFloat(p.price).toFixed(2)}</span>
                      {p.originalPrice && (
                        <span className="product-price-orig">${parseFloat(p.originalPrice).toFixed(2)}</span>
                      )}
                    </div>
                    <button onClick={() => addToCart(p)} className="add-cart-btn" title="Add to Prop Basket">
                      <Plus style={{ width: 18, height: 18 }} />
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
          <div className="modal-content" style={{ padding: 32, maxWidth: 720 }}>
            <button onClick={() => setQuickViewProduct(null)} className="modal-close-btn">
              <X style={{ width: 20, height: 20 }} />
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}>
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                style={{ width: '100%', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
              />
              <div>
                <span className="badge badge-brand" style={{ marginBottom: 8 }}>{quickViewProduct.tag}</span>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--color-black)', margin: '8px 0' }}>
                  {quickViewProduct.name}
                </h3>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-black)', marginBottom: 12 }}>
                  ${parseFloat(quickViewProduct.price).toFixed(2)}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                  {quickViewProduct.description}
                </p>

                {quickViewProduct.specs && (
                  <div style={{ background: 'var(--bg-secondary)', padding: 12, borderRadius: 'var(--radius-sm)', marginBottom: 20, fontSize: '0.85rem' }}>
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
                  <Plus style={{ width: 18, height: 18 }} /> Add to Prop Basket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
