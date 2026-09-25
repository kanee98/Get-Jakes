import { NextResponse } from 'next/server';
import pool from '@/database/db.js';

export const dynamic = 'force-dynamic';

const DEFAULT_VERIFIED_REVIEWS = [
  {
    id: 1,
    reviewer_name: 'Bonnie D.',
    reviewer_role: 'Verified Customer',
    rating: 5,
    comment: 'Great quality and loved they were pre cut! Saved sooo much time!',
    image_url: '/images/photo_prop_set.png',
    is_verified: 1
  },
  {
    id: 2,
    reviewer_name: 'Jade G.',
    reviewer_role: 'Verified Customer',
    rating: 5,
    comment: 'Loved this product! Colours were great and picture was very clear. Customer support was great...',
    image_url: '/images/hero_cake_prop.png',
    is_verified: 1
  },
  {
    id: 3,
    reviewer_name: 'Megan R.',
    reviewer_role: 'Verified Customer',
    rating: 5,
    comment: 'Absolutely fabulous! Turn around and communication with the team was exceptional. As a novice...',
    image_url: '/images/wedding_tier_prop.png',
    is_verified: 1
  },
  {
    id: 4,
    reviewer_name: 'Peter R.',
    reviewer_role: 'Verified Customer',
    rating: 5,
    comment: 'Very happy. The image was crisp and the colours strong. Great to have the option of picking up in...',
    image_url: '/images/pedestal_prop_set.png',
    is_verified: 1
  }
];

// Helper to ensure table schema contains image_url and is_deleted
async function ensureReviewColumns() {
  try {
    await pool.query("ALTER TABLE reviews ADD COLUMN image_url LONGTEXT NULL");
  } catch (e) {
    // Ignore if column already exists
  }
  try {
    await pool.query("ALTER TABLE reviews ADD COLUMN is_deleted TINYINT(1) DEFAULT 0");
  } catch (e) {
    // Ignore if column already exists
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get('admin') === 'true';

  try {
    await ensureReviewColumns();
    const query = isAdmin
      ? 'SELECT * FROM reviews WHERE (is_deleted = 0 OR is_deleted IS NULL) ORDER BY id DESC'
      : 'SELECT * FROM reviews WHERE is_verified = 1 AND (is_deleted = 0 OR is_deleted IS NULL) ORDER BY id DESC';

    const [rows] = await pool.query(query);
    if (rows && rows.length > 0) {
      return NextResponse.json(rows);
    }
    return NextResponse.json(DEFAULT_VERIFIED_REVIEWS);
  } catch (err) {
    return NextResponse.json(DEFAULT_VERIFIED_REVIEWS);
  }
}

export async function POST(request) {
  try {
    await ensureReviewColumns();
    const body = await request.json();
    const { userId, reviewerName, reviewerRole, rating, comment, imageUrl, image_url } = body;
    const finalImage = imageUrl || image_url || null;

    if (!reviewerName || !comment) {
      return NextResponse.json({ error: 'Name and review comment are required' }, { status: 400 });
    }

    const [result] = await pool.query(
      'INSERT INTO reviews (user_id, reviewer_name, reviewer_role, rating, comment, image_url, is_verified, is_deleted) VALUES (?, ?, ?, ?, ?, ?, 0, 0)',
      [userId || null, reviewerName, reviewerRole || 'Verified Customer', rating || 5, comment, finalImage]
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
    await ensureReviewColumns();
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
    await ensureReviewColumns();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
    }

    // Soft delete execution: Set is_deleted = 1
    await pool.query('UPDATE reviews SET is_deleted = 1 WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Review soft deleted successfully' });
  } catch (err) {
    console.error('Soft Delete Review Error:', err);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
