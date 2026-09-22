import { NextResponse } from 'next/server';
import pool from '@/database/db.js';

export async function POST(request) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Update user password_hash in MySQL
    const [result] = await pool.query(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [newPassword, cleanEmail]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'User account not found' }, { status: 404 });
    }

    const [rows] = await pool.query('SELECT id, full_name, email, role FROM users WHERE email = ?', [cleanEmail]);
    const user = rows[0];

    return NextResponse.json({
      success: true,
      message: 'Password set up successfully! Welcome to Get Jakes Admin.',
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role
      },
      token: 'jwt-getjakes-admin-session'
    });
  } catch (err) {
    console.error('Password Setup Error:', err);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
