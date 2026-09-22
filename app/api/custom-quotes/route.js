import { NextResponse } from 'next/server';
import pool from '@/database/db.js';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM custom_quotes ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (err) {
    console.error('Fetch Custom Quotes Error:', err);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { contactInfo, tiersCount, finishTexture, estimatedPrice } = await request.json();

    const [result] = await pool.query(
      `INSERT INTO custom_quotes (contact_info, tiers_count, finish_texture, estimated_price)
       VALUES (?, ?, ?, ?)`,
      [contactInfo, tiersCount || 3, finishTexture || 'smooth', estimatedPrice || 0]
    );

    return NextResponse.json({
      success: true,
      quoteId: result.insertId,
      message: 'Custom quote request recorded in database'
    }, { status: 201 });
  } catch (err) {
    console.error('Record Custom Quote Error:', err);
    return NextResponse.json({ error: 'Failed to save custom quote' }, { status: 500 });
  }
}
