import { NextResponse } from 'next/server';
import pool from '@/database/db.js';

export const dynamic = 'force-dynamic';

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

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC');
    if (rows && rows.length > 0) {
      return NextResponse.json(rows.map(formatProduct));
    }
    return NextResponse.json(DEFAULT_PRODUCTS);
  } catch (err) {
    console.error('Fetch Products Error (returning fallback):', err);
    return NextResponse.json(DEFAULT_PRODUCTS);
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
