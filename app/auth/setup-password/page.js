'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

function SetupPasswordForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setupPassword } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await setupPassword(email, newPassword);
      router.push('/admin');
    } catch (err) {
      setError(err.message || 'Failed to update admin password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-card)', border: '2px solid var(--color-brand)', borderRadius: 'var(--radius-lg)', padding: 36, boxShadow: 'var(--shadow-lg)' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ width: 60, height: 60, background: 'rgba(15, 179, 182, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-brand)' }}>
          <ShieldCheck style={{ width: 32, height: 32 }} />
        </div>
        <span className="badge badge-gold" style={{ marginBottom: 8 }}>First-Time Admin Setup</span>
        <h1 style={{ fontSize: '1.7rem', color: 'var(--color-black)', fontWeight: 800, margin: '8px 0 4px' }}>
          Set Up Your Admin Password
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Welcome to Get Jakes Studio! Please create a password to secure your admin account.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#DC2626', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', marginBottom: 20 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label className="form-label">Admin Email Account</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label className="form-label">New Admin Password *</label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              className="form-input"
              style={{ paddingLeft: 36 }}
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Lock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--text-muted)' }} />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label className="form-label">Confirm Admin Password *</label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              className="form-input"
              style={{ paddingLeft: 36 }}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Lock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--text-muted)' }} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
          <CheckCircle2 style={{ width: 18, height: 18 }} /> {loading ? 'Saving Password...' : 'Save Password & Go to Admin Dashboard'}
        </button>
      </form>
    </div>
  );
}

export default function SetupPasswordPage() {
  return (
    <div className="container" style={{ padding: '80px 20px', maxWidth: 480 }}>
      <Suspense fallback={<p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading setup...</p>}>
        <SetupPasswordForm />
      </Suspense>
    </div>
  );
}
