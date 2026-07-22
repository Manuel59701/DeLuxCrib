import React, { useState, useEffect } from 'react';
import { Sun, Moon, MapPin, Phone, Mail, Award, Star, Compass, ShieldCheck } from 'lucide-react';
import Home from './pages/Home';
import AmenitiesPage from './pages/AmenitiesPage';
import SuitesPage from './pages/SuitesPage';
import EventsPage from './pages/EventsPage';

function getPageFromHash(hash) {
  const id = hash.replace('#', '');
  if (id === 'amenities') return 'amenities';
  if (id === 'booking') return 'suites';
  if (id === 'rent-space') return 'events';
  return 'home';
}

const FacebookIcon = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }} {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }} {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('delux_crib_theme');
    if (saved) return saved === 'dark';
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('delux_crib_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('delux_crib_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const [page, setPage] = useState(() => getPageFromHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', transition: 'var(--transition-smooth)' }}>
      
      {/* ================= HEADER / NAVBAR ================= */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 500,
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)',
        transition: 'var(--transition-smooth)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="container" style={{
          height: '80px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <a href="#hero" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.6rem',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              color: 'var(--text-primary)'
            }}>
              DE LUX <span className="text-gold">CRIB</span>
            </span>
            <span style={{
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase'
            }}>
              Boutique Hotel & Suites
            </span>
          </a>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <a href="#about" style={{ fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.1em' }} className="nav-link">
              Home
            </a>
            <a href="#amenities" style={{ fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.1em' }} className="nav-link">
              Amenities
            </a>
            <a href="#booking" style={{ fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.1em' }} className="nav-link">
              Suites
            </a>
            <a href="#rent-space" style={{ fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.1em' }} className="nav-link">
              Events
            </a>
            <a href="#testimonials" style={{ fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.1em' }} className="nav-link">
              Reviews
            </a>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.3s ease'
              }}
              aria-label="Toggle light/dark theme"
            >
              {darkMode ? <Sun size={20} className="text-gold" /> : <Moon size={20} />}
            </button>
          </nav>
        </div>
      </header>

      {page === 'home' && <Home />}
      {page === 'amenities' && <AmenitiesPage />}
      {page === 'suites' && <SuitesPage />}
      {page === 'events' && <EventsPage />}

      {/* ================= FOOTER ================= */}
      <footer style={{
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '5rem 0 2.5rem 0',
        fontSize: '0.85rem'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 2fr',
            gap: '3rem',
            marginBottom: '4rem',
            textAlign: 'left'
          }}>
            {/* Brand */}
            <div>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.6rem',
                fontWeight: 'bold',
                letterSpacing: '0.05em',
                color: 'var(--color-gold)',
                display: 'block',
                marginBottom: '1rem'
              }}>
                DE LUX CRIB
              </span>
              <p style={{ color: '#aaaaaa', fontSize: '0.8rem', lineHeight: '1.6', marginBottom: '1.5rem', maxWidth: '280px' }}>
                An elite luxury boutique hotel and event spaces offering bespoke recreational chambers, a grand snooker den, and panoramic sunset skyline terraces.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" style={{ color: 'var(--color-gold)' }} aria-label="Facebook"><FacebookIcon size={18} /></a>
                <a href="#" style={{ color: 'var(--color-gold)' }} aria-label="Instagram"><InstagramIcon size={18} /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ fontFamily: 'var(--font-serif)', color: '#ffffff', fontSize: '1rem', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                Navigation
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <li><a href="#about" style={{ color: '#aaaaaa' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#aaa'}>Heritage</a></li>
                <li><a href="#amenities" style={{ color: '#aaaaaa' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#aaa'}>What We Offer</a></li>
                <li><a href="#booking" style={{ color: '#aaaaaa' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#aaa'}>Book Chambers</a></li>
                <li><a href="#rent-space" style={{ color: '#aaaaaa' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#aaa'}>Rent Event Spaces</a></li>
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h4 style={{ fontFamily: 'var(--font-serif)', color: '#ffffff', fontSize: '1rem', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                Contact Info
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: '#aaaaaa' }}>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <MapPin size={16} className="text-gold" style={{ flexShrink: 0 }} />
                  <span>777 Golden Boulevard, High End District, City Center</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Phone size={16} className="text-gold" />
                  <span>+1 (800) DE-LUX-CRIB</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Mail size={16} className="text-gold" />
                  <span>concierge@deluxcrib.com</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 style={{ fontFamily: 'var(--font-serif)', color: '#ffffff', fontSize: '1rem', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                Newsletter
              </h4>
              <p style={{ color: '#aaaaaa', fontSize: '0.8rem', marginBottom: '1rem' }}>
                Subscribe to receive private event invites and exclusive suite rate reductions.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to De Lux Crib newsletter.'); }} style={{ display: 'flex' }}>
                <input
                  type="email"
                  placeholder="Your email address"
                  required
                  style={{
                    backgroundColor: '#1f1f1f',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    padding: '0.6rem 0.8rem',
                    flex: 1,
                    fontSize: '0.8rem'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--color-gold)',
                    border: 'none',
                    color: '#000000',
                    padding: '0.6rem 1rem',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#777777',
            fontSize: '0.75rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <span>&copy; {new Date().getFullYear()} De Lux Crib. All Rights Reserved. Designed for pitch.</span>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
