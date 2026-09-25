import { NextResponse } from 'next/server';
import pool from '@/database/db.js';

export const dynamic = 'force-dynamic';

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
      `INSERT INTO custom_quotes (contact_info, tiers_count, finish_texture, estimated_price, status)
       VALUES (?, ?, ?, ?, ?)`,
      [contactInfo, tiersCount || 3, finishTexture || 'smooth', estimatedPrice || 0, 'Pending']
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

export async function PUT(request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    await pool.query('UPDATE custom_quotes SET status = ? WHERE id = ?', [status, id]);
    return NextResponse.json({ success: true, message: 'Custom quote status updated successfully' });
  } catch (err) {
    console.error('Update Custom Quote Status Error:', err);
    return NextResponse.json({ error: 'Failed to update quote status' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await pool.query('DELETE FROM custom_quotes WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Custom quote deleted successfully' });
  } catch (err) {
    console.error('Delete Custom Quote Error:', err);
    return NextResponse.json({ error: 'Failed to delete custom quote' }, { status: 500 });
  }
}
