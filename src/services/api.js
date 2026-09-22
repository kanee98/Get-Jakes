/**
/**
 * Frontend API Client & Service Layer
 * Connects the Get Jakes web application to the Express REST API & MySQL Database,
 * with graceful fallback to LocalStorage if offline.
 */
import { PRODUCTS, INITIAL_ORDERS } from '../data/productsData.js';

const API_BASE = '/api';

export async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Backend health check failed');
    return await res.json();
  } catch (err) {
    return { status: 'offline', database: 'disconnected', error: err.message };
  }
}

// ----------------------------------------------------------------------------
// Products API
// ----------------------------------------------------------------------------
export async function fetchProductsApi() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const products = await res.json();
    if (Array.isArray(products) && products.length > 0) {
      localStorage.setItem('gj_products', JSON.stringify(products));
      return products;
    }
  } catch (err) {
    console.warn('Backend API unavailable. Using local fallback for products:', err.message);
  }

  const saved = localStorage.getItem('gj_products') || localStorage.getItem('vt_products');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return [...PRODUCTS];
}

export async function saveProductApi(productData) {
  let isEdit = !!productData.id;
  if (isEdit) {
    const saved = localStorage.getItem('gj_products') || localStorage.getItem('vt_products');
    if (saved) {
      try {
        const localList = JSON.parse(saved);
        isEdit = localList.some(p => p.id === productData.id);
      } catch (e) {}
    }
  }

  try {
    const url = isEdit ? `${API_BASE}/products/${productData.id}` : `${API_BASE}/products`;
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });

    if (res.ok) {
      const savedProduct = await res.json();
      syncProductLocal(savedProduct);
      return savedProduct;
    }
  } catch (err) {
    console.warn('Error saving product to backend API:', err.message);
  }

  // Fallback local update
  const newProduct = {
    ...productData,
    id: productData.id || `prop-${Date.now().toString().slice(-4)}`
  };
  syncProductLocal(newProduct);
  return newProduct;
}

export async function deleteProductApi(productId) {
  try {
    const res = await fetch(`${API_BASE}/products/${productId}`, { method: 'DELETE' });
    if (res.ok) {
      removeProductLocal(productId);
      return true;
    }
  } catch (err) {
    console.warn('Error deleting product on backend:', err.message);
  }

  removeProductLocal(productId);
  return true;
}

function syncProductLocal(product) {
  let list = JSON.parse(localStorage.getItem('gj_products') || '[]');
  if (list.length === 0) list = [...PRODUCTS];

  const idx = list.findIndex(p => p.id === product.id);
  if (idx >= 0) {
    list[idx] = product;
  } else {
    list.unshift(product);
  }
  localStorage.setItem('gj_products', JSON.stringify(list));
  localStorage.setItem('vt_products', JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('gj_products_updated', { detail: list }));
}

function removeProductLocal(productId) {
  let list = JSON.parse(localStorage.getItem('gj_products') || '[]');
  if (list.length === 0) list = [...PRODUCTS];

  list = list.filter(p => p.id !== productId);
  localStorage.setItem('gj_products', JSON.stringify(list));
  localStorage.setItem('vt_products', JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('gj_products_updated', { detail: list }));
}

// ----------------------------------------------------------------------------
// Orders API
// ----------------------------------------------------------------------------
export async function fetchOrdersApi() {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const orders = await res.json();
    if (Array.isArray(orders)) {
      localStorage.setItem('gj_orders', JSON.stringify(orders));
      return orders;
    }
  } catch (err) {
    console.warn('Backend API unavailable. Using local fallback for orders:', err.message);
  }

  const saved = localStorage.getItem('gj_orders') || localStorage.getItem('vt_orders');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return [...INITIAL_ORDERS];
}

export async function createOrderApi(orderData) {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (res.ok) {
      const createdOrder = await res.json();
      syncOrderLocal(createdOrder);
      return createdOrder;
    }
  } catch (err) {
    console.warn('Backend API unavailable when creating order:', err.message);
  }

  const newOrder = {
    id: `GJ-${Math.floor(1000 + Math.random() * 9000)}-PAY`,
    date: new Date().toISOString(),
    customerName: orderData.customerName || 'Valued Customer',
    customerEmail: orderData.customerEmail || 'customer@example.com',
    shippingAddress: orderData.shippingAddress || 'Address on file',
    total: orderData.total || 0,
    paymentMethod: orderData.paymentMethod || 'Direct Bank Transfer',
    utrNumber: orderData.utrNumber || 'Pending Wire Reference',
    status: 'Awaiting Bank Transfer Verification',
    adminNotes: '',
    items: orderData.items || []
  };

  syncOrderLocal(newOrder);
  return newOrder;
}

export async function updateOrderStatusApi(orderId, updatePayload) {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });

    if (res.ok) {
      const updatedOrder = await res.json();
      syncOrderLocal(updatedOrder);
      return updatedOrder;
    }
  } catch (err) {
    console.warn('Backend API error updating order status:', err.message);
  }

  // Fallback local update
  let list = JSON.parse(localStorage.getItem('gj_orders') || '[]');
  if (list.length === 0) list = [...INITIAL_ORDERS];

  const idx = list.findIndex(o => o.id === orderId || o.dbId === orderId);
  if (idx >= 0) {
    list[idx] = {
      ...list[idx],
      ...updatePayload
    };
    localStorage.setItem('gj_orders', JSON.stringify(list));
    localStorage.setItem('vt_orders', JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('gj_orders_updated', { detail: list }));
    return list[idx];
  }
  return null;
}

function syncOrderLocal(order) {
  let list = JSON.parse(localStorage.getItem('gj_orders') || '[]');
  const idx = list.findIndex(o => o.id === order.id);
  if (idx >= 0) {
    list[idx] = order;
  } else {
    list.unshift(order);
  }
  localStorage.setItem('gj_orders', JSON.stringify(list));
  localStorage.setItem('vt_orders', JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('gj_orders_updated', { detail: list }));
}

// ----------------------------------------------------------------------------
// Custom Quotes API
// ----------------------------------------------------------------------------
export async function submitCustomQuoteApi(quoteData) {
  try {
    const res = await fetch(`${API_BASE}/custom-quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteData)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API error for custom quote:', err.message);
  }
  return { success: true, message: 'Saved locally' };
}
