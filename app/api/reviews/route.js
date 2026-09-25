import { NextResponse } from 'next/server';
import pool from '@/database/db.js';

export const dynamic = 'force-dynamic';

const DEFAULT_VERIFIED_REVIEWS = [
  {
    id: 1,
    reviewer_name: 'Renee C.',
    reviewer_role: 'Luxury Event Stylist, Sydney',
    rating: 5,
    comment: 'The 4-tier Aurelia prop survived 3 outdoor summer wedding expos without a single mark. The polymer coating is unbelievably durable.',
    is_verified: 1
  },
  {
    id: 2,
    reviewer_name: 'Marcus T.',
    reviewer_role: 'Commercial Food Photographer',
    rating: 5,
    comment: 'Get Jakes studio photo kits elevated our commercial bakery portfolio photos. Zero reflection glare and perfectly clean texture.',
    is_verified: 1
  },
  {
    id: 3,
    reviewer_name: 'Sarah & David',
    reviewer_role: 'Grand Ballroom Planners',
    rating: 5,
    comment: 'Fast crate shipping and the custom quote preview gave us total confidence for our grand ballroom hotel installation.',
    is_verified: 1
  }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get('admin') === 'true';

  try {
    const query = isAdmin
      ? 'SELECT * FROM reviews ORDER BY id DESC'
      : 'SELECT * FROM reviews WHERE is_verified = 1 ORDER BY id DESC';

    const [rows] = await pool.query(query);
    if (rows && rows.length > 0) {
      return NextResponse.json(rows);
    }
    return NextResponse.json(isAdmin ? DEFAULT_VERIFIED_REVIEWS : DEFAULT_VERIFIED_REVIEWS);
  } catch (err) {
    return NextResponse.json(DEFAULT_VERIFIED_REVIEWS);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, reviewerName, reviewerRole, rating, comment } = body;

    if (!reviewerName || !comment) {
      return NextResponse.json({ error: 'Name and review comment are required' }, { status: 400 });
    }

    const [result] = await pool.query(
      'INSERT INTO reviews (user_id, reviewer_name, reviewer_role, rating, comment, is_verified) VALUES (?, ?, ?, ?, ?, 0)',
      [userId || null, reviewerName, reviewerRole || 'Verified Customer', rating || 5, comment]
    );

    const [rows] = await pool.query('SELECT * FROM reviews WHERE id = ?', [result.insertId]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    console.error('Submit Review Error:', err);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, isVerified } = body;

    if (!id) {
      return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
    }

    await pool.query('UPDATE reviews SET is_verified = ? WHERE id = ?', [isVerified ? 1 : 0, id]);
    const [rows] = await pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('Verify Review Error:', err);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
    }

    await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete Review Error:', err);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
