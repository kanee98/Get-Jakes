import { NextResponse } from 'next/server';
import pool from '@/database/db.js';

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

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC');
    return NextResponse.json(rows.map(formatProduct));
  } catch (err) {
    console.error('Fetch Products Error:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, name, category, price, originalPrice, tag, description, specs, image } = body;

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

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    return NextResponse.json(formatProduct(rows[0]), { status: 201 });
  } catch (err) {
    console.error('Create Product Error:', err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, category, price, originalPrice, tag, description, specs, image } = body;

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

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(formatProduct(rows[0]));
  } catch (err) {
    console.error('Update Product Error:', err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: `Deleted product ${id}` });
  } catch (err) {
    console.error('Delete Product Error:', err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
