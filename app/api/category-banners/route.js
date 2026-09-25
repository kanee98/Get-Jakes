import { NextResponse } from 'next/server';
import pool from '@/database/db.js';

export const dynamic = 'force-dynamic';

const DEFAULT_CATEGORY_BANNERS = [
  {
    id: 1,
    title: 'Custom Cake Props',
    subtitle: 'Bespoke polymer prop design & multi-tier dummy configurations.',
    image_url: '/images/hero_cake_prop.png',
    link_url: '#customQuote',
    category_key: 'custom'
  },
  {
    id: 2,
    title: 'Dummy Cake Tiers',
    subtitle: 'Pre-coated smooth & textured 1 to 5 tier display dummies.',
    image_url: '/images/wedding_tier_prop.png',
    link_url: '#shop',
    category_key: 'wedding'
  },
  {
    id: 3,
    title: 'Food Studio Kits',
    subtitle: 'Realistic faux cake slices & photo backdrop risers.',
    image_url: '/images/photo_prop_set.png',
    link_url: '#shop',
    category_key: 'photography'
  },
  {
    id: 4,
    title: 'Display Pedestals',
    subtitle: 'Architectural ribbed cylinders & plaster riser sets.',
    image_url: '/images/pedestal_prop_set.png',
    link_url: '#shop',
    category_key: 'pedestal'
  }
];

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM category_banners ORDER BY id ASC');
    if (rows && rows.length > 0) {
      return NextResponse.json(rows);
    }
    return NextResponse.json(DEFAULT_CATEGORY_BANNERS);
  } catch (err) {
    return NextResponse.json(DEFAULT_CATEGORY_BANNERS);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, subtitle, image_url, link_url, category_key } = body;

    if (!title || !image_url) {
      return NextResponse.json({ error: 'Title and image URL are required' }, { status: 400 });
    }

    const [result] = await pool.query(
      'INSERT INTO category_banners (title, subtitle, image_url, link_url, category_key) VALUES (?, ?, ?, ?, ?)',
      [title, subtitle || '', image_url, link_url || '#shop', category_key || 'wedding']
    );

    const [rows] = await pool.query('SELECT * FROM category_banners WHERE id = ?', [result.insertId]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    console.error('Create Category Banner Error:', err);
    return NextResponse.json({ error: 'Failed to create category banner' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    await pool.query('DELETE FROM category_banners WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete category banner' }, { status: 500 });
  }
}
