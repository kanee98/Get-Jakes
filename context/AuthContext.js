'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('gj_current_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Authentication failed');
    }

    if (data.user) {
      setUser(data.user);
      localStorage.setItem('gj_current_user', JSON.stringify(data.user));
    }

    return data;
  };

  const setupPassword = async (email, newPassword) => {
    const res = await fetch('/api/auth/setup-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update password');
    }

    if (data.user) {
      setUser(data.user);
      localStorage.setItem('gj_current_user', JSON.stringify(data.user));
    }

    return data;
  };

  const register = async (fullName, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    if (data.user) {
      setUser(data.user);
      localStorage.setItem('gj_current_user', JSON.stringify(data.user));
    }

    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gj_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, setupPassword, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
