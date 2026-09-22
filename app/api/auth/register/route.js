import { NextResponse } from 'next/server';
import pool from '@/database/db.js';

export async function POST(request) {
  try {
    const { fullName, email, password } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'Full name, email, and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'An account with this email already exists. Please sign in.' }, { status: 400 });
    }

    const role = cleanEmail.includes('admin') ? 'admin' : 'customer';

    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, auth_provider, role)
       VALUES (?, ?, ?, 'email', ?)`,
      [fullName.trim(), cleanEmail, password, role]
    );

    return NextResponse.json({
      user: {
        id: result.insertId,
        fullName: fullName.trim(),
        email: cleanEmail,
        role
      },
      token: `jwt-getjakes-${role}-session`,
      message: 'Account registered successfully!'
    }, { status: 201 });
  } catch (err) {
    console.error('Registration Error:', err);
    return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
  }
}
