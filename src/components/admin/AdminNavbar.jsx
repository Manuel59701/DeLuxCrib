import React from 'react';
import { LogOut, Sun, Moon, Shield, ExternalLink, RotateCcw } from 'lucide-react';
import { ROLES, resetStore } from '../../utils/dataStore';

export default function AdminNavbar({ user, onLogout, darkMode, toggleDarkMode }) {
  const roleMeta = ROLES[user?.role?.toUpperCase()] || ROLES.ADMIN;

  return (
    <header style={{
      backgroundColor: 'var(--card-bg)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(10px)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0.8rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Left: Brand & Portal Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <a href="#admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.35rem',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              color: 'var(--text-primary)'
            }}>
              DE LUX <span className="text-gold">CRIB</span>
            </span>
            <span style={{
              backgroundColor: 'var(--text-primary)',
              color: 'var(--bg-primary)',
              fontSize: '0.65rem',
              fontWeight: '700',
              padding: '0.2rem 0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              borderRadius: '2px'
            }}>
              PMS PORTAL
            </span>
          </a>

          {/* Quick link to guest website */}
          <a
            href="#hero"
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.3rem 0.6rem',
              borderRadius: '4px',
              border: '1px solid var(--border-color)'
            }}
            title="Open customer view in new tab"
          >
            Guest Website <ExternalLink size={12} />
          </a>
        </div>

        {/* Right: Staff Profile & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Active Staff Identity */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            padding: '0.4rem 0.8rem',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '4px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: roleMeta.color + '25',
              border: `1px solid ${roleMeta.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem'
            }}>
              {user?.avatar || '👤'}
            </div>
            
            <div style={{ lineHeight: '1.2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {user?.name || 'Staff User'}
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '2px',
                  backgroundColor: roleMeta.color,
                  color: '#000000',
                  textTransform: 'uppercase'
                }}>
                  {roleMeta.badge}
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {user?.title || roleMeta.name}
              </span>
            </div>
          </div>

          {/* Reset Test Bookings Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all test bookings and restore initial hotel state?')) {
                resetStore();
              }
            }}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              padding: '0.45rem 0.7rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
            title="Reset test bookings back to baseline demo state"
          >
            <RotateCcw size={13} /> Reset Test Data
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="theme-toggle-btn"
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}
            aria-label="Toggle light/dark theme"
          >
            {darkMode ? <Sun size={18} className="text-gold" /> : <Moon size={18} />}
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--border-color)',
              color: '#ef4444',
              padding: '0.5rem 0.8rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'var(--transition-fast)'
            }}
            title="Sign out of staff portal"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
