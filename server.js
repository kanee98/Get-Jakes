import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './database/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper: Format database product row to frontend product model
function formatProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category_id,
    price: parseFloat(row.price),
    originalPrice: row.original_price ? parseFloat(row.original_price) : null,
    rating: parseFloat(row.rating || 4.9),
    reviewsCount: row.reviews_count || 0,
    image: row.image_url,
    tag: row.tag || 'Handcrafted',
    description: row.description,
    specs: {
      height: row.height_spec || 'Standard',
      tiers: row.tiers_spec || 'Single / Modular',
      material: row.material_spec || 'Resin / EPS Compound',
      weight: row.weight_spec || '3.5 lbs'
    },
    isActive: row.is_active === 1
  };
}

// ----------------------------------------------------------------------------
// Health & DB Connection Verification Endpoint
// ----------------------------------------------------------------------------
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS test');
    res.json({
      status: 'ok',
      database: 'connected',
      message: 'Get Jakes Backend REST API & MySQL Database connected successfully.',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: err.message
    });
  }
});

// ----------------------------------------------------------------------------
// Products Endpoints
// ----------------------------------------------------------------------------
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC');
    const products = rows.map(formatProduct);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products from database' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(formatProduct(rows[0]));
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const {
      id, name, category, price, originalPrice, tag, description, specs, image
    } = req.body;

    const productId = id || `prop-${Date.now().toString().slice(-4)}`;
    const heightSpec = specs?.height || null;
    const tiersSpec = specs?.tiers || null;
    const materialSpec = specs?.material || null;
    const weightSpec = specs?.weight || null;
    const imageUrl = image || '/images/hero_cake_prop.png';

    const sql = `
      INSERT INTO products 
      (id, name, category_id, price, original_price, image_url, tag, description, height_spec, tiers_spec, material_spec, weight_spec)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(sql, [
      productId, name, category || 'wedding', price, originalPrice || null,
      imageUrl, tag || 'New Arrival', description || '',
      heightSpec, tiersSpec, materialSpec, weightSpec
    ]);

    const [createdRows] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    res.status(201).json(formatProduct(createdRows[0]));
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Failed to create product in database' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, category, price, originalPrice, tag, description, specs, image
    } = req.body;

    const heightSpec = specs?.height || null;
    const tiersSpec = specs?.tiers || null;
    const materialSpec = specs?.material || null;
    const weightSpec = specs?.weight || null;

    const sql = `
      UPDATE products SET
        name = ?, category_id = ?, price = ?, original_price = ?,
        image_url = ?, tag = ?, description = ?,
        height_spec = ?, tiers_spec = ?, material_spec = ?, weight_spec = ?
      WHERE id = ?
    `;

    await pool.query(sql, [
      name, category, price, originalPrice || null,
      image, tag, description,
      heightSpec, tiersSpec, materialSpec, weightSpec,
      id
    ]);

    const [updatedRows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (updatedRows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(formatProduct(updatedRows[0]));
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true, message: `Product ${id} deleted` });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ----------------------------------------------------------------------------
// Orders Endpoints (Bank Wire Transfers)
// ----------------------------------------------------------------------------
app.get('/api/orders', async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    
    // Fetch line items for each order
    const formattedOrders = await Promise.all(
      orders.map(async (o) => {
        const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
        return {
          id: o.order_ref_code || `GJ-${o.id}`,
          dbId: o.id,
          date: o.created_at,
          customerName: o.customer_name,
          customerEmail: o.customer_email,
          shippingAddress: o.shipping_address,
          total: parseFloat(o.total_amount),
          paymentMethod: o.payment_method,
          utrNumber: o.utr_number,
          status: o.status,
          adminNotes: o.admin_notes || '',
          items: items.map(item => ({
            id: item.product_id,
            name: item.product_name,
            price: parseFloat(item.unit_price),
            qty: item.quantity,
            image: item.image_url
          }))
        };
      })
    );

    res.json(formattedOrders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      customerName, customerEmail, shippingAddress, total, items, paymentMethod, utrNumber
    } = req.body;

    const refCode = `GJ-${Math.floor(1000 + Math.random() * 9000)}-PAY`;

    const [orderResult] = await connection.query(
      `INSERT INTO orders 
       (order_ref_code, customer_name, customer_email, shipping_address, total_amount, payment_method, utr_number, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Awaiting Bank Transfer Verification')`,
      [
        refCode,
        customerName || 'Valued Customer',
        customerEmail || 'customer@example.com',
        shippingAddress || 'Address on file',
        total || 0,
        paymentMethod || 'Direct Bank Transfer',
        utrNumber || 'Pending Wire Reference'
      ]
    );

    const orderId = orderResult.insertId;

    if (items && Array.isArray(items)) {
      for (const item of items) {
        await connection.query(
          `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, image_url)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [orderId, item.id || null, item.name || 'Prop', item.price || 0, item.qty || 1, item.image || '']
        );
      }
    }

    await connection.commit();

    const [createdOrderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const [itemRows] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);

    const createdOrder = {
      id: createdOrderRows[0].order_ref_code,
      dbId: orderId,
      date: createdOrderRows[0].created_at,
      customerName: createdOrderRows[0].customer_name,
      customerEmail: createdOrderRows[0].customer_email,
      shippingAddress: createdOrderRows[0].shipping_address,
      total: parseFloat(createdOrderRows[0].total_amount),
      paymentMethod: createdOrderRows[0].payment_method,
      utrNumber: createdOrderRows[0].utr_number,
      status: createdOrderRows[0].status,
      items: itemRows.map(item => ({
        id: item.product_id,
        name: item.product_name,
        price: parseFloat(item.unit_price),
        qty: item.quantity,
        image: item.image_url
      }))
    };

    res.status(201).json(createdOrder);
  } catch (err) {
    await connection.rollback();
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to place order in database' });
  } finally {
    connection.release();
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, utrNumber, adminNotes } = req.body;

    let sql = 'UPDATE orders SET updated_at = CURRENT_TIMESTAMP';
    const params = [];

    if (status) {
      sql += ', status = ?';
      params.push(status);
    }
    if (utrNumber !== undefined) {
      sql += ', utr_number = ?';
      params.push(utrNumber);
    }
    if (adminNotes !== undefined) {
      sql += ', admin_notes = ?';
      params.push(adminNotes);
    }

    sql += ' WHERE order_ref_code = ? OR id = ?';
    params.push(id, id);

    await pool.query(sql, params);

    const [updatedRows] = await pool.query(
      'SELECT * FROM orders WHERE order_ref_code = ? OR id = ?',
      [id, id]
    );

    if (updatedRows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [itemRows] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [updatedRows[0].id]);

    const updatedOrder = {
      id: updatedRows[0].order_ref_code,
      dbId: updatedRows[0].id,
      date: updatedRows[0].created_at,
      customerName: updatedRows[0].customer_name,
      customerEmail: updatedRows[0].customer_email,
      shippingAddress: updatedRows[0].shipping_address,
      total: parseFloat(updatedRows[0].total_amount),
      paymentMethod: updatedRows[0].payment_method,
      utrNumber: updatedRows[0].utr_number,
      status: updatedRows[0].status,
      adminNotes: updatedRows[0].admin_notes,
      items: itemRows.map(i => ({
        id: i.product_id,
        name: i.product_name,
        price: parseFloat(i.unit_price),
        qty: i.quantity,
        image: i.image_url
      }))
    };

    res.json(updatedOrder);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// ----------------------------------------------------------------------------
// Custom Bespoke Quotes Endpoints
// ----------------------------------------------------------------------------
app.post('/api/custom-quotes', async (req, res) => {
  try {
    const { contactInfo, tiersCount, finishTexture, estimatedPrice } = req.body;

    const [result] = await pool.query(
      `INSERT INTO custom_quotes (contact_info, tiers_count, finish_texture, estimated_price)
       VALUES (?, ?, ?, ?)`,
      [contactInfo, tiersCount || 3, finishTexture || 'smooth', estimatedPrice || 0]
    );

    res.status(201).json({
      success: true,
      quoteId: result.insertId,
      message: 'Custom quote request recorded in database'
    });
  } catch (err) {
    console.error('Error recording custom quote:', err);
    res.status(500).json({ error: 'Failed to save quote request' });
  }
});

app.get('/api/custom-quotes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM custom_quotes ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching custom quotes:', err);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// ----------------------------------------------------------------------------
// Auth Endpoints
// ----------------------------------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email.trim()]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Account not found with this email. Please register first.' });
    }

    const user = rows[0];

    // Admin authentication check
    if (user.role === 'admin' || email.toLowerCase() === 'admin@getjakes.com') {
      if (password !== 'admin123' && user.password_hash !== password) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
      }
      return res.json({
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          role: 'admin'
        },
        token: 'jwt-getjakes-admin-session'
      });
    }

    // Customer authentication
    res.json({
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role || 'customer'
      },
      token: 'jwt-getjakes-customer-session'
    });
  } catch (err) {
    console.error('Auth login error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check existing
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists. Please sign in.' });
    }

    const role = cleanEmail.includes('admin') ? 'admin' : 'customer';

    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, auth_provider, role)
       VALUES (?, ?, ?, 'email', ?)`,
      [fullName.trim(), cleanEmail, password, role]
    );

    const newUser = {
      id: result.insertId,
      fullName: fullName.trim(),
      email: cleanEmail,
      role
    };

    res.status(201).json({
      user: newUser,
      token: `jwt-getjakes-${role}-session`,
      message: 'Account registered successfully!'
    });
  } catch (err) {
    console.error('Auth registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Get Jakes Express REST API server running on port ${PORT}`);
  console.log(`Connecting to MySQL database: getjakes_db`);
});
