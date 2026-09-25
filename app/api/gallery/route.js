import { NextResponse } from 'next/server';
import pool from '@/database/db.js';

export const dynamic = 'force-dynamic';

const DEFAULT_GALLERY_ITEMS = [
  { id: 1, title: 'Aurelia 4-Tier Ballroom Display', category: 'Wedding Showcase', image_url: '/images/wedding_tier_prop.png' },
  { id: 2, title: 'Ophelia Cyan & Gold Leaf Statement', category: 'Studio Portfolio', image_url: '/images/hero_cake_prop.png' },
  { id: 3, title: 'Pastel Photography Prop Set', category: 'Food Studio Kit', image_url: '/images/photo_prop_set.png' },
  { id: 4, title: 'Imperial Ribbed Cylinder Risers', category: 'Display Pedestal', image_url: '/images/pedestal_prop_set.png' }
];

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM gallery_items ORDER BY id DESC');
    if (rows && rows.length > 0) {
      return NextResponse.json(rows);
    }
    return NextResponse.json(DEFAULT_GALLERY_ITEMS);
  } catch (err) {
    return NextResponse.json(DEFAULT_GALLERY_ITEMS);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, category, image_url } = body;

    if (!title || !image_url) {
      return NextResponse.json({ error: 'Title and image URL are required' }, { status: 400 });
    }

    const [result] = await pool.query(
      'INSERT INTO gallery_items (title, category, image_url) VALUES (?, ?, ?)',
      [title, category || 'Studio Showcase', image_url]
    );

    const [rows] = await pool.query('SELECT * FROM gallery_items WHERE id = ?', [result.insertId]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    console.error('Create Gallery Item Error:', err);
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    await pool.query('DELETE FROM gallery_items WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}
