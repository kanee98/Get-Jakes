'use client';

import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useModal } from '@/context/ModalContext';
import { Star, Eye, Plus, Check, X, ChevronRight } from 'lucide-react';

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

const DEFAULT_CATEGORY_BANNERS = [
  {
    id: 1,
    title: 'Custom Cake Props',
    subtitle: 'Bespoke polymer prop design & multi-tier dummy configurations.',
    image_url: '/images/hero_cake_prop.png',
    link_url: '#customQuote'
  },
  {
    id: 2,
    title: 'Dummy Cake Tiers',
    subtitle: 'Pre-coated smooth & textured 1 to 5 tier display dummies.',
    image_url: '/images/wedding_tier_prop.png',
    link_url: '#shop'
  },
  {
    id: 3,
    title: 'Food Studio Kits',
    subtitle: 'Realistic faux cake slices & photo backdrop risers.',
    image_url: '/images/photo_prop_set.png',
    link_url: '#shop'
  },
  {
    id: 4,
    title: 'Display Pedestals',
    subtitle: 'Architectural ribbed cylinders & plaster riser sets.',
    image_url: '/images/pedestal_prop_set.png',
    link_url: '#shop'
  }
];

const DEFAULT_REVIEWS = [
  {
    id: 1,
    reviewer_name: 'Bonnie D.',
    reviewer_role: 'Verified Customer',
    rating: 5,
    comment: 'Great quality and loved they were pre cut! Saved sooo much time!',
    image_url: '/images/photo_prop_set.png'
  },
  {
    id: 2,
    reviewer_name: 'Jade G.',
    reviewer_role: 'Verified Customer',
    rating: 5,
    comment: 'Loved this product! Colours were great and picture was very clear. Customer support was great...',
    image_url: '/images/hero_cake_prop.png'
  },
  {
    id: 3,
    reviewer_name: 'Megan R.',
    reviewer_role: 'Verified Customer',
    rating: 5,
    comment: 'Absolutely fabulous ! Turn around and communication with the team was exceptional. As a novice...',
    image_url: '/images/wedding_tier_prop.png'
  },
  {
    id: 4,
    reviewer_name: 'Peter R.',
    reviewer_role: 'Verified Customer',
    rating: 5,
    comment: 'Very happy. The image was crisp and the colours strong. Great to have the option of picking up in...',
    image_url: '/images/pedestal_prop_set.png'
  }
];

