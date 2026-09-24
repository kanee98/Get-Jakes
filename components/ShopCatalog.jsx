'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Star, Eye, Plus, Check, X } from 'lucide-react';

const DEFAULT_PRODUCTS = [
  {
    id: 'prop-01',
    name: 'Aurelia 4-Tier Luxury Wedding Cake Dummy',
    category: 'wedding',
    price: 389.00,
    originalPrice: 449.00,
    rating: 4.9,
    reviewsCount: 38,
    image: '/images/wedding_tier_prop.png',
    tag: 'Bestseller',
    description: 'Hand-finished 4-tier wedding dummy cake with durable faux fondant coating, pearl trim, and sugar rose replicas.',
    specs: { height: '28 inches', tiers: '4 Tiers (6", 8", 10", 12")', material: 'High-Density EPS Foam + Polymer Coating' }
  },
  {
    id: 'prop-02',
    name: 'Ophelia Cyan & Gold Leaf Statement Prop',
    category: 'wedding',
    price: 279.00,
    originalPrice: null,
    rating: 5.0,
    reviewsCount: 24,
    image: '/images/hero_cake_prop.png',
    tag: 'Handcrafted',
    description: 'Minimalist 3-tier organic textured white cake with authentic metallic leaf gilding and Get Jakes signature finish.',
    specs: { height: '22 inches', tiers: '3 Tiers (6", 8", 10")', material: 'Ultra-Hard Resin Compound Core' }
  },
  {
    id: 'prop-03',
    name: 'Pastel Studio Food Photography Kit',
    category: 'photography',
    price: 145.00,
    originalPrice: 175.00,
    rating: 4.8,
    reviewsCount: 52,
    image: '/images/photo_prop_set.png',
    tag: 'Studio Special',
    description: 'Set of 6 realistic faux cake slices, geometric acrylic blocks, and pastel dummy mini cakes.',
    specs: { height: 'Modular Set', tiers: '6-Piece Modular Props', material: 'Matte Non-Reflective Foam & Polymer' }
  },
  {
    id: 'prop-04',
    name: 'Imperial Fluted Pedestal Display Set',
    category: 'pedestal',
    price: 215.00,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 19,
    image: '/images/pedestal_prop_set.png',
    tag: 'Trending',
    description: 'Pair of ribbed architectural cylinder pedestals in warm plaster white and cyan-brushed accents.',
    specs: { height: '12" and 18" Elevated Risers', tiers: '10" Top Surface', material: 'Reinforced Fiber Composite' }
  },
  {
    id: 'prop-05',
    name: 'Botanical Cascading Floral Dummy Cake',
    category: 'wedding',
    price: 320.00,
    originalPrice: null,
    rating: 4.7,
    reviewsCount: 15,
    image: '/images/wedding_tier_prop.png',
    tag: 'New',
    description: '3-tier romantic dummy cake pre-decorated with artificial cascading sugar eucalyptus and garden roses.',
    specs: { height: '24 inches', tiers: '3 Tiers', material: 'Polymer Coated Core + Silk Floral Trim' }
  },
  {
    id: 'prop-06',
    name: 'Commercial Bakery Window Display Dummy',
    category: 'custom',
    price: 495.00,
    originalPrice: 550.00,
    rating: 5.0,
    reviewsCount: 29,
    image: '/images/hero_cake_prop.png',
    tag: 'Commercial Grade',
    description: '5-Tier grand display dummy designed specifically for bakery shop windows with UV protective coating.',
    specs: { height: '36 inches', tiers: '5 Tiers (6", 8", 10", 12", 14")', material: 'UV-Shield Polymer Compound' }
  }
];

