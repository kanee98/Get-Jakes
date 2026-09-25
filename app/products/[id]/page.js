'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { useCart } from '@/context/CartContext';
import { useModal } from '@/context/ModalContext';
import { processUploadedImage } from '@/utils/imageCompressor';
import { sanitizeInput } from '@/utils/securitySanitizer';
import {
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  ChevronRight,
  Minus,
  Plus,
  Check,
  Upload,
  ChevronDown,
  ChevronUp,
  Heart,
  RotateCcw
} from 'lucide-react';

export default function ProductDetailPage({ params }) {
  const productId = params?.id;
  const { addToCart } = useCart();
  const { showAlert } = useModal();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product Selection States
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('20cm Circle (8")');
  const [selectedFinish, setSelectedFinish] = useState('Signature Smooth Fondant (White/Ivory)');
  const [customPrintFile, setCustomPrintFile] = useState(null);
  const [compressingFile, setCompressingFile] = useState(false);

  // Accordion Tabs State
  const [activeAccordion, setActiveAccordion] = useState('desc');

  useEffect(() => {
    async function loadProductData() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          const found = data.find((p) => String(p.id) === String(productId));
          if (found) {
            setProduct(found);
          } else if (data.length > 0) {
            setProduct(data[0]);
          }
          setRelatedProducts(data.filter((p) => String(p.id) !== String(productId)).slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, [productId]);

  if (loading) {
    return (
      <div style={{ background: '#F8FAFC', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.1rem', color: '#64748B', fontWeight: 600 }}>Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ background: '#F8FAFC', minHeight: '80vh', textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#0F172A', marginBottom: 12 }}>Product Not Found</h2>
        <Link href="/collections" className="btn-primary">Browse Prop Catalog</Link>
      </div>
    );
  }

  const sampleGallery = [
    product.image,
    '/images/hero_cake_prop.png',
    '/images/wedding_tier_prop.png',
    '/images/photo_prop_set.png'
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showAlert('Added to Cart', `${product.name} has been added to your shopping basket!`, 'success');
  };

  const handleCustomFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setCompressingFile(true);
      const compressedBase64 = await processUploadedImage(file, 1000, 5 * 1024 * 1024);
      setCustomPrintFile(compressedBase64);
      await showAlert('Design Attached', 'Your custom edible image artwork was compressed & attached successfully!', 'success');
    } catch (err) {
      await showAlert('Upload Limit', err.message, 'warning');
      e.target.value = '';
    } finally {
      setCompressingFile(false);
    }
  };

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Breadcrumbs Navigation */}
      <div style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem', color: '#64748B' }}>
          <Link href="/" style={{ color: '#0F172A', fontWeight: 600 }}>Home</Link>
          <ChevronRight style={{ width: 14, height: 14 }} />
          <Link href="/collections" style={{ color: '#0F172A', fontWeight: 600 }}>Prop Catalog</Link>
          <ChevronRight style={{ width: 14, height: 14 }} />
          <span style={{ color: '#0FB3B6', fontWeight: 700 }}>{product.name}</span>
        </div>
      </div>

      {/* Main Product Layout (Matching Image 4) */}
      <div className="container" style={{ marginTop: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          
          {/* Left Column: Image Gallery Viewer */}
          <div>
            <div style={{ background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0', padding: 16, marginBottom: 16, overflow: 'hidden' }}>
              <SafeImage
                src={sampleGallery[selectedImageIndex]}
                alt={product.name}
                style={{ width: '100%', height: 440, objectFit: 'cover', borderRadius: 12 }}
              />
            </div>

            {/* Sub Thumbnails */}
            <div style={{ display: 'flex', gap: 12 }}>
              {sampleGallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 10,
                    border: selectedImageIndex === idx ? '2px solid #0FB3B6' : '1px solid #CBD5E1',
                    padding: 2,
                    background: '#FFFFFF',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                >
                  <SafeImage src={imgUrl} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Specifications & Purchasing Controls */}
          <div>
            {/* Tag Badge */}
            {product.tag && (
              <span style={{ background: 'rgba(15, 179, 182, 0.12)', color: '#0FB3B6', fontSize: '0.78rem', fontWeight: 800, padding: '4px 12px', borderRadius: 999, border: '1px solid rgba(15, 179, 182, 0.3)' }}>
                {product.tag}
              </span>
            )}

            <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0F172A', marginTop: 12, marginBottom: 10, lineHeight: 1.25, fontFamily: 'var(--font-heading)' }}>
              {product.name}
            </h1>

            {/* Star Rating Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} style={{ width: 16, height: 16, fill: '#F59E0B', color: '#F59E0B' }} />
                ))}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>{product.rating || '4.9'}/5</span>
              <span style={{ fontSize: '0.86rem', color: '#64748B', marginLeft: 4 }}>({product.reviewsCount || 0} verified customer reviews)</span>
            </div>

            {/* Pricing Section */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24, background: '#F8FAFC', padding: '16px 20px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0F172A' }}>
                ${parseFloat(product.price).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: '1.1rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                  ${parseFloat(product.originalPrice).toFixed(2)}
                </span>
              )}
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '2px 8px', borderRadius: 6, marginLeft: 'auto' }}>
                In Stock & Ready for Express Dispatch
              </span>
            </div>

            {/* Options Selection Form */}
            {(() => {
              const sizesList = (product.specs?.sizes || '20cm Circle (8"), 15cm Circle (6"), A4 Rectangle (19x27cm), 30 Circles (3.8cm Cupcake), 4-Tier Wedding Set')
                .split(',')
                .map(s => s.trim())
                .filter(Boolean);
              const finishesList = (product.specs?.finishes || 'Signature Smooth Fondant (White/Ivory), Organic Stone & Plaster Texture, Metallic Gold Leaf Gilding, Matte Studio Non-Reflective')
                .split(',')
                .map(f => f.trim())
                .filter(Boolean);

              return (
                <>
                  <div style={{ marginBottom: 20 }}>
                    <label className="form-label" style={{ fontWeight: 800, color: '#0F172A' }}>Select Dimension / Pre-Cut Size *</label>
                    <select className="form-select" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                      {sizesList.map((sz, i) => (
                        <option key={i} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label className="form-label" style={{ fontWeight: 800, color: '#0F172A' }}>Finish Coating / Texture *</label>
                    <select className="form-select" value={selectedFinish} onChange={(e) => setSelectedFinish(e.target.value)}>
                      {finishesList.map((fn, i) => (
                        <option key={i} value={fn}>{fn}</option>
                      ))}
                    </select>
                  </div>
                </>
              );
            })()}

            {/* Upload Custom Design Option (For Edible Images / Custom Props) */}
            <div style={{ marginBottom: 24, background: '#F0FDFA', padding: 16, borderRadius: 12, border: '1px solid #CCFBF1' }}>
              <label className="form-label" style={{ fontWeight: 800, color: '#0F766E', marginBottom: 4 }}>
                Optional: Upload Your Photo / Artwork Design
              </label>
              <div style={{ fontSize: '0.78rem', color: '#115E59', marginBottom: 10 }}>
                Upload high-res JPG/PNG artwork for custom cake edible image printing. Max 5MB file.
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCustomFileUpload}
                style={{ fontSize: '0.84rem' }}
              />
              {compressingFile && <div style={{ fontSize: '0.8rem', color: '#0FB3B6', marginTop: 4 }}>Compressing artwork...</div>}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: 8, overflow: 'hidden', height: 46 }}>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: 40, height: '100%', background: '#F8FAFC', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Minus style={{ width: 14, height: 14 }} />
                </button>
                <span style={{ width: 44, textAlign: 'center', fontWeight: 800, fontSize: '0.95rem' }}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  style={{ width: 40, height: '100%', background: '#F8FAFC', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Plus style={{ width: 14, height: 14 }} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-primary"
                style={{ flexGrow: 1, height: 46, justifyContent: 'center', fontSize: '0.95rem', gap: 8 }}
              >
                <ShoppingBag style={{ width: 18, height: 18 }} /> Add To Cart
              </button>
            </div>

            {/* Value Feature Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28, borderTop: '1px solid #E2E8F0', paddingTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem', color: '#334155' }}>
                <Truck style={{ width: 16, height: 16, color: '#0FB3B6' }} />
                <span>Express Crate Delivery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem', color: '#334155' }}>
                <ShieldCheck style={{ width: 16, height: 16, color: '#0FB3B6' }} />
                <span>UV & Humidity Resistant</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem', color: '#334155' }}>
                <RotateCcw style={{ width: 16, height: 16, color: '#0FB3B6' }} />
                <span>100% Quality Guarantee</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem', color: '#334155' }}>
                <Check style={{ width: 16, height: 16, color: '#0FB3B6' }} />
                <span>Edible Ink & Food Safe</span>
              </div>
            </div>

            {/* Accordion Tabs */}
            <div style={{ borderTop: '1px solid #E2E8F0' }}>
              <div style={{ borderBottom: '1px solid #E2E8F0' }}>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'desc' ? '' : 'desc')}
                  style={{ width: '100%', padding: '14px 0', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', cursor: 'pointer' }}
                >
                  Product Description
                  {activeAccordion === 'desc' ? <ChevronUp style={{ width: 16, height: 16 }} /> : <ChevronDown style={{ width: 16, height: 16 }} />}
                </button>
                {activeAccordion === 'desc' && (
                  <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, paddingBottom: 16, margin: 0 }}>
                    {product.description} Our edible icing sheets are printed using premium edible inks that bond cleanly to fondant or buttercream. Pre-cut shapes save setup time for bakeries and luxury event stylists.
                  </p>
                )}
              </div>

              <div style={{ borderBottom: '1px solid #E2E8F0' }}>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'specs' ? '' : 'specs')}
                  style={{ width: '100%', padding: '14px 0', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', cursor: 'pointer' }}
                >
                  Material Specifications & Care
                  {activeAccordion === 'specs' ? <ChevronUp style={{ width: 16, height: 16 }} /> : <ChevronDown style={{ width: 16, height: 16 }} />}
                </button>
                {activeAccordion === 'specs' && (
                  <div style={{ fontSize: '0.86rem', color: '#475569', paddingBottom: 16, lineHeight: 1.7 }}>
                    <div>• <strong>Core Material:</strong> {product.specs?.material || 'Ultra-Hard EPS / Resin Compound'}</div>
                    <div>• <strong>Height:</strong> {product.specs?.height || 'Standard'}</div>
                    <div>• <strong>Tier Config:</strong> {product.specs?.tiers || 'Single / Modular'}</div>
                    <div>• <strong>Storage:</strong> Store sealed at room temperature away from direct sunlight.</div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
