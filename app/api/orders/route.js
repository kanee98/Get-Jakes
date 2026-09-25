import { NextResponse } from 'next/server';
import pool from '@/database/db.js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');

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
          items: items.map((item) => ({
            id: item.product_id,
            name: item.product_name,
            price: parseFloat(item.unit_price),
            qty: item.quantity,
            image: item.image_url
          }))
        };
      })
    );

    return NextResponse.json(formattedOrders);
  } catch (err) {
    console.error('Fetch Orders Error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const body = await request.json();
    const { customerName, customerEmail, shippingAddress, total, items, paymentMethod, utrNumber } = body;

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
      items: itemRows.map((item) => ({
        id: item.product_id,
        name: item.product_name,
        price: parseFloat(item.unit_price),
        qty: item.quantity,
        image: item.image_url
      }))
    };

    return NextResponse.json(createdOrder, { status: 201 });
  } catch (err) {
    await connection.rollback();
    console.error('Create Order Error:', err);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status, utrNumber, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

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

    const [updatedRows] = await pool.query('SELECT * FROM orders WHERE order_ref_code = ? OR id = ?', [id, id]);
    if (updatedRows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const [itemRows] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [updatedRows[0].id]);

    return NextResponse.json({
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
      items: itemRows.map((i) => ({
        id: i.product_id,
        name: i.product_name,
        price: parseFloat(i.unit_price),
        qty: i.quantity,
        image: i.image_url
      }))
    });
  } catch (err) {
    console.error('Update Order Status Error:', err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
