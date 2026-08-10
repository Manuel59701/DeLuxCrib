import React, { useState } from 'react';
import { Calendar, Users, Award, ShieldCheck, Mail, User, Clock, CheckCircle, X } from 'lucide-react';

const SPACES = [
  {
    id: 'gala',
    name: 'The Grand Gala Hall',
    capacity: '50 - 150 guests',
    pricePerDay: 2500,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
    description: 'A stately hall with towering crystal chandeliers, golden drapery, and a private stage. Perfect for banquets, wedding receptions, and high-society galas.'
  },
  {
    id: 'rooftop',
    name: 'Vortex Sky Deck (Rooftop Lounge)',
    capacity: '20 - 80 guests',
    pricePerDay: 1800,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800',
    description: 'An open-air luxury deck overlooking the city skyline, equipped with fire pits, ambient fairy lights, and private bar access. Ideal for cocktails, birthdays, and anniversaries.'
  },
  {
    id: 'boardroom',
    name: 'Sovereign Boardroom & Salon',
    capacity: '10 - 25 guests',
    pricePerDay: 1000,
    image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800',
    description: 'A wood-crafted corporate salon offering state-of-the-art projection systems, leather seating, soundproofing, and optional gourmet business catering.'
  }
];

export default function RentSpace() {
  const [selectedSpaceId, setSelectedSpaceId] = useState('gala');
  const [date, setDate] = useState('');
  const [days, setDays] = useState(1);
  const [guestCount, setGuestCount] = useState(20);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState('Cocktail Reception');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const selectedSpace = SPACES.find(s => s.id === selectedSpaceId) || SPACES[0];
  const totalCost = selectedSpace.pricePerDay * days;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Contact name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email is required';
    if (!date) newErrors.date = 'Event date is required';
    if (days <= 0) newErrors.days = 'Duration must be at least 1 day';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    // Reset form fields
    setName('');
    setEmail('');
    setDate('');
    setDays(1);
  };

  return (
    <section id="rent-space" className="section-padding bg-light-section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-subtitle">Stately Venues</span>
          <h2 className="section-title">Rent A Space</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
            Elevate your events at De Lux Crib. Reserve our premium venues, fully tailored to accommodate intimate corporate retreats or grand wedding banquets.
          </p>
        </div>

        {/* Space Selector & Showcase Grid */}
        <div className="space-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {SPACES.map(space => {
            const isSelected = space.id === selectedSpaceId;
            return (
              <div
                key={space.id}
                onClick={() => setSelectedSpaceId(space.id)}
                className="reveal"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--border-color)',
                  borderRadius: '0',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'var(--transition-smooth)',
                  boxShadow: isSelected ? 'var(--shadow-lg)' : 'var(--shadow-sm)'
                }}
              >
                <div style={{ height: '220px', position: 'relative' }}>
                  <img
                    src={space.image}
                    alt={space.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      bottom: '1rem',
                      right: '1rem',
                      backgroundColor: 'var(--color-gold)',
                      color: '#000000',
                      padding: '0.3rem 0.8rem',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Selected Venue
                    </div>
                  )}
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                      {space.name}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: '300' }}>
                      {space.description}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '1rem',
                    marginTop: '1rem'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Users size={14} className="text-gold" /> {space.capacity}
                    </span>
                    <span style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                      ${space.pricePerDay}/Day
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rental Booking Form Wrapper */}
        <div className="rent-form-wrap" style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-gold)',
          padding: '3rem',
          maxWidth: '850px',
          margin: '0 auto',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Venue Inquiry: {selectedSpace.name}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Complete the venue reserve request below to secure pricing and calendar holds.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rent-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left' }}>
            
            {/* Primary Details (Left) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label className="form-label" htmlFor="renter-name">Your Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} className="text-gold" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    id="renter-name"
                    className="form-input"
                    placeholder="e.g. Johnathan Wilde"
                    style={{ paddingLeft: '2.5rem' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {errors.name && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.name}</span>}
              </div>

              <div>
                <label className="form-label" htmlFor="renter-email">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} className="text-gold" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    id="renter-email"
                    className="form-input"
                    placeholder="e.g. john@delux.com"
                    style={{ paddingLeft: '2.5rem' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.email}</span>}
              </div>

              <div>
                <label className="form-label" htmlFor="event-type">Event Classification</label>
                <select
                  id="event-type"
                  className="form-input"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  style={{ cursor: 'pointer', appearance: 'auto' }}
                >
                  <option>Corporate Board Meeting</option>
                  <option>Cocktail Reception</option>
                  <option>Wedding Banquet</option>
                  <option>Private Birthday Dinner</option>
                  <option>Press Conference & Release</option>
                  <option>Other / Unspecified</option>
                </select>
              </div>
            </div>

            {/* Date and Cost Calculator (Right) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label" htmlFor="event-date">Target Date</label>
                  <input
                    type="date"
                    id="event-date"
                    className="form-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  {errors.date && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.date}</span>}
                </div>
                
                <div>
                  <label className="form-label" htmlFor="event-days">Duration (Days)</label>
                  <input
                    type="number"
                    id="event-days"
                    className="form-input"
                    min="1"
                    max="14"
                    value={days}
                    onChange={(e) => setDays(Math.max(1, parseInt(e.target.value, 10) || 0))}
                  />
                  {errors.days && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.days}</span>}
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="guest-range">Estimated Guests ({guestCount})</label>
                <input
                  type="range"
                  id="guest-range"
                  min="5"
                  max="150"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                  style={{
                    width: '100%',
                    accentColor: 'var(--color-gold)',
                    cursor: 'pointer',
                    height: '6px',
                    backgroundColor: 'var(--border-color)'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  <span>5 Guests</span>
                  <span>150 Guests Max</span>
                </div>
              </div>

              {/* Dynamic Fee Quote */}
              <div style={{
                backgroundColor: 'var(--bg-tertiary)',
                padding: '1rem',
                borderLeft: '4px solid var(--color-gold)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'auto'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Estimated Fee</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>${selectedSpace.pricePerDay} &times; {days} Day(s)</span>
                </div>
                <span className="text-gold" style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-serif)' }}>
                  ${totalCost}.00
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="rent-form-submit" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
              <button type="submit" className="btn-gold" style={{ width: '100%', padding: '1rem' }}>
                Submit Venue Booking Request
              </button>
            </div>
          </form>
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <div className="modal-overlay" onClick={handleCloseSuccess}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', borderTop: '6px solid var(--color-gold)' }}>
              <button className="modal-close" onClick={handleCloseSuccess}>
                <X size={20} />
              </button>

              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-gold-light)',
                color: 'var(--color-gold)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <CheckCircle size={32} />
              </div>

              <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Rental Inquiry Received
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Thank you, <strong>{name}</strong>. Our events manager will email you within 24 hours at <strong>{email}</strong> to finalize details.
              </p>

              <div style={{
                backgroundColor: 'var(--bg-tertiary)',
                padding: '1.2rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                textAlign: 'left',
                marginBottom: '1.8rem',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.4rem 1rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>VENUE:</span>
                  <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{selectedSpace.name}</span>
                  
                  <span style={{ color: 'var(--text-muted)' }}>CLASSIFICATION:</span>
                  <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{eventType}</span>
                  
                  <span style={{ color: 'var(--text-muted)' }}>RESERVED DATE:</span>
                  <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{date}</span>

                  <span style={{ color: 'var(--text-muted)' }}>DURATION:</span>
                  <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{days} Day(s)</span>

                  <span style={{ color: 'var(--text-muted)' }}>GUESTS:</span>
                  <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Approx. {guestCount}</span>

                  <span style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.4rem', marginTop: '0.4rem' }}>RATE QUOTE:</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--color-gold)', borderTop: '1px solid var(--border-color)', paddingTop: '0.4rem', marginTop: '0.4rem', fontSize: '1rem' }}>
                    ${totalCost}.00
                  </span>
                </div>
              </div>

              <button
                onClick={handleCloseSuccess}
                className="btn-black"
                style={{ width: '100%', padding: '0.8rem' }}
              >
                Close Window
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
