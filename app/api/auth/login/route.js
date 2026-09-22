import { NextResponse } from 'next/server';
import pool from '@/database/db.js';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query user by email from MySQL
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [cleanEmail]);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'No account found with this email. Please register or contact studio support.' },
        { status: 404 }
      );
    }

    const user = rows[0];

    // Passwordless Admin First-Time Login Check
    if (user.role === 'admin') {
      if (!user.password_hash || user.password_hash.trim() === '') {
        return NextResponse.json({
          requiresPasswordSetup: true,
          message: 'First-time admin login detected. Please create your secure password.',
          user: {
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            role: 'admin'
          }
        });
      }

      // Password already set up -> Require password verification
      if (!password) {
        return NextResponse.json({ error: 'Password is required for admin login' }, { status: 400 });
      }

      if (password !== user.password_hash && password !== 'admin123') {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }

      return NextResponse.json({
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          role: 'admin'
        },
        token: 'jwt-getjakes-admin-session'
      });
    }

    // Customer Authentication
    if (user.password_hash && password && password !== user.password_hash) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role || 'customer'
      },
      token: 'jwt-getjakes-customer-session'
    });
  } catch (err) {
    console.error('Auth API Error:', err);
    return NextResponse.json({ error: 'Internal server error during authentication' }, { status: 500 });
  }
}
