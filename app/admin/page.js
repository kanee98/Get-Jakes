'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  X,
  Landmark,
  Search,
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Search & Filter States
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('wedding');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOrigPrice, setProdOrigPrice] = useState('');
  const [prodTag, setProdTag] = useState('Handcrafted');
  const [prodRating, setProdRating] = useState('4.9');
  const [prodReviews, setProdReviews] = useState('18');
  const [prodImage, setProdImage] = useState('/images/wedding_tier_prop.png');
  const [prodDesc, setProdDesc] = useState('');
  const [prodHeight, setProdHeight] = useState('28 inches');
  const [prodTiers, setProdTiers] = useState('4 Tiers');
  const [prodMaterial, setProdMaterial] = useState('EPS Foam + Fondant');
  const [prodWeight, setProdWeight] = useState('4.2 lbs');

  // Order Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Bank Settings State
  const [bankName, setBankName] = useState('Artisanal Commerce Bank');
  const [accountName, setAccountName] = useState('Get Jakes Props & Toppers LLC');
  const [accountNumber, setAccountNumber] = useState('9876 5432 1098 4421');
  const [ifscCode, setIfscCode] = useState('ACTB0009841');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  const loadData = async () => {
    try {
      const [resProd, resOrders, resQuotes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/custom-quotes')
      ]);

      if (resProd.ok) setProducts(await resProd.json());
      if (resOrders.ok) setOrders(await resOrders.json());
      if (resQuotes.ok) setQuotes(await resQuotes.json());
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Verifying admin permissions...</p>
      </div>
    );
  }

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
  const pendingOrders = orders.filter((o) => o.status?.includes('Awaiting')).length;
  const verifiedOrders = orders.filter((o) => o.status?.includes('Verified')).length;

  // Product Actions
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory('wedding');
    setProdPrice('');
    setProdOrigPrice('');
    setProdTag('Handcrafted');
    setProdRating('4.9');
    setProdReviews('18');
    setProdImage('/images/wedding_tier_prop.png');
    setProdDesc('');
    setProdHeight('28 inches');
    setProdTiers('4 Tiers');
    setProdMaterial('EPS Foam + Fondant');
    setProdWeight('4.2 lbs');
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (p) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdPrice(p.price);
    setProdOrigPrice(p.originalPrice || '');
    setProdTag(p.tag);
    setProdRating(p.rating);
    setProdReviews(p.reviewsCount);
    setProdImage(p.image);
    setProdDesc(p.description);
    setProdHeight(p.specs?.height || '28 inches');
    setProdTiers(p.specs?.tiers || '4 Tiers');
    setProdMaterial(p.specs?.material || 'EPS Foam');
    setProdWeight(p.specs?.weight || '4.2 lbs');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const productPayload = {
      id: editingProductId,
      name: prodName,
      category: prodCategory,
      price: parseFloat(prodPrice),
      originalPrice: prodOrigPrice ? parseFloat(prodOrigPrice) : null,
      tag: prodTag,
      rating: parseFloat(prodRating),
      reviewsCount: parseInt(prodReviews, 10),
      image: prodImage,
      description: prodDesc,
      specs: {
        height: prodHeight,
        tiers: prodTiers,
        material: prodMaterial,
        weight: prodWeight
      }
    };

    const method = editingProductId ? 'PUT' : 'POST';
    const res = await fetch('/api/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productPayload)
    });

    if (res.ok) {
      setIsProductModalOpen(false);
      loadData();
      alert(editingProductId ? 'Prop updated in database!' : 'New prop added to MySQL!');
    } else {
      alert('Failed to save product.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this prop from MySQL?')) return;
    const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadData();
      alert('Prop deleted from database.');
    }
  };

  // Order Actions
  const handleOrderStatusChange = async (orderId, newStatus) => {
    const res = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status: newStatus })
    });

    if (res.ok) {
      loadData();
      alert(`Order status set to ${newStatus}.`);
    }
  };

  // Filtered Lists
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex' }}>
      {/* Dedicated Admin Sidebar */}
      <aside
        style={{
          width: 260,
          background: 'var(--bg-card)',
          borderRight: '1px solid var(--border-color)',
          padding: 24,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <img src="/logo.png" alt="Get Jakes Logo" style={{ width: 38, height: 38, borderRadius: '50%' }} />
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>GET JAKES ADMIN</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dedicated Studio Portal</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, flexGrow: 1 }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            style={{ width: '100%', textAlign: 'left', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <LayoutDashboard style={{ width: 18, height: 18 }} /> Studio Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            style={{ width: '100%', textAlign: 'left', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <Package style={{ width: 18, height: 18 }} /> Prop Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            style={{ width: '100%', textAlign: 'left', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <Receipt style={{ width: 18, height: 18 }} /> Orders & Wires ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            style={{ width: '100%', textAlign: 'left', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <Settings style={{ width: 18, height: 18 }} /> Bank & Store Settings
          </button>
        </nav>

        <div style={{ paddingTop: 20, borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Logged in as <strong>{user.email}</strong>
        </div>
      </aside>

      {/* Admin Main Body */}
      <main style={{ flexGrow: 1, padding: 36, overflowY: 'auto' }}>
        {loadingData ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading studio database metrics...</p>
        ) : (
          <>
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div>
                <div style={{ marginBottom: 28 }}>
                  <h1 style={{ fontSize: '2rem', color: 'var(--color-black)', margin: 0 }}>Studio Dashboard Overview</h1>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    Live MySQL metrics for bank wire transactions, prop catalog inventory, and custom quote inquiries.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
                  <div className="admin-stat-card">
                    <span className="stat-label">Total Wire Revenue</span>
                    <div className="stat-value" style={{ color: 'var(--color-brand)' }}>
                      ${totalRevenue.toFixed(2)}
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <span className="stat-label">Awaiting Verification</span>
                    <div className="stat-value" style={{ color: '#D97706' }}>
                      {pendingOrders}
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <span className="stat-label">Verified & In Production</span>
                    <div className="stat-value" style={{ color: '#10B981' }}>
                      {verifiedOrders}
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <span className="stat-label">Active Catalog Props</span>
                    <div className="stat-value">{products.length}</div>
                  </div>
                </div>

                {/* Quotes Table */}
                <div className="admin-card" style={{ padding: 24 }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-black)', marginBottom: 16 }}>
                    Recent Custom Prop Quote Requests ({quotes.length})
                  </h3>
                  {quotes.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No bespoke quote inquiries yet.</p>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Contact Info</th>
                          <th>Tiers Count</th>
                          <th>Finish Texture</th>
                          <th>Estimated Price</th>
                          <th>Submitted Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotes.slice(0, 5).map((q) => (
                          <tr key={q.id}>
                            <td><strong>#{q.id}</strong></td>
                            <td><strong>{q.contact_info}</strong></td>
                            <td>{q.tiers_count} Tiers</td>
                            <td><span className="badge badge-brand">{q.finish_texture}</span></td>
                            <td><strong>${parseFloat(q.estimated_price).toFixed(2)}</strong></td>
                            <td>{new Date(q.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* 2. PROP CATALOG TAB */}
            {activeTab === 'products' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--color-black)', margin: 0 }}>Prop Catalog Management</h1>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      Create, modify, or remove cake props and display pedestals directly in MySQL database.
                    </p>
                  </div>
                  <button onClick={handleOpenAddProduct} className="btn-primary">
                    <Plus style={{ width: 18, height: 18 }} /> Add New Cake Prop
                  </button>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div className="search-input-wrapper" style={{ maxWidth: 400 }}>
                    <Search style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Search props by name or category..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Title / Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Tag</th>
                        <th>Specs</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <img src={p.image} alt={p.name} style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }} />
                          </td>
                          <td><strong>{p.name}</strong></td>
                          <td><span className="badge badge-brand">{p.category}</span></td>
                          <td><strong>${parseFloat(p.price).toFixed(2)}</strong></td>
                          <td><span className="badge badge-gold">{p.tag}</span></td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {p.specs?.tiers} • {p.specs?.height}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button onClick={() => handleEditProduct(p)} className="btn-action-view" title="Edit Prop">
                                <Edit style={{ width: 14, height: 14 }} /> Edit
                              </button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="btn-action-view" style={{ color: '#DC2626' }} title="Delete Prop">
                                <Trash2 style={{ width: 14, height: 14 }} /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. ORDERS & WIRES TAB */}
            {activeTab === 'orders' && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <h1 style={{ fontSize: '2rem', color: 'var(--color-black)', margin: 0 }}>Bank Wire Orders Queue</h1>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    Verify transaction UTR numbers and update order statuses across production and shipping.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                  <div className="search-input-wrapper" style={{ flex: 1, maxWidth: 380 }}>
                    <Search style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Search orders by Ref Code, customer name, email..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                    />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="form-select-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Awaiting Bank Transfer Verification">Awaiting Wire Verification</option>
                    <option value="Payment Verified">Payment Verified</option>
                    <option value="In Production">In Production</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="admin-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order Ref ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Wire UTR Ref</th>
                        <th>Status</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o) => (
                        <tr key={o.id}>
                          <td><strong className="ref-code" style={{ fontSize: '0.88rem' }}>{o.id}</strong></td>
                          <td>
                            <strong>{o.customerName}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.customerEmail}</div>
                          </td>
                          <td>{new Date(o.date).toLocaleDateString()}</td>
                          <td><strong>${parseFloat(o.total).toFixed(2)}</strong></td>
                          <td><code style={{ background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4, fontSize: '0.78rem' }}>{o.utrNumber}</code></td>
                          <td>
                            <select
                              value={o.status}
                              onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                              className="form-select-sm"
                            >
                              <option value="Awaiting Bank Transfer Verification">Awaiting Verification</option>
                              <option value="Payment Verified">Payment Verified</option>
                              <option value="In Production">In Production</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <button onClick={() => setSelectedOrder(o)} className="btn-action-view">
                              <Eye style={{ width: 14, height: 14 }} /> Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <h1 style={{ fontSize: '2rem', color: 'var(--color-black)', margin: 0 }}>Store Settings & Bank Details</h1>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    Configure default studio bank accounts displayed during customer wire transfer checkout.
                  </p>
                </div>

                <div className="admin-card" style={{ maxWidth: 600, padding: 28 }}>
                  <h3 style={{ marginBottom: 20, color: 'var(--color-brand)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Landmark /> Artisanal Commerce Bank Wire Account
                  </h3>

                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label">Bank Name</label>
                    <input type="text" className="form-input" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label">Account Holder Name</label>
                    <input type="text" className="form-input" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label">Account Number</label>
                    <input type="text" className="form-input" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label className="form-label">IFSC / Sort Code</label>
                    <input type="text" className="form-input" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} />
                  </div>

                  <button onClick={() => alert('Bank settings saved!')} className="btn-primary">
                    <CheckCircle2 style={{ width: 16, height: 16 }} /> Save Bank Settings
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* PRODUCT ADD/EDIT MODAL */}
      {isProductModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content" style={{ padding: 32, maxWidth: 720 }}>
            <button onClick={() => setIsProductModalOpen(false)} className="modal-close-btn">
              <X style={{ width: 20, height: 20 }} />
            </button>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--color-black)', marginBottom: 20 }}>
              {editingProductId ? 'Edit Prop Details' : 'Add New Cake Prop to Database'}
            </h2>

            <form onSubmit={handleSaveProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label className="form-label">Prop Title / Name *</label>
                  <input type="text" className="form-input" value={prodName} onChange={(e) => setProdName(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                    <option value="wedding">Wedding Tier Dummies</option>
                    <option value="photography">Studio Photo Kits</option>
                    <option value="pedestal">Display Pedestals</option>
                    <option value="custom">Custom & Commercial</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label className="form-label">Price ($) *</label>
                  <input type="number" step="0.01" className="form-input" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Original MSRP ($)</label>
                  <input type="number" step="0.01" className="form-input" value={prodOrigPrice} onChange={(e) => setProdOrigPrice(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Tag / Badge</label>
                  <select className="form-select" value={prodTag} onChange={(e) => setProdTag(e.target.value)}>
                    <option value="Handcrafted">Handcrafted</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Trending">Trending</option>
                    <option value="Studio Special">Studio Special</option>
                    <option value="New">New</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Image URL / Path *</label>
                <input type="text" className="form-input" value={prodImage} onChange={(e) => setProdImage(e.target.value)} required />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Product Description *</label>
                <textarea className="form-input" rows={3} value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">
                  <CheckCircle2 style={{ width: 16, height: 16 }} /> Save Prop to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="modal-overlay open">
          <div className="modal-content" style={{ padding: 32, maxWidth: 680 }}>
            <button onClick={() => setSelectedOrder(null)} className="modal-close-btn">
              <X style={{ width: 20, height: 20 }} />
            </button>
            <div style={{ marginBottom: 20 }}>
              <span className="ref-code" style={{ fontSize: '1.4rem' }}>{selectedOrder.id}</span>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Placed on {new Date(selectedOrder.date).toLocaleDateString()}</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-sm)', marginBottom: 20, fontSize: '0.9rem' }}>
              <div><strong>Customer Name:</strong> {selectedOrder.customerName}</div>
              <div><strong>Customer Email:</strong> {selectedOrder.customerEmail}</div>
              <div><strong>Delivery Address:</strong> {selectedOrder.shippingAddress}</div>
              <div style={{ marginTop: 6 }}><strong>Wire UTR Ref:</strong> <code>{selectedOrder.utrNumber}</code></div>
            </div>

            <h4 style={{ fontSize: '1rem', color: 'var(--color-black)', marginBottom: 12 }}>Order Line Items</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {(selectedOrder.items || []).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>
                  <span>{item.name} × {item.qty}</span>
                  <strong>${(parseFloat(item.price || 0) * parseInt(item.qty || 1)).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: 12 }}>
              <span>Total Payable Amount:</span>
              <strong style={{ fontSize: '1.4rem', color: 'var(--color-black)' }}>${parseFloat(selectedOrder.total || 0).toFixed(2)}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
