import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, Check, UserCheck } from 'lucide-react';
import { DEMO_USERS, ROLES, setStaffAuth, authenticateStaff } from '../../utils/dataStore';

export default function AdminLogin({ onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [email, setEmail] = useState('admin@deluxcrib.com');
  const [password, setPassword] = useState('delux2026');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectRole = (user) => {
    setSelectedRole(user.role);
    setEmail(user.email);
    setPassword('delux2026');
    setError('');
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      // 1. Check admin-registered staff accounts first (email + password must match)
      const registered = authenticateStaff(email, password);
      if (registered) {
        const { password: _pw, ...safeUser } = registered;
        setStaffAuth(safeUser);
        setIsLoading(false);
        if (onLoginSuccess) {
          onLoginSuccess(safeUser);
        }
        return;
      }

      // 2. Fall back to demo accounts (no stored password) / ad-hoc role access
      const matched = DEMO_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) 
        || DEMO_USERS.find(u => u.role === selectedRole)
        || {
          id: 'usr_' + Date.now(),
          role: selectedRole,
          name: email.split('@')[0].toUpperCase(),
          email: email.trim(),
          avatar: selectedRole === 'admin' ? '👑' : (selectedRole === 'fdo' ? '🛎️' : '🎭'),
          title: ROLES[selectedRole.toUpperCase()]?.name || 'Staff'
        };

      setStaffAuth(matched);
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(matched);
      }
    }, 350);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem 1.5rem',
      position: 'relative'
    }}>
      {/* Return to Guest site link */}
      <a
        href="#hero"
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--card-bg)'
        }}
      >
        &larr; Back to Guest Site
      </a>

      <div style={{
        maxWidth: '480px',
        width: '100%',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-gold)',
        padding: '2.5rem',
        borderRadius: '4px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-gold-light)',
            color: 'var(--color-gold)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.8rem'
          }}>
            <Shield size={26} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'var(--text-primary)', margin: 0 }}>
            DE LUX <span className="text-gold">CRIB</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            Staff & Administrative Portal
          </p>
        </div>

        {/* Role Presets */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.6rem' }}>
            Select Staff Role / Access Level:
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {DEMO_USERS.map((usr) => {
              const isSelected = selectedRole === usr.role;
              return (
                <button
                  key={usr.id}
                  type="button"
                  onClick={() => handleSelectRole(usr)}
                  style={{
                    padding: '0.7rem 0.4rem',
                    borderRadius: '4px',
                    border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{usr.avatar}</div>
                  <strong style={{
                    fontSize: '0.75rem',
                    display: 'block',
                    color: isSelected ? 'var(--color-gold)' : 'var(--text-primary)'
                  }}>
                    {usr.role === 'admin' ? 'Admin' : (usr.role === 'fdo' ? 'Front Desk' : 'Events')}
                  </strong>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {usr.role.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={14} className="text-gold" /> Staff Email / ID
            </label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@deluxcrib.com"
              required
            />
          </div>

          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={14} className="text-gold" /> Password
            </label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />
          </div>

          {error && (
            <div style={{
              padding: '0.6rem 0.8rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              color: '#ef4444',
              fontSize: '0.8rem',
              borderRadius: '2px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-gold"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.4rem',
              borderRadius: '2px',
              cursor: 'pointer'
            }}
          >
            {isLoading ? 'Signing In...' : (
              <>
                Sign In <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