export default function ShopCatalog() {
  const { showAlert } = useModal();
  const reviewsContainerRef = useRef(null);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [banners, setBanners] = useState(DEFAULT_CATEGORY_BANNERS);
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // Customer Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRole, setNewReviewRole] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    async function loadData() {
      try {
        const [resProd, resBanners, resRev] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/category-banners'),
          fetch('/api/reviews')
        ]);

        if (resProd.ok) {
          const dProd = await resProd.json();
          if (Array.isArray(dProd) && dProd.length > 0) setProducts(dProd);
        }

        if (resBanners.ok) {
          const dBanners = await resBanners.json();
          if (Array.isArray(dBanners) && dBanners.length > 0) setBanners(dBanners);
        }

        if (resRev.ok) {
          const dRev = await resRev.json();
          if (Array.isArray(dRev) && dRev.length > 0) setReviews(dRev);
        }
      } catch (err) {
        console.error('Data load error:', err);
      }
    }
    loadData();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewerName: newReviewName,
          reviewerRole: newReviewRole || 'Verified Customer',
          rating: parseInt(newReviewRating, 10),
          comment: newReviewComment
        })
      });

      if (res.ok) {
        await showAlert('Review Submitted', 'Thank you! Your review has been submitted for studio admin verification.', 'success');
        setIsReviewModalOpen(false);
        setNewReviewName('');
        setNewReviewRole('');
        setNewReviewComment('');
      } else {
        await showAlert('Submission Failed', 'Failed to submit review. Please try again.', 'warning');
      }
    } catch (err) {
      await showAlert('Submission Error', 'Error submitting review. Please try again.', 'warning');
    } finally {
      setSubmittingReview(false);
    }
  };

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

      {/* Category Visual Banners Grid with High-Res Images */}
      <section className="section category-banners-section" style={{ background: '#FFFFFF', paddingTop: 40, paddingBottom: 80 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {banners.map((b) => (
              <div
                key={b.id}
                className="category-banner-card"
                style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid rgba(10,13,18,0.08)',
                  boxShadow: '0 6px 20px rgba(10,13,18,0.04)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ height: 180, overflow: 'hidden', background: '#F8FAFC' }}>
                  <img
                    src={b.image_url}
                    alt={b.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0A0D12', marginBottom: 8, fontFamily: 'var(--font-heading)' }}>
                      {b.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: 20, lineHeight: 1.5 }}>
                      {b.subtitle}
                    </p>
                  </div>
                  <a
                    href={b.link_url || '#shop'}
                    style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0FB3B6', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    View Collection →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* "Get inspired from our customers" Reviews Section with Image 1 styling */}
      <section className="section reviews-section" style={{ background: '#FFFFFF', padding: '80px 0 60px', position: 'relative' }}>
        <div className="container" style={{ maxWidth: 1140 }}>
          {/* Centered Title, Subtitle, & Red Pill Button */}
          <div className="section-header" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 28px' }}>
            <h2 className="section-title" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>
              Get inspired from our customers
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6, margin: '0 auto 24px', maxWidth: 680 }}>
              Uncover how customers creatively enhance products with our edible images, driving our success and inspiration. Prints On Cakes has amassed over 2,000 5-star reviews for our images, with more on the horizon!
            </p>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              style={{
                background: '#E52E4D',
                color: '#FFFFFF',
                padding: '12px 32px',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: '0.92rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(229, 46, 77, 0.35)',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#D02340'}
              onMouseOut={(e) => e.currentTarget.style.background = '#E52E4D'}
            >
              Write a Customer Review
            </button>
          </div>

          {/* Review Cards Carousel Slider */}
          <div style={{ position: 'relative', marginTop: 36, marginBottom: 36 }}>
            <div
              ref={reviewsContainerRef}
              style={{
                display: 'flex',
                gap: 20,
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                padding: '10px 4px 20px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {reviews.map((r, idx) => {
                const sampleImages = [
                  '/images/photo_prop_set.png',
                  '/images/hero_cake_prop.png',
                  '/images/wedding_tier_prop.png',
                  '/images/pedestal_prop_set.png'
                ];
                const imgSrc = r.image_url || sampleImages[idx % sampleImages.length];

                return (
                  <div
                    key={r.id || idx}
                    style={{
                      flex: '0 0 255px',
                      width: 255,
                      background: '#FFFFFF',
                      borderRadius: 14,
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative'
                    }}
                  >
                    {/* Card Top Image */}
                    <div style={{ width: '100%', height: 165, position: 'relative', background: '#F8FAFC' }}>
                      <img
                        src={imgSrc}
                        alt={r.reviewer_name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Floating Star Rating Badge */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        background: '#FFFFFF',
                        padding: '5px 14px',
                        borderRadius: 999,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                        width: 'fit-content',
                        margin: '-16px auto 12px',
                        zIndex: 2,
                        border: '1px solid #F1F5F9'
                      }}
                    >
                      {[...Array(r.rating || 5)].map((_, i) => (
                        <Star key={i} style={{ width: 14, height: 14, fill: '#F59E0B', color: '#F59E0B' }} />
                      ))}
                    </div>

                    {/* Card Text & Author Details */}
                    <div style={{ padding: '0 16px 20px', textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 8 }}>
                          {r.reviewer_name}
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 14, height: 14, background: '#0F172A', borderRadius: '50%', color: '#FFF', fontSize: '0.58rem', fontWeight: 900 }}>
                            ✓
                          </span>
                        </div>
                        <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {r.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Carousel Right Arrow Button */}
            <button
              onClick={() => {
                if (reviewsContainerRef.current) {
                  reviewsContainerRef.current.scrollBy({ left: 275, behavior: 'smooth' });
                }
              }}
              aria-label="Next reviews"
              style={{
                position: 'absolute',
                right: -14,
                top: '45%',
                transform: 'translateY(-50%)',
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 6px 20px rgba(0,0,0,0.14)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0F172A',
                zIndex: 10,
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronRight style={{ width: 22, height: 22 }} />
            </button>
          </div>

          {/* Rating Summary Card (Bottom-Left) */}
          <div
            style={{
              display: 'inline-block',
              background: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: 8,
              border: '1px solid #CBD5E1',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} style={{ width: 14, height: 14, fill: '#F59E0B', color: '#F59E0B' }} />
                ))}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>4.9/5</span>
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
              6,092 reviews
            </div>
          </div>
        </div>
      </section>

      {/* Customer Review Submit Modal */}
      {isReviewModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content" style={{ padding: 32, maxWidth: 560, background: '#FFFFFF', color: '#0A0D12', borderRadius: 'var(--radius-md)' }}>
            <button onClick={() => setIsReviewModalOpen(false)} className="modal-close-btn" style={{ color: '#0A0D12' }}>
              <X style={{ width: 20, height: 20 }} />
            </button>
            <h3 style={{ fontSize: '1.4rem', color: '#0A0D12', marginBottom: 6, fontFamily: 'var(--font-heading)' }}>
              Write a Customer Review
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 20 }}>
              Share your experience with Get Jakes props. Submitted reviews will be verified by our studio team.
            </p>

            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label className="form-label">Your Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  required
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="form-label">Role / Bakery Studio Name (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={newReviewRole}
                  onChange={(e) => setNewReviewRole(e.target.value)}
                  placeholder="e.g. Wedding Planner / Chateau Bakery"
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="form-label">Star Rating</label>
                <select
                  className="form-select"
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(e.target.value)}
                >
                  <option value="5">5 Stars ★★★★★ (Exceptional Quality)</option>
                  <option value="4">4 Stars ★★★★☆ (Great Product)</option>
                  <option value="3">3 Stars ★★★☆☆ (Average)</option>
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Your Review *</label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Tell us about the prop quality, durability, delivery, or event display..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review For Verification'}
              </button>
            </form>
          </div>
        </div>
      )}

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