export default function ShopCatalog() {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
          }
        }
      } catch (err) {
        console.error('Failed to load products from database, using fallback:', err);
      }
    }
    loadProducts();
  }, []);

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <>
      <section id="shop" className="section shop-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular products</h2>
            <p className="section-subtitle">
              Explore our curated selection of multi-tier faux wedding cakes, food photo sets, and studio pedestals.
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
      </section>

      {/* Category Visual Banners Grid (printsoncakes.com.au style) */}
      <section className="section category-banners-section" style={{ background: '#FFFFFF', paddingTop: 40, paddingBottom: 80 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div className="category-banner-card" style={{ background: '#F8FAFC', borderRadius: 'var(--radius-md)', padding: 32, border: '1px solid rgba(10,13,18,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0A0D12', marginBottom: 8, fontFamily: 'var(--font-heading)' }}>
                  Custom Cake Props
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: 20 }}>
                  Bespoke polymer prop design & multi-tier dummy configurations.
                </p>
              </div>
              <a href="#customQuote" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0FB3B6', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Configure Custom Prop →
              </a>
            </div>

            <div className="category-banner-card" style={{ background: '#F8FAFC', borderRadius: 'var(--radius-md)', padding: 32, border: '1px solid rgba(10,13,18,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0A0D12', marginBottom: 8, fontFamily: 'var(--font-heading)' }}>
                  Dummy Cake Tiers
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: 20 }}>
                  Pre-coated smooth & textured 1 to 5 tier display dummies.
                </p>
              </div>
              <a href="#shop" onClick={() => setActiveCategory('wedding')} style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0FB3B6', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                View Tier Catalog →
              </a>
            </div>

            <div className="category-banner-card" style={{ background: '#F8FAFC', borderRadius: 'var(--radius-md)', padding: 32, border: '1px solid rgba(10,13,18,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0A0D12', marginBottom: 8, fontFamily: 'var(--font-heading)' }}>
                  Food Studio Kits
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: 20 }}>
                  Realistic faux cake slices & photo backdrop risers.
                </p>
              </div>
              <a href="#shop" onClick={() => setActiveCategory('photography')} style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0FB3B6', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Explore Studio Kits →
              </a>
            </div>

            <div className="category-banner-card" style={{ background: '#F8FAFC', borderRadius: 'var(--radius-md)', padding: 32, border: '1px solid rgba(10,13,18,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0A0D12', marginBottom: 8, fontFamily: 'var(--font-heading)' }}>
                  Display Pedestals
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: 20 }}>
                  Architectural ribbed cylinders & plaster riser sets.
                </p>
              </div>
              <a href="#shop" onClick={() => setActiveCategory('pedestal')} style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0FB3B6', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                View Risers & Pedestals →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* "Get inspired from our customers" Reviews Section (printsoncakes.com.au style) */}
      <section className="section reviews-section" style={{ background: '#F8FAFC', padding: '80px 0' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 className="section-title">Get inspired from our customers</h2>
            <p className="section-subtitle">
              Read real reviews from master event planners, food stylists, and luxury bakeries using Get Jakes props.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 'var(--radius-md)', border: '1px solid rgba(10,13,18,0.08)', boxShadow: '0 4px 14px rgba(10,13,18,0.03)' }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} style={{ width: 16, height: 16, fill: '#0FB3B6', color: '#0FB3B6' }} />
                ))}
              </div>
              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, marginBottom: 14 }}>
                "The 4-tier Aurelia prop survived 3 outdoor summer wedding expos without a single mark. The polymer coating is unbelievably durable."
              </p>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0A0D12' }}>Renee C.</div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Luxury Event Stylist, Sydney</div>
            </div>

            <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 'var(--radius-md)', border: '1px solid rgba(10,13,18,0.08)', boxShadow: '0 4px 14px rgba(10,13,18,0.03)' }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} style={{ width: 16, height: 16, fill: '#0FB3B6', color: '#0FB3B6' }} />
                ))}
              </div>
              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, marginBottom: 14 }}>
                "Get Jakes studio photo kits elevated our commercial bakery portfolio photos. Zero reflection glare and perfectly clean texture."
              </p>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0A0D12' }}>Marcus T.</div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Commercial Food Photographer</div>
            </div>

            <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 'var(--radius-md)', border: '1px solid rgba(10,13,18,0.08)', boxShadow: '0 4px 14px rgba(10,13,18,0.03)' }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} style={{ width: 16, height: 16, fill: '#0FB3B6', color: '#0FB3B6' }} />
                ))}
              </div>
              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, marginBottom: 14 }}>
                "Fast crate shipping and the custom quote preview gave us total confidence for our grand ballroom hotel installation."
              </p>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0A0D12' }}>Sarah & David</div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Grand Ballroom Planners</div>
            </div>
          </div>
        </div>
      </section>

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
    </>
  );
}




