import { NextResponse } from 'next/server';
import pool from '@/database/db.js';

export const dynamic = 'force-dynamic';

const DEFAULT_ANNOUNCEMENTS = [
  { id: 1, message: 'Free Express Crate Shipping on orders over $150!', is_active: 1 }
];

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM announcements ORDER BY id DESC');
    if (rows && rows.length > 0) {
      return NextResponse.json(rows);
    }
    return NextResponse.json(DEFAULT_ANNOUNCEMENTS);
  } catch (err) {
    return NextResponse.json(DEFAULT_ANNOUNCEMENTS);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { message } = body;
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const [result] = await pool.query('INSERT INTO announcements (message) VALUES (?)', [message]);
    const [rows] = await pool.query('SELECT * FROM announcements WHERE id = ?', [result.insertId]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    console.error('Create Announcement Error:', err);
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    await pool.query('DELETE FROM announcements WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
  }
}
