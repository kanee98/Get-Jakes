'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { useCart } from '@/context/CartContext';
import { Star, Filter, ArrowUpDown, ChevronRight, ShoppingBag } from 'lucide-react';
import { sanitizeInput } from '@/utils/securitySanitizer';

const CATEGORY_DESCRIPTIONS = {
  all: 'Explore our complete catalog of high-definition custom edible icing sheets, multi-tier wedding dummy cakes, studio photography kits, and architectural Risers.',
  wedding: 'Hand-finished multi-tier dummy cakes with durable polymer fondant coating, pearl trims, and sugar replica detailing for grand ballroom exposures.',
  photography: 'Realistic non-reflective food studio kits, dummy mini cakes, and geometric acrylic blocks designed for food stylists & commercial exposure.',
  pedestal: 'Architectural ribbed cylinder pedestals and plaster risers engineered for heavy cake tier elevation and luxury display.',
  custom: 'Our high-quality custom edible icing sheets are vibrant and add glamour to your cakes, cookies, or cupcakes. Choose your preferred pre-cut shapes and sizes.'
};

const CATEGORY_NAMES = {
  all: 'All Prop Collections',
  wedding: 'Dummy Cake Tiers & Wedding Props',
  photography: 'Food Studio Photography Kits',
  pedestal: 'Imperial Display Pedestals',
  custom: 'Custom Edible Images & Bespoke Props'
};

export default function CollectionsPage({ searchParams }) {
  const selectedCat = searchParams?.category || 'all';
  const [activeCategory, setActiveCategory] = useState(selectedCat);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('bestselling');
  const [priceFilter, setPriceFilter] = useState('all');

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to fetch collection products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = products.filter((p) => {
    const catMatch = activeCategory === 'all' || p.category === activeCategory;
    let priceMatch = true;
    if (priceFilter === 'under200') priceMatch = p.price < 200;
    else if (priceFilter === '200to350') priceMatch = p.price >= 200 && p.price <= 350;
    else if (priceFilter === 'over350') priceMatch = p.price > 350;
    return catMatch && priceMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 4.9) - (a.rating || 4.9);
    return (b.reviewsCount || 0) - (a.reviewsCount || 0); // bestselling default
  });

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Breadcrumbs */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem', color: '#64748B' }}>
          <Link href="/" style={{ color: '#0F172A', fontWeight: 600 }}>Home</Link>
          <ChevronRight style={{ width: 14, height: 14 }} />
          <span>Collections</span>
          <ChevronRight style={{ width: 14, height: 14 }} />
          <strong style={{ color: '#0FB3B6' }}>{CATEGORY_NAMES[activeCategory] || 'Prop Catalog'}</strong>
        </div>
      </div>

      {/* Collection Banner Header (Matching Image 3) */}
      <section style={{ background: '#FFFFFF', padding: '40px 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: 900, textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F172A', fontFamily: 'var(--font-heading)', marginBottom: 12 }}>
            {CATEGORY_NAMES[activeCategory] || 'Prop Catalog'}
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7, margin: '0 auto' }}>
            {CATEGORY_DESCRIPTIONS[activeCategory] || CATEGORY_DESCRIPTIONS.all}
          </p>
        </div>
      </section>

      <div className="container" style={{ marginTop: 32 }}>
        {/* Category Pills Bar */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 16, marginBottom: 24, borderBottom: '1px solid #E2E8F0' }}>
          {Object.keys(CATEGORY_NAMES).map((catKey) => (
            <button
              key={catKey}
              onClick={() => setActiveCategory(catKey)}
              style={{
                padding: '10px 20px',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: '0.86rem',
                border: activeCategory === catKey ? 'none' : '1px solid #CBD5E1',
                background: activeCategory === catKey ? '#0FB3B6' : '#FFFFFF',
                color: activeCategory === catKey ? '#FFFFFF' : '#334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: activeCategory === catKey ? '0 4px 14px rgba(15,179,182,0.3)' : 'none'
              }}
            >
              {CATEGORY_NAMES[catKey]}
            </button>
          ))}
        </div>

        {/* Filter & Sort Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 28, background: '#FFFFFF', padding: '16px 20px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Filter style={{ width: 16, height: 16, color: '#0FB3B6' }} /> Price Filter:
            </span>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '6px 14px', fontSize: '0.84rem' }}
            >
              <option value="all">All Prices</option>
              <option value="under200">Under $200</option>
              <option value="200to350">$200 to $350</option>
              <option value="over350">Over $350</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Showing <strong>{sortedProducts.length}</strong> products
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ArrowUpDown style={{ width: 14, height: 14, color: '#64748B' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{ width: 'auto', padding: '6px 14px', fontSize: '0.84rem' }}
              >
                <option value="bestselling">Best Selling</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid (Matching Image 3) */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, fontSize: '1rem', color: '#64748B' }}>Loading products...</div>
        ) : sortedProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: 8 }}>No products found in this category</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B' }}>Try resetting your price filter or selecting another collection.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {sortedProducts.map((p) => (
              <div
                key={p.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                  position: 'relative'
                }}
              >
                {/* Product Badge */}
                {p.tag && (
                  <span style={{ position: 'absolute', top: 12, left: 12, background: '#0F172A', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: 999, zIndex: 2 }}>
                    {p.tag}
                  </span>
                )}

                {/* Product Image Link */}
                <Link href={`/products/${p.id}`} style={{ display: 'block', height: 220, background: '#F8FAFC', position: 'relative', overflow: 'hidden' }}>
                  <SafeImage
                    src={p.image}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  />
                </Link>

                {/* Card Content */}
                <div style={{ padding: 20, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* Star Ratings */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} style={{ width: 14, height: 14, fill: '#F59E0B', color: '#F59E0B' }} />
                      ))}
                      <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginLeft: 4 }}>({p.reviewsCount || 38})</span>
                    </div>

                    <Link href={`/products/${p.id}`}>
                      <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0F172A', marginBottom: 8, lineHeight: 1.4 }}>
                        {p.name}
                      </h3>
                    </Link>
                  </div>

                  <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
                    <div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>
                        ${parseFloat(p.price).toFixed(2)}
                      </span>
                      {p.originalPrice && (
                        <span style={{ fontSize: '0.82rem', color: '#94A3B8', textDecoration: 'line-through', marginLeft: 6 }}>
                          ${parseFloat(p.originalPrice).toFixed(2)}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/products/${p.id}`}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.82rem', gap: 6 }}
                    >
                      View Options
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
