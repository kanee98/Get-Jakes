'use client';

import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { processUploadedImage } from '@/utils/imageCompressor';
import { sanitizeInput } from '@/utils/securitySanitizer';
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
  Menu,
  DollarSign,
  Clock,
  ExternalLink,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Upload,
  TrendingUp,
  MessageSquareQuote,
  Megaphone,
  Image,
  Grid,
  Star,
  Check,
  ThumbsUp
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, logout, loading } = useAuth();
  const { showAlert, showConfirm } = useModal();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);

  // Management Datasets
  const [announcements, setAnnouncements] = useState([]);
  const [banners, setBanners] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isImageCompressing, setIsImageCompressing] = useState(false);

  // Search & Filter States
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Custom Quote Search & Filters
  const [quoteSearch, setQuoteSearch] = useState('');
  const [quoteStatusFilter, setQuoteStatusFilter] = useState('all');
  const [quoteTextureFilter, setQuoteTextureFilter] = useState('all');

  // Pagination States
  const [quotePage, setQuotePage] = useState(1);
  const [quotesPerPage] = useState(5);
  const [productPage, setProductPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [orderPage, setOrderPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewsPerPage] = useState(5);

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

  // Management Form States
  const [annMsg, setAnnMsg] = useState('');
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerImage, setBannerImage] = useState('/images/hero_cake_prop.png');
  const [bannerLink, setBannerLink] = useState('#shop');
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCat, setGalleryCat] = useState('Studio Portfolio');
  const [galleryImg, setGalleryImg] = useState('/images/wedding_tier_prop.png');

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
      const [resProd, resOrders, resQuotes, resAnn, resBanners, resGallery, resRev] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/custom-quotes'),
        fetch('/api/announcements'),
        fetch('/api/category-banners'),
        fetch('/api/gallery'),
        fetch('/api/reviews?admin=true')
      ]);

      if (resProd.ok) setProducts(await resProd.json());
      if (resOrders.ok) setOrders(await resOrders.json());
      if (resQuotes.ok) setQuotes(await resQuotes.json());
      if (resAnn.ok) setAnnouncements(await resAnn.json());
      if (resBanners.ok) setBanners(await resBanners.json());
      if (resGallery.ok) setGalleryItems(await resGallery.json());
      if (resRev.ok) setReviews(await resRev.json());
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Management Handlers with Custom Modals
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!annMsg.trim()) return;
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: sanitizeInput(annMsg) })
      });
      if (res.ok) {
        setAnnMsg('');
        loadData();
        await showAlert('Success', 'Announcement created successfully!', 'success');
      }
    } catch (err) {
      await showAlert('Error', 'Failed to create announcement', 'warning');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    const ok = await showConfirm('Delete Announcement', 'Are you sure you want to delete this announcement?', { type: 'warning', confirmText: 'Delete' });
    if (!ok) return;
    try {
      await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' });
      loadData();
      await showAlert('Deleted', 'Announcement deleted successfully.', 'success');
    } catch (err) {
      await showAlert('Error', 'Failed to delete announcement', 'warning');
    }
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    if (!bannerTitle.trim() || !bannerImage.trim()) return;
    try {
      const res = await fetch('/api/category-banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: sanitizeInput(bannerTitle),
          subtitle: sanitizeInput(bannerSubtitle),
          image_url: bannerImage,
          link_url: bannerLink
        })
      });
      if (res.ok) {
        setBannerTitle('');
        setBannerSubtitle('');
        loadData();
        await showAlert('Success', 'Category banner created successfully!', 'success');
      }
    } catch (err) {
      await showAlert('Error', 'Failed to create category banner', 'warning');
    }
  };

  const handleDeleteBanner = async (id) => {
    const ok = await showConfirm('Delete Banner', 'Are you sure you want to delete this category banner?', { type: 'warning', confirmText: 'Delete' });
    if (!ok) return;
    try {
      await fetch(`/api/category-banners?id=${id}`, { method: 'DELETE' });
      loadData();
      await showAlert('Deleted', 'Category banner deleted successfully.', 'success');
    } catch (err) {
      await showAlert('Error', 'Failed to delete category banner', 'warning');
    }
  };

  const handleCreateGallery = async (e) => {
    e.preventDefault();
    if (!galleryTitle.trim() || !galleryImg.trim()) return;
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: sanitizeInput(galleryTitle),
          category: sanitizeInput(galleryCat),
          image_url: galleryImg
        })
      });
      if (res.ok) {
        setGalleryTitle('');
        loadData();
        await showAlert('Success', 'Gallery showcase photo added successfully!', 'success');
      }
    } catch (err) {
      await showAlert('Error', 'Failed to create gallery item', 'warning');
    }
  };

  const handleDeleteGallery = async (id) => {
    const ok = await showConfirm('Delete Gallery Photo', 'Are you sure you want to delete this gallery item?', { type: 'warning', confirmText: 'Delete' });
    if (!ok) return;
    try {
      await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      loadData();
      await showAlert('Deleted', 'Gallery item removed successfully.', 'success');
    } catch (err) {
      await showAlert('Error', 'Failed to delete gallery item', 'warning');
    }
  };

  const handleVerifyReview = async (id, isVerified) => {
    try {
      await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isVerified })
      });
      loadData();
      await showAlert('Review Updated', `Customer review ${isVerified ? 'verified & published' : 'unpublished'}!`, 'success');
    } catch (err) {
      await showAlert('Error', 'Failed to update review verification status', 'warning');
    }
  };

  const handleDeleteReview = async (id) => {
    const ok = await showConfirm('Delete Review', 'Are you sure you want to delete this review?', { type: 'warning', confirmText: 'Delete' });
    if (!ok) return;
    try {
      await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
      loadData();
      await showAlert('Deleted', 'Customer review deleted successfully.', 'success');
    } catch (err) {
      await showAlert('Error', 'Failed to delete review', 'warning');
    }
  };

  const handleQuoteStatusChange = async (quoteId, newStatus) => {
    try {
      const res = await fetch('/api/custom-quotes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: quoteId, status: newStatus })
      });
      if (res.ok) {
        loadData();
        await showAlert('Status Updated', `Custom quote #${quoteId} workflow status updated to "${newStatus}".`, 'success');
      }
    } catch (err) {
      await showAlert('Update Error', 'Failed to update custom quote status.', 'warning');
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    const ok = await showConfirm(
      'Delete Quote Inquiry',
      `Are you sure you want to delete custom quote inquiry #${quoteId}?`,
      { type: 'warning', confirmText: 'Delete' }
    );
    if (!ok) return;

    try {
      const res = await fetch(`/api/custom-quotes?id=${quoteId}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
        await showAlert('Quote Deleted', `Custom quote inquiry #${quoteId} removed from database.`, 'success');
      }
    } catch (err) {
      await showAlert('Delete Error', 'Failed to delete quote inquiry.', 'warning');
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <p style={{ color: '#64748B', fontWeight: 600 }}>Verifying enterprise admin permissions...</p>
      </div>
    );
  }

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
  const pendingOrders = orders.filter((o) => o.status?.includes('Awaiting')).length;
  const verifiedOrders = orders.filter((o) => o.status?.includes('Verified') || o.status?.includes('Production')).length;

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
      name: sanitizeInput(prodName),
      category: prodCategory,
      price: parseFloat(prodPrice),
      originalPrice: prodOrigPrice ? parseFloat(prodOrigPrice) : null,
      tag: sanitizeInput(prodTag),
      rating: parseFloat(prodRating),
      reviewsCount: parseInt(prodReviews, 10),
      image: prodImage,
      description: sanitizeInput(prodDesc),
      specs: {
        height: sanitizeInput(prodHeight),
        tiers: sanitizeInput(prodTiers),
        material: sanitizeInput(prodMaterial),
        weight: sanitizeInput(prodWeight)
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
      await showAlert('Success', editingProductId ? 'Prop updated successfully!' : 'New prop added to inventory database!', 'success');
    } else {
      await showAlert('Error', 'Failed to save product.', 'warning');
    }
  };

  const handleDeleteProduct = async (id) => {
    const ok = await showConfirm('Delete Prop', 'Are you sure you want to remove this prop from the database?', { type: 'warning', confirmText: 'Delete' });
    if (!ok) return;
    const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadData();
      await showAlert('Deleted', 'Prop deleted successfully.', 'success');
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
    }
  };

  // Filtered & Paginated Lists
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );
  const totalProductPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * productsPerPage,
    productPage * productsPerPage
  );

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });
  const totalOrderPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
    (orderPage - 1) * ordersPerPage,
    orderPage * ordersPerPage
  );

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      (q.contact_info || '').toLowerCase().includes(quoteSearch.toLowerCase()) ||
      (q.id || '').toString().includes(quoteSearch) ||
      (q.finish_texture || '').toLowerCase().includes(quoteSearch.toLowerCase());
    const matchesStatus = quoteStatusFilter === 'all' || (q.status || 'Pending') === quoteStatusFilter;
    const matchesTexture = quoteTextureFilter === 'all' || q.finish_texture === quoteTextureFilter;
    return matchesSearch && matchesStatus && matchesTexture;
  });
  const totalQuotePages = Math.ceil(filteredQuotes.length / quotesPerPage) || 1;
  const paginatedQuotes = filteredQuotes.slice(
    (quotePage - 1) * quotesPerPage,
    quotePage * quotesPerPage
  );

  const totalReviewPages = Math.ceil(reviews.length / reviewsPerPage) || 1;
  const paginatedReviews = reviews.slice(
    (reviewPage - 1) * reviewsPerPage,
    reviewPage * reviewsPerPage
  );

  return (
    <div className="admin-body-root">
      {/* Industrial Dark Sidebar */}
      <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <img src="/logo.png" alt="Get Jakes Logo" className="admin-logo-avatar" />
          <div className="admin-header-title-box">
            <div className="admin-sidebar-title">GET JAKES</div>
            <div className="admin-sidebar-subtitle">STUDIO ADMIN</div>
          </div>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="sidebar-collapse-btn"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight style={{ width: 16, height: 16 }} /> : <ChevronLeft style={{ width: 16, height: 16 }} />}
          </button>
        </div>

        <div className="admin-nav-group">
          <div className="admin-nav-label">Studio Workspace</div>
          <button
            onClick={() => { setActiveTab('overview'); setMobileSidebarOpen(false); }}
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            title="Overview"
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <LayoutDashboard style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span className="nav-item-text">Overview</span>
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('products'); setMobileSidebarOpen(false); }}
            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            title="Prop Catalog"
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Package style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span className="nav-item-text">Prop Catalog</span>
            </span>
            <span className="nav-badge">{products.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('orders'); setMobileSidebarOpen(false); }}
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            title="Wire Orders"
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Receipt style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span className="nav-item-text">Wire Orders</span>
            </span>
            <span className="nav-badge">{orders.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('quotes'); setMobileSidebarOpen(false); }}
            className={`admin-nav-item ${activeTab === 'quotes' ? 'active' : ''}`}
            title="Custom Quotes"
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MessageSquareQuote style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span className="nav-item-text">Custom Quotes</span>
            </span>
            <span className="nav-badge">{quotes.length}</span>
          </button>

          <div className="admin-nav-label" style={{ marginTop: 16 }}>Storefront Content</div>
          <button
            onClick={() => { setActiveTab('announcements'); setMobileSidebarOpen(false); }}
            className={`admin-nav-item ${activeTab === 'announcements' ? 'active' : ''}`}
            title="Top Announcement"
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Megaphone style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span className="nav-item-text">Top Announcement</span>
            </span>
            <span className="nav-badge">{announcements.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('banners'); setMobileSidebarOpen(false); }}
            className={`admin-nav-item ${activeTab === 'banners' ? 'active' : ''}`}
            title="Category Banners"
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Image style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span className="nav-item-text">Category Banners</span>
            </span>
            <span className="nav-badge">{banners.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('gallery'); setMobileSidebarOpen(false); }}
            className={`admin-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
            title="Gallery Showcase"
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Grid style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span className="nav-item-text">Gallery Showcase</span>
            </span>
            <span className="nav-badge">{galleryItems.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('reviews'); setMobileSidebarOpen(false); }}
            className={`admin-nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
            title="Customer Reviews"
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Star style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span className="nav-item-text">Customer Reviews</span>
            </span>
            {reviews.filter(r => r.is_verified === 0).length > 0 && (
              <span className="nav-badge" style={{ background: '#36DFE2', color: '#0A0D12' }}>
                {reviews.filter(r => r.is_verified === 0).length} Pending
              </span>
            )}
          </button>

          <div className="admin-nav-label" style={{ marginTop: 16 }}>Management</div>
          <button
            onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); }}
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            title="Bank & Store Settings"
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Settings style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span className="nav-item-text">Bank & Store Settings</span>
            </span>
          </button>

          <div className="admin-nav-label" style={{ marginTop: 16 }}>Storefront</div>
          <Link href="/" className="admin-nav-item" target="_blank" title="Live Website">
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ExternalLink style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span className="nav-item-text">Live Website</span>
            </span>
          </Link>
        </div>

        {/* User Account Info */}
        <div className="admin-sidebar-user">
          <div className="admin-user-details">
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F8FAFC' }}>
              {user.fullName || 'Admin User'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{user.email}</div>
          </div>
          <button
            onClick={() => logout()}
            title="Sign Out"
            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 4 }}
          >
            <LogOut style={{ width: 18, height: 18, flexShrink: 0 }} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-content-area">
        {/* Top Header Bar */}
        <header className="admin-top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="enterprise-btn-secondary admin-mobile-toggle-btn"
              title="Toggle Admin Menu"
              aria-label="Toggle Admin Menu"
            >
              {mobileSidebarOpen ? <X style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
            </button>
            <div className="admin-breadcrumbs">
              <span>Admin Portal</span>
              <ChevronRight style={{ width: 14, height: 14 }} />
              <strong>
                {activeTab === 'overview' && 'Studio Overview'}
                {activeTab === 'products' && 'Prop Catalog'}
                {activeTab === 'orders' && 'Bank Wire Orders'}
                {activeTab === 'quotes' && 'Custom Quote Requests'}
                {activeTab === 'announcements' && 'Top Announcement Bar'}
                {activeTab === 'banners' && 'Category Banners'}
                {activeTab === 'gallery' && 'Gallery Showcase'}
                {activeTab === 'reviews' && 'Customer Reviews Moderation'}
                {activeTab === 'settings' && 'Bank & Store Settings'}
              </strong>
            </div>
          </div>
        </header>

        {/* Main Workspace Canvas */}
        <main className="admin-workspace">
          {loadingData ? (
            <p style={{ color: '#64748B', fontWeight: 600 }}>Loading studio telemetry data...</p>
          ) : (
            <>
              {/* 1. OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div>
                  <div className="admin-page-header">
                    <div className="admin-page-title">
                      <h1>Studio Operations Telemetry</h1>
                      <p>Real-time metrics for bank wire transfers, active prop catalog, and bespoke quote inquiries.</p>
                    </div>
                  </div>

                  {/* KPI Metrics Cards */}
                  <div className="admin-kpi-grid">
                    <div className="admin-kpi-card">
                      <div className="kpi-header">
                        <span className="kpi-title">Total Wire Revenue</span>
                        <div className="kpi-icon-wrapper brand">
                          <DollarSign style={{ width: 20, height: 20 }} />
                        </div>
                      </div>
                      <div className="kpi-value">${totalRevenue.toFixed(2)}</div>
                      <div className="kpi-footer">
                        <span className="kpi-trend up">
                          <TrendingUp style={{ width: 14, height: 14 }} /> +14.2%
                        </span>
                        <span>vs previous period</span>
                      </div>
                    </div>

                    <div className="admin-kpi-card">
                      <div className="kpi-header">
                        <span className="kpi-title">Awaiting Verification</span>
                        <div className="kpi-icon-wrapper amber">
                          <Clock style={{ width: 20, height: 20 }} />
                        </div>
                      </div>
                      <div className="kpi-value">{pendingOrders}</div>
                      <div className="kpi-footer">
                        <span className="kpi-trend warning">Action required</span>
                        <span>pending bank wires</span>
                      </div>
                    </div>

                    <div className="admin-kpi-card">
                      <div className="kpi-header">
                        <span className="kpi-title">Verified & Production</span>
                        <div className="kpi-icon-wrapper emerald">
                          <CheckCircle2 style={{ width: 20, height: 20 }} />
                        </div>
                      </div>
                      <div className="kpi-value">{verifiedOrders}</div>
                      <div className="kpi-footer">
                        <span className="kpi-trend up">Active workflow</span>
                      </div>
                    </div>

                    <div className="admin-kpi-card">
                      <div className="kpi-header">
                        <span className="kpi-title">Active Prop Catalog</span>
                        <div className="kpi-icon-wrapper indigo">
                          <Package style={{ width: 20, height: 20 }} />
                        </div>
                      </div>
                      <div className="kpi-value">{products.length}</div>
                      <div className="kpi-footer">
                        <span>Across 4 categories</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Quotes Table Container */}
                  <div className="admin-card-container">
                    <div className="admin-card-title-bar">
                      <h3>Recent Custom Prop Quote Requests</h3>
                      <button onClick={() => setActiveTab('quotes')} className="enterprise-btn-secondary">
                        View All Quotes
                      </button>
                    </div>

                    {quotes.length === 0 ? (
                      <p style={{ padding: 24, color: '#64748B', margin: 0, fontSize: '0.9rem' }}>
                        No bespoke quote inquiries received yet.
                      </p>
                    ) : (
                      <div className="table-responsive-wrapper">
                        <table className="enterprise-table">
                          <thead>
                            <tr>
                              <th>Inquiry ID</th>
                              <th>Contact Email / Phone</th>
                              <th>Tiers</th>
                              <th>Finish Texture</th>
                              <th>Estimated Price</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {quotes.slice(0, 5).map((q) => (
                              <tr key={q.id}>
                                <td><code style={{ background: '#F1F5F9', padding: '2px 8px', borderRadius: 4, fontWeight: 700, fontSize: '0.82rem' }}>#{q.id}</code></td>
                                <td><strong style={{ color: '#0F172A' }}>{q.contact_info}</strong></td>
                                <td>{q.tiers_count} Tiers</td>
                                <td><span className="status-pill blue">{q.finish_texture}</span></td>
                                <td><strong style={{ color: '#0F172A' }}>${parseFloat(q.estimated_price).toFixed(2)}</strong></td>
                                <td>{new Date(q.created_at).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. PROP CATALOG TAB */}
              {activeTab === 'products' && (
                <div>
                  <div className="admin-page-header">
                    <div className="admin-page-title">
                      <h1>Prop Catalog Management</h1>
                      <p>Create, update, or deprecate dummy cake props and architectural pedestals in MySQL.</p>
                    </div>
                    <button onClick={handleOpenAddProduct} className="enterprise-btn-primary">
                      <Plus style={{ width: 16, height: 16 }} /> Add New Cake Prop
                    </button>
                  </div>

                  <div className="admin-card-container">
                    <div className="admin-filter-bar">
                      <div className="search-field">
                        <Search style={{ width: 16, height: 16, color: '#94A3B8' }} />
                        <input
                          type="text"
                          placeholder="Search by prop name or category..."
                          value={productSearch}
                          onChange={(e) => { setProductSearch(e.target.value); setProductPage(1); }}
                        />
                      </div>
                      <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                        Showing {filteredProducts.length} Props
                      </span>
                    </div>

                    <div className="table-responsive-wrapper">
                      <table className="enterprise-table">
                        <thead>
                          <tr>
                            <th>Preview</th>
                            <th>Prop Title</th>
                            <th>Category</th>
                            <th>Price ($)</th>
                            <th>Badge Tag</th>
                            <th>Dimensions & Material</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedProducts.map((p) => (
                            <tr key={p.id}>
                              <td>
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #E2E8F0' }}
                                />
                              </td>
                              <td><strong style={{ color: '#0F172A', fontSize: '0.92rem' }}>{p.name}</strong></td>
                              <td><span className="status-pill blue">{p.category}</span></td>
                              <td><strong style={{ color: '#0F172A' }}>${parseFloat(p.price).toFixed(2)}</strong></td>
                              <td><span className="status-pill amber">{p.tag}</span></td>
                              <td style={{ fontSize: '0.82rem', color: '#64748B' }}>
                                {p.specs?.tiers} • {p.specs?.height}
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: 8 }}>
                                  <button onClick={() => handleEditProduct(p)} className="enterprise-btn-secondary">
                                    <Edit style={{ width: 14, height: 14 }} /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="enterprise-btn-secondary"
                                    style={{ color: '#DC2626', borderColor: '#FECDD3' }}
                                  >
                                    <Trash2 style={{ width: 14, height: 14 }} /> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderTop: '1px solid #E2E8F0', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                        Showing <strong>{filteredProducts.length > 0 ? (productPage - 1) * productsPerPage + 1 : 0}</strong> to <strong>{Math.min(productPage * productsPerPage, filteredProducts.length)}</strong> of <strong>{filteredProducts.length}</strong> props
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          disabled={productPage <= 1}
                          onClick={() => setProductPage(p => Math.max(1, p - 1))}
                          className="enterprise-btn-secondary"
                          style={{ padding: '6px 14px', fontSize: '0.8rem', opacity: productPage <= 1 ? 0.5 : 1, cursor: productPage <= 1 ? 'not-allowed' : 'pointer' }}
                        >
                          Previous
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', padding: '0 6px' }}>
                          Page {productPage} of {totalProductPages}
                        </span>
                        <button
                          disabled={productPage >= totalProductPages}
                          onClick={() => setProductPage(p => Math.min(totalProductPages, p + 1))}
                          className="enterprise-btn-secondary"
                          style={{ padding: '6px 14px', fontSize: '0.8rem', opacity: productPage >= totalProductPages ? 0.5 : 1, cursor: productPage >= totalProductPages ? 'not-allowed' : 'pointer' }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. ORDERS & BANK WIRES TAB */}
              {activeTab === 'orders' && (
                <div>
                  <div className="admin-page-header">
                    <div className="admin-page-title">
                      <h1>Bank Wire Order Queue</h1>
                      <p>Match transaction UTR numbers with bank wire transfers and advance workshop production.</p>
                    </div>
                  </div>

                  <div className="admin-card-container">
                    <div className="admin-filter-bar">
                      <div className="search-field">
                        <Search style={{ width: 16, height: 16, color: '#94A3B8' }} />
                        <input
                          type="text"
                          placeholder="Search Ref Code, customer, UTR number..."
                          value={orderSearch}
                          onChange={(e) => { setOrderSearch(e.target.value); setOrderPage(1); }}
                        />
                      </div>

                      <select
                        value={orderStatusFilter}
                        onChange={(e) => { setOrderStatusFilter(e.target.value); setOrderPage(1); }}
                        className="enterprise-btn-secondary"
                        style={{ outline: 'none' }}
                      >
                        <option value="all">All Order Statuses</option>
                        <option value="Awaiting Bank Transfer Verification">Awaiting Wire Verification</option>
                        <option value="Payment Verified">Payment Verified</option>
                        <option value="In Production">In Production</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="table-responsive-wrapper">
                      <table className="enterprise-table">
                        <thead>
                          <tr>
                            <th>Order Ref ID</th>
                            <th>Customer Account</th>
                            <th>Order Date</th>
                            <th>Total Amount</th>
                            <th>Wire UTR Ref</th>
                            <th>Workflow Status</th>
                            <th>Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedOrders.map((o) => (
                            <tr key={o.id}>
                              <td>
                                <code style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0F172A', background: '#F1F5F9', padding: '4px 8px', borderRadius: 4 }}>
                                  {o.id}
                                </code>
                              </td>
                              <td>
                                <strong style={{ color: '#0F172A', display: 'block' }}>{o.customerName}</strong>
                                <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{o.customerEmail}</span>
                              </td>
                              <td>{new Date(o.date).toLocaleDateString()}</td>
                              <td><strong style={{ color: '#0F172A', fontSize: '0.95rem' }}>${parseFloat(o.total).toFixed(2)}</strong></td>
                              <td>
                                <code style={{ background: '#FEF3C7', color: '#B45309', padding: '3px 8px', borderRadius: 4, fontWeight: 700, fontSize: '0.8rem' }}>
                                  {o.utrNumber}
                                </code>
                              </td>
                              <td>
                                <select
                                  value={o.status}
                                  onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: 999,
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    border: '1px solid #CBD5E1',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    background: o.status?.includes('Verified') ? '#D1FAE5' : o.status?.includes('Awaiting') ? '#FEF3C7' : '#E0E7FF',
                                    color: o.status?.includes('Verified') ? '#047857' : o.status?.includes('Awaiting') ? '#B45309' : '#4338CA'
                                  }}
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
                                <button onClick={() => setSelectedOrder(o)} className="enterprise-btn-secondary">
                                  <Eye style={{ width: 14, height: 14 }} /> Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderTop: '1px solid #E2E8F0', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                        Showing <strong>{filteredOrders.length > 0 ? (orderPage - 1) * ordersPerPage + 1 : 0}</strong> to <strong>{Math.min(orderPage * ordersPerPage, filteredOrders.length)}</strong> of <strong>{filteredOrders.length}</strong> orders
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          disabled={orderPage <= 1}
                          onClick={() => setOrderPage(p => Math.max(1, p - 1))}
                          className="enterprise-btn-secondary"
                          style={{ padding: '6px 14px', fontSize: '0.8rem', opacity: orderPage <= 1 ? 0.5 : 1, cursor: orderPage <= 1 ? 'not-allowed' : 'pointer' }}
                        >
                          Previous
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', padding: '0 6px' }}>
                          Page {orderPage} of {totalOrderPages}
                        </span>
                        <button
                          disabled={orderPage >= totalOrderPages}
                          onClick={() => setOrderPage(p => Math.min(totalOrderPages, p + 1))}
                          className="enterprise-btn-secondary"
                          style={{ padding: '6px 14px', fontSize: '0.8rem', opacity: orderPage >= totalOrderPages ? 0.5 : 1, cursor: orderPage >= totalOrderPages ? 'not-allowed' : 'pointer' }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. CUSTOM QUOTES TAB (Image 4 Enhanced) */}
              {activeTab === 'quotes' && (
                <div>
                  <div className="admin-page-header">
                    <div className="admin-page-title">
                      <h1>Custom Prop Quote Inquiries</h1>
                      <p>Review bespoke prop configurations submitted via the frontend instant price calculator.</p>
                    </div>
                  </div>

                  <div className="admin-card-container">
                    {/* Filters & Search Bar */}
                    <div className="admin-filter-bar" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                      <div className="search-field" style={{ flexGrow: 1, minWidth: 220 }}>
                        <Search style={{ width: 16, height: 16, color: '#94A3B8' }} />
                        <input
                          type="text"
                          placeholder="Search inquiry ID, contact info, or texture..."
                          value={quoteSearch}
                          onChange={(e) => { setQuoteSearch(e.target.value); setQuotePage(1); }}
                        />
                      </div>

                      <select
                        value={quoteStatusFilter}
                        onChange={(e) => { setQuoteStatusFilter(e.target.value); setQuotePage(1); }}
                        className="enterprise-btn-secondary"
                        style={{ outline: 'none' }}
                      >
                        <option value="all">All Statuses</option>
                        <option value="Pending">Pending / New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Fulfilled">Fulfilled</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <select
                        value={quoteTextureFilter}
                        onChange={(e) => { setQuoteTextureFilter(e.target.value); setQuotePage(1); }}
                        className="enterprise-btn-secondary"
                        style={{ outline: 'none' }}
                      >
                        <option value="all">All Textures</option>
                        <option value="smooth">Smooth Fondant</option>
                        <option value="textured">Stone & Plaster</option>
                        <option value="gold">24K Gold Gilding</option>
                        <option value="naked">Naked Rustic</option>
                      </select>
                    </div>

                    <div className="table-responsive-wrapper">
                      <table className="enterprise-table">
                        <thead>
                          <tr>
                            <th>INQUIRY ID</th>
                            <th>CONTACT INFORMATION</th>
                            <th>TIERS COUNT</th>
                            <th>FINISH TEXTURE</th>
                            <th>CALCULATED ESTIMATE</th>
                            <th>SUBMISSION DATE</th>
                            <th>WORKFLOW STATUS</th>
                            <th>ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedQuotes.length === 0 ? (
                            <tr>
                              <td colSpan="8" style={{ textAlign: 'center', padding: 32, color: '#64748B' }}>
                                No custom quote inquiries match your filter criteria.
                              </td>
                            </tr>
                          ) : (
                            paginatedQuotes.map((q) => {
                              const status = q.status || 'Pending';
                              const statusColors = {
                                'Pending': { bg: '#FEF3C7', text: '#B45309' },
                                'Contacted': { bg: '#DBEAFE', text: '#1D4ED8' },
                                'In Progress': { bg: '#F3E8FF', text: '#6B21A8' },
                                'Quoted': { bg: '#CCFBF1', text: '#0F766E' },
                                'Fulfilled': { bg: '#D1FAE5', text: '#047857' },
                                'Cancelled': { bg: '#FEE2E2', text: '#B91C1C' }
                              };
                              const sColor = statusColors[status] || statusColors['Pending'];

                              return (
                                <tr key={q.id}>
                                  <td><code style={{ fontWeight: 800, background: '#F1F5F9', padding: '3px 8px', borderRadius: 4 }}>#{q.id}</code></td>
                                  <td><strong style={{ color: '#0F172A' }}>{q.contact_info}</strong></td>
                                  <td>{q.tiers_count} Tiers</td>
                                  <td><span className="status-pill blue">{q.finish_texture}</span></td>
                                  <td><strong style={{ color: '#059669', fontSize: '0.95rem' }}>${parseFloat(q.estimated_price).toFixed(2)}</strong></td>
                                  <td>{new Date(q.created_at).toLocaleDateString()}</td>
                                  <td>
                                    <select
                                      value={status}
                                      onChange={(e) => handleQuoteStatusChange(q.id, e.target.value)}
                                      style={{
                                        padding: '6px 12px',
                                        borderRadius: 999,
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        border: '1px solid #CBD5E1',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        background: sColor.bg,
                                        color: sColor.text
                                      }}
                                    >
                                      <option value="Pending">Pending / New</option>
                                      <option value="Contacted">Contacted</option>
                                      <option value="In Progress">In Progress</option>
                                      <option value="Quoted">Quoted</option>
                                      <option value="Fulfilled">Fulfilled</option>
                                      <option value="Cancelled">Cancelled</option>
                                    </select>
                                  </td>
                                  <td>
                                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                      {status === 'Pending' && (
                                        <button
                                          onClick={() => handleQuoteStatusChange(q.id, 'Contacted')}
                                          className="enterprise-btn-secondary"
                                          style={{ padding: '4px 10px', fontSize: '0.75rem', background: '#EFF6FF', color: '#1D4ED8', borderColor: '#BFDBFE' }}
                                        >
                                          Mark Contacted
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleDeleteQuote(q.id)}
                                        className="action-icon-btn delete"
                                        title="Delete Inquiry"
                                      >
                                        <Trash2 style={{ width: 14, height: 14 }} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderTop: '1px solid #E2E8F0', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                        Showing <strong>{filteredQuotes.length > 0 ? (quotePage - 1) * quotesPerPage + 1 : 0}</strong> to <strong>{Math.min(quotePage * quotesPerPage, filteredQuotes.length)}</strong> of <strong>{filteredQuotes.length}</strong> inquiries
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          disabled={quotePage <= 1}
                          onClick={() => setQuotePage(p => Math.max(1, p - 1))}
                          className="enterprise-btn-secondary"
                          style={{ padding: '6px 14px', fontSize: '0.8rem', opacity: quotePage <= 1 ? 0.5 : 1, cursor: quotePage <= 1 ? 'not-allowed' : 'pointer' }}
                        >
                          Previous
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', padding: '0 6px' }}>
                          Page {quotePage} of {totalQuotePages}
                        </span>
                        <button
                          disabled={quotePage >= totalQuotePages}
                          onClick={() => setQuotePage(p => Math.min(totalQuotePages, p + 1))}
                          className="enterprise-btn-secondary"
                          style={{ padding: '6px 14px', fontSize: '0.8rem', opacity: quotePage >= totalQuotePages ? 0.5 : 1, cursor: quotePage >= totalQuotePages ? 'not-allowed' : 'pointer' }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. BANK SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div>
                  <div className="admin-page-header">
                    <div className="admin-page-title">
                      <h1>Store Settings & Bank Details</h1>
                      <p>Configure studio wire transfer accounts displayed to customers during checkout.</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                    <div className="admin-card-container" style={{ padding: 28 }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, color: '#0F172A' }}>
                        <Landmark style={{ color: '#0FB3B6' }} /> Bank Transfer Configuration
                      </h3>

                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: '#334155' }}>Bank Name</label>
                        <input
                          type="text"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
                        />
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: '#334155' }}>Account Holder Name</label>
                        <input
                          type="text"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
                        />
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: '#334155' }}>Account Number</label>
                        <input
                          type="text"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
                        />
                      </div>

                      <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: '#334155' }}>IFSC / Sort Code</label>
                        <input
                          type="text"
                          value={ifscCode}
                          onChange={(e) => setIfscCode(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
                        />
                      </div>

                      <button onClick={async () => await showAlert('Settings Saved', 'Bank configuration updated successfully!', 'success')} className="enterprise-btn-primary">
                        <CheckCircle2 style={{ width: 16, height: 16 }} /> Save Bank Settings
                      </button>
                    </div>

                    {/* Preview Card */}
                    <div className="admin-card-container" style={{ padding: 28, background: '#F8FAFC' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#64748B', marginBottom: 16 }}>Customer Checkout Card Preview</h4>
                      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', padding: 24, borderRadius: 16, color: '#FFF' }}>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#36DFE2', fontWeight: 800, marginBottom: 12 }}>
                          Artisanal Direct Wire Card
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 4 }}>{bankName}</div>
                        <div style={{ fontSize: '0.88rem', color: '#94A3B8', marginBottom: 16 }}>{accountName}</div>

                        <div style={{ background: 'rgba(255,255,255,0.06)', padding: 12, borderRadius: 8, fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '0.1em' }}>
                          {accountNumber}
                        </div>
                        <div style={{ marginTop: 12, fontSize: '0.8rem', color: '#94A3B8' }}>
                          Sort/IFSC Code: <strong style={{ color: '#FFF' }}>{ifscCode}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ANNOUNCEMENTS TAB */}
              {activeTab === 'announcements' && (
                <div>
                  <div className="admin-page-header">
                    <div>
                      <h1 className="admin-page-title">Top Announcement Bar</h1>
                      <p className="admin-page-subtitle">Manage the top header promo notification bar shown to store visitors.</p>
                    </div>
                  </div>

                  <div className="admin-card" style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: 14 }}>Add Announcement Message</h3>
                    <form onSubmit={handleCreateAnnouncement} style={{ display: 'flex', gap: 12 }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Free Express Crate Shipping on orders over $150!"
                        value={annMsg}
                        onChange={(e) => setAnnMsg(e.target.value)}
                        required
                        style={{ flexGrow: 1 }}
                      />
                      <button type="submit" className="enterprise-btn-primary">
                        <Plus style={{ width: 16, height: 16 }} /> Add Message
                      </button>
                    </form>
                  </div>

                  <div className="admin-card">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Active Announcements ({announcements.length})</h3>
                    {announcements.map((a) => (
                      <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#F8FAFC', borderRadius: 8, marginBottom: 10, border: '1px solid #E2E8F0' }}>
                        <div>
                          <strong>{a.message}</strong>
                        </div>
                        <button onClick={() => handleDeleteAnnouncement(a.id)} className="action-icon-btn delete" title="Delete Announcement">
                          <Trash2 style={{ width: 16, height: 16 }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BANNERS TAB */}
              {activeTab === 'banners' && (
                <div>
                  <div className="admin-page-header">
                    <div>
                      <h1 className="admin-page-title">Category Visual Banners</h1>
                      <p className="admin-page-subtitle">Manage 4-card homepage category showcase banners with high-res photos.</p>
                    </div>
                  </div>

                  <div className="admin-card" style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: 14 }}>Add Category Banner</h3>
                    <form onSubmit={handleCreateBanner} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label className="form-label">Banner Title *</label>
                        <input type="text" className="form-input" placeholder="e.g. Custom Cake Props" value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} required />
                      </div>
                      <div>
                        <label className="form-label">Banner Image (Upload or URL) *</label>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input type="text" className="form-input" placeholder="/images/hero_cake_prop.png" value={bannerImage} onChange={(e) => setBannerImage(e.target.value)} required style={{ flexGrow: 1 }} />
                          <label className="enterprise-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer', padding: '8px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                            <Upload style={{ width: 14, height: 14 }} /> Upload
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  setIsImageCompressing(true);
                                  const compressed = await processUploadedImage(file, 1200, 5 * 1024 * 1024);
                                  setBannerImage(compressed);
                                } catch (err) {
                                  await showAlert('Upload Limit', err.message, 'warning');
                                  e.target.value = '';
                                } finally {
                                  setIsImageCompressing(false);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Subtitle Description</label>
                        <input type="text" className="form-input" placeholder="Bespoke polymer prop design & multi-tier dummy configurations." value={bannerSubtitle} onChange={(e) => setBannerSubtitle(e.target.value)} />
                      </div>
                      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="enterprise-btn-primary">
                          <Plus style={{ width: 16, height: 16 }} /> Save Category Banner
                        </button>
                      </div>
                    </form>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                    {banners.map((b) => (
                      <div key={b.id} className="admin-card" style={{ overflow: 'hidden', padding: 0 }}>
                        <div style={{ height: 160, overflow: 'hidden', background: '#F1F5F9' }}>
                          <img src={b.image_url} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: 16 }}>
                          <h4 style={{ margin: '0 0 6px', fontSize: '1.1rem', color: '#0F172A' }}>{b.title}</h4>
                          <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: 14 }}>{b.subtitle}</p>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleDeleteBanner(b.id)} className="action-icon-btn delete" title="Delete Banner">
                              <Trash2 style={{ width: 16, height: 16 }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GALLERY TAB */}
              {activeTab === 'gallery' && (
                <div>
                  <div className="admin-page-header">
                    <div>
                      <h1 className="admin-page-title">Gallery Showcase Items</h1>
                      <p className="admin-page-subtitle">Manage high-res studio showcase photos for the homepage gallery lightbox.</p>
                    </div>
                  </div>

                  <div className="admin-card" style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: 14 }}>Add Gallery Item</h3>
                    <form onSubmit={handleCreateGallery} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                      <div>
                        <label className="form-label">Photo Title *</label>
                        <input type="text" className="form-input" placeholder="e.g. Aurelia 4-Tier Display" value={galleryTitle} onChange={(e) => setGalleryTitle(e.target.value)} required />
                      </div>
                      <div>
                        <label className="form-label">Category Tag *</label>
                        <input type="text" className="form-input" placeholder="e.g. Wedding Showcase" value={galleryCat} onChange={(e) => setGalleryCat(e.target.value)} required />
                      </div>
                      <div>
                        <label className="form-label">Photo (Upload or URL) *</label>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input type="text" className="form-input" placeholder="/images/wedding_tier_prop.png" value={galleryImg} onChange={(e) => setGalleryImg(e.target.value)} required style={{ flexGrow: 1 }} />
                          <label className="enterprise-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer', padding: '8px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                            <Upload style={{ width: 14, height: 14 }} /> Upload
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  setIsImageCompressing(true);
                                  const compressed = await processUploadedImage(file, 1000, 5 * 1024 * 1024);
                                  setGalleryImg(compressed);
                                } catch (err) {
                                  await showAlert('Upload Limit', err.message, 'warning');
                                  e.target.value = '';
                                } finally {
                                  setIsImageCompressing(false);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="enterprise-btn-primary">
                          <Plus style={{ width: 16, height: 16 }} /> Add Gallery Showcase Photo
                        </button>
                      </div>
                    </form>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
                    {galleryItems.map((g) => (
                      <div key={g.id} className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ height: 180, background: '#F1F5F9' }}>
                          <img src={g.image_url} alt={g.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: 14 }}>
                          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#0FB3B6', fontWeight: 700 }}>{g.category}</span>
                          <h4 style={{ margin: '4px 0 10px', fontSize: '1rem', color: '#0F172A' }}>{g.title}</h4>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleDeleteGallery(g.id)} className="action-icon-btn delete" title="Delete Item">
                              <Trash2 style={{ width: 16, height: 16 }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* REVIEWS MODERATION TAB */}
              {activeTab === 'reviews' && (
                <div>
                  <div className="admin-page-header">
                    <div>
                      <h1 className="admin-page-title">Customer Reviews Verification</h1>
                      <p className="admin-page-subtitle">Verify pending reviews submitted by customers before they are published on the live storefront.</p>
                    </div>
                  </div>

                  <div className="admin-card">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Rating & Review</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedReviews.length === 0 ? (
                          <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: 30, color: '#64748B' }}>No customer reviews submitted yet.</td>
                          </tr>
                        ) : (
                          paginatedReviews.map((r) => (
                            <tr key={r.id}>
                              <td>
                                <strong>{r.reviewer_name}</strong>
                                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{r.reviewer_role}</div>
                              </td>
                              <td style={{ maxWidth: 360 }}>
                                <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
                                  {[...Array(r.rating || 5)].map((_, i) => (
                                    <Star key={i} style={{ width: 14, height: 14, fill: '#0FB3B6', color: '#0FB3B6' }} />
                                  ))}
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0 }}>"{r.comment}"</p>
                              </td>
                              <td>
                                {r.is_verified === 1 ? (
                                  <span className="status-pill green">Published (Verified)</span>
                                ) : (
                                  <span className="status-pill blue" style={{ background: 'rgba(54, 223, 226, 0.15)', color: '#0FB3B6', border: '1px solid rgba(54, 223, 226, 0.35)' }}>
                                    Pending Approval
                                  </span>
                                )}
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: 8 }}>
                                  {r.is_verified === 0 ? (
                                    <button
                                      onClick={() => handleVerifyReview(r.id, true)}
                                      className="enterprise-btn-primary"
                                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                                    >
                                      <Check style={{ width: 14, height: 14 }} /> Verify & Publish
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleVerifyReview(r.id, false)}
                                      className="enterprise-btn-secondary"
                                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                                    >
                                      Unpublish
                                    </button>
                                  )}
                                  <button onClick={() => handleDeleteReview(r.id)} className="action-icon-btn delete" title="Delete Review">
                                    <Trash2 style={{ width: 16, height: 16 }} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderTop: '1px solid #E2E8F0', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                      Showing <strong>{reviews.length > 0 ? (reviewPage - 1) * reviewsPerPage + 1 : 0}</strong> to <strong>{Math.min(reviewPage * reviewsPerPage, reviews.length)}</strong> of <strong>{reviews.length}</strong> reviews
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        disabled={reviewPage <= 1}
                        onClick={() => setReviewPage(p => Math.max(1, p - 1))}
                        className="enterprise-btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.8rem', opacity: reviewPage <= 1 ? 0.5 : 1, cursor: reviewPage <= 1 ? 'not-allowed' : 'pointer' }}
                      >
                        Previous
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', padding: '0 6px' }}>
                        Page {reviewPage} of {totalReviewPages}
                      </span>
                      <button
                        disabled={reviewPage >= totalReviewPages}
                        onClick={() => setReviewPage(p => Math.min(totalReviewPages, p + 1))}
                        className="enterprise-btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.8rem', opacity: reviewPage >= totalReviewPages ? 0.5 : 1, cursor: reviewPage >= totalReviewPages ? 'not-allowed' : 'pointer' }}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* PRODUCT ADD/EDIT MODAL */}
      {isProductModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-content" style={{ padding: 32, maxWidth: 680, width: '92vw' }}>
            <button onClick={() => setIsProductModalOpen(false)} className="modal-close-btn">
              <X style={{ width: 20, height: 20 }} />
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: 20 }}>
              {editingProductId ? 'Edit Prop Specification' : 'Create New Prop Entry'}
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
                  <label className="form-label">Badge Tag</label>
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
                <label className="form-label">Prop Image (Upload File or Enter URL) *</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    placeholder="/images/wedding_tier_prop.png"
                    required
                    style={{ flexGrow: 1 }}
                  />
                  <label className="enterprise-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '10px 14px', whiteSpace: 'nowrap' }}>
                    <Upload style={{ width: 16, height: 16 }} />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          setIsImageCompressing(true);
                          const compressed = await processUploadedImage(file, 1000, 5 * 1024 * 1024);
                          setProdImage(compressed);
                        } catch (err) {
                          await showAlert('Upload Limit', err.message, 'warning');
                          e.target.value = '';
                        } finally {
                          setIsImageCompressing(false);
                        }
                      }}
                    />
                  </label>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: 4 }}>
                  Max 5MB file limit • Auto-compressed for optimal performance.
                </div>
                {prodImage && (
                  <div style={{ marginTop: 8 }}>
                    <img src={prodImage} alt="Prop Preview" style={{ height: 64, borderRadius: 6, border: '1px solid #CBD5E1', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Product Description *</label>
                <textarea className="form-input" rows={3} value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="enterprise-btn-secondary">Cancel</button>
                <button type="submit" className="enterprise-btn-primary">
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
          <div className="modal-content" style={{ padding: 32, maxWidth: 640, width: '92vw' }}>
            <button onClick={() => setSelectedOrder(null)} className="modal-close-btn">
              <X style={{ width: 20, height: 20 }} />
            </button>
            <div style={{ marginBottom: 20 }}>
              <code style={{ fontSize: '1.2rem', fontWeight: 800, background: '#F1F5F9', padding: '4px 10px', borderRadius: 6, color: '#0F172A' }}>
                {selectedOrder.id}
              </code>
              <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: 4 }}>Placed on {new Date(selectedOrder.date).toLocaleDateString()}</div>
            </div>

            <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 8, marginBottom: 20, fontSize: '0.88rem', border: '1px solid #E2E8F0' }}>
              <div><strong>Customer:</strong> {selectedOrder.customerName} ({selectedOrder.customerEmail})</div>
              <div style={{ marginTop: 4 }}><strong>Address:</strong> {selectedOrder.shippingAddress}</div>
              <div style={{ marginTop: 4 }}><strong>Bank Wire UTR:</strong> <code>{selectedOrder.utrNumber}</code></div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>Order Line Items</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {(selectedOrder.items || []).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', borderBottom: '1px solid #F1F5F9', paddingBottom: 8 }}>
                  <span>{item.name} × {item.qty}</span>
                  <strong>${(parseFloat(item.price || 0) * parseInt(item.qty || 1)).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #E2E8F0', paddingTop: 12 }}>
              <span>Total Payable Amount:</span>
              <strong style={{ fontSize: '1.4rem', color: '#0F172A' }}>${parseFloat(selectedOrder.total || 0).toFixed(2)}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
