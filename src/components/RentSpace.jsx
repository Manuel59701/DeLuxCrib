import React, { useState, useEffect } from 'react';
import { Calendar, Users, Award, ShieldCheck, Mail, User, Clock, CheckCircle, X, AlertTriangle, Printer, CreditCard, DollarSign } from 'lucide-react';
import { getStore, createEventBooking, checkHallAvailability, getHallOccupiedDates } from '../utils/dataStore';
import { downloadEventReceipt } from '../utils/receipt';

export default function RentSpace() {
  const [store, setStore] = useState(() => getStore());
  const [selectedSpaceId, setSelectedSpaceId] = useState('gala');
  const [date, setDate] = useState('');
  const [days, setDays] = useState(1);
  const [guestCount, setGuestCount] = useState(50);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState('Cocktail Reception');
  const [paymentMethod, setPaymentMethod] = useState('Online Card (Paystack Verified)');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successEvent, setSuccessEvent] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleUpdate = (e) => {
      setStore(e.detail || getStore());
    };
    window.addEventListener('delux_store_updated', handleUpdate);
    return () => window.removeEventListener('delux_store_updated', handleUpdate);
  }, []);

  const SPACES = [
    {
      id: 'gala',
      name: 'The Grand Gala Hall',
      capacity: '50 - 150 guests',
      pricePerDay: store.halls?.find(h => h.id === 'gala')?.pricePerDay || 2500,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
      description: 'A stately hall with towering crystal chandeliers, golden drapery, and a private stage. Perfect for banquets, wedding receptions, and high-society galas.'
    },
    {
      id: 'rooftop',
      name: 'Vortex Sky Deck (Rooftop Lounge)',
      capacity: '20 - 80 guests',
      pricePerDay: store.halls?.find(h => h.id === 'rooftop')?.pricePerDay || 1800,
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800',
      description: 'An open-air luxury deck overlooking the city skyline, equipped with fire pits, ambient fairy lights, and private bar access. Ideal for cocktails, birthdays, and anniversaries.'
    },
    {
      id: 'boardroom',
      name: 'Sovereign Boardroom & Salon',
      capacity: '10 - 25 guests',
      pricePerDay: store.halls?.find(h => h.id === 'boardroom')?.pricePerDay || 1000,
      image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800',
      description: 'A wood-crafted corporate salon offering state-of-the-art projection systems, leather seating, soundproofing, and optional gourmet business catering.'
    }
  ];

  const selectedSpace = SPACES.find(s => s.id === selectedSpaceId) || SPACES[0];
  const totalCost = selectedSpace.pricePerDay * days;

  // Real-time conflict validation for selected venue and date range
  const availability = date ? checkHallAvailability(selectedSpaceId, date, days) : { available: true };
  const occupiedDates = getHallOccupiedDates(selectedSpaceId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Contact name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email is required';
    if (!date) newErrors.date = 'Event date is required';
    if (days <= 0) newErrors.days = 'Duration must be at least 1 day';
    
    // Strict date availability check
    if (date && !availability.available) {
      newErrors.date = availability.reason;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const created = createEventBooking({
      hallId: selectedSpace.id,
      hallName: selectedSpace.name,
      clientName: name,
      email,
      phone: phone || '+234 800 000 0000',
      eventType,
      date,
      days: parseInt(days, 10),
      guestCount: parseInt(guestCount, 10),
      totalAmount: totalCost,
      paymentStatus: 'confirmed',
      paymentMethod,
      eventStatus: 'confirmed',
      seatingStyle: 'Banquet & Reception'
    }, 'Guest Online Reservation');

    setSuccessEvent(created);
    setErrors({});
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setSuccessEvent(null);
    setName('');
    setEmail('');
    setPhone('');
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
        <div className="space-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
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
          padding: '2.5rem',
          maxWidth: '920px',
          margin: '0 auto',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ color: 'var(--color-gold)', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Real-Time Calendar Lock
            </span>
            <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', margin: '0.3rem 0' }}>
              Reserve: {selectedSpace.name}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '600px', margin: '0 auto' }}>
              Select your date, guest headcount, and payment method to instantly lock the venue calendar.
            </p>
          </div>

          {/* Hall Calendar Reserved Dates Notice */}
          {occupiedDates.length > 0 && (
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px dashed var(--border-color)',
              padding: '0.8rem 1.2rem',
              marginBottom: '1.5rem',
              borderRadius: '3px',
              fontSize: '0.8rem'
            }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: '600', marginRight: '0.5rem' }}>
                🔒 Currently Reserved Dates for {selectedSpace.name}:
              </span>
              <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.3rem' }}>
                {occupiedDates.map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.15rem 0.5rem',
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      borderRadius: '2px',
                      fontSize: '0.72rem',
                      fontWeight: '500'
                    }}
                  >
                    {item.date} — Unavailable
                  </span>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="rent-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left' }}>
            
            {/* Primary Details (Left) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label" htmlFor="renter-name">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <User size={13} className="text-gold" /> Full Name / Host Organization
                  </span>
                </label>
                <input
                  type="text"
                  id="renter-name"
                  className="form-input"
                  placeholder="e.g. Alexandra Sterling"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.name}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label className="form-label" htmlFor="renter-email">Email Address</label>
                  <input
                    type="email"
                    id="renter-email"
                    className="form-input"
                    placeholder="alexandra@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.email}</span>}
                </div>
                <div>
                  <label className="form-label" htmlFor="renter-phone">Phone Number</label>
                  <input
                    type="text"
                    id="renter-phone"
                    className="form-input"
                    placeholder="+234 803 000 1122"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
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
                  <option>Corporate Board Meeting & Banquet</option>
                  <option>Cocktail Reception</option>
                  <option>Wedding Banquet & Reception</option>
                  <option>Private Birthday / Anniversary Dinner</option>
                  <option>Press Conference & Product Launch</option>
                  <option>VIP Gala & Society Dinner</option>
                </select>
              </div>

              {/* Payment Method Selection */}
              <div>
                <label className="form-label" htmlFor="payment-method">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CreditCard size={13} className="text-gold" /> Payment Method & Settlement
                  </span>
                </label>
                <select
                  id="payment-method"
                  className="form-input"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ cursor: 'pointer', appearance: 'auto' }}
                >
                  <option value="Online Card (Paystack Verified)">Paystack / Debit Card (Instant Hold)</option>
                  <option value="Flutterwave / Apple Pay">Flutterwave / International Card</option>
                  <option value="Direct Bank Transfer (POS Verified)">Direct Bank Wire Transfer (Verified)</option>
                  <option value="Concierge VIP Front-Desk Hold">Concierge VIP Front-Desk Hold</option>
                </select>
              </div>
            </div>

            {/* Date, Availability Check, and Cost Calculator (Right) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label className="form-label" htmlFor="event-date">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} className="text-gold" /> Target Date
                    </span>
                  </label>
                  <input
                    type="date"
                    id="event-date"
                    className="form-input"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    style={{
                      borderColor: date && !availability.available ? '#ef4444' : (date && availability.available ? '#22c55e' : undefined)
                    }}
                  />
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

              {/* Date Availability Status Badge / Alert */}
              {date && (
                <div>
                  {!availability.available ? (
                    <div style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid #ef4444',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '3px',
                      color: '#ef4444',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem'
                    }}>
                      <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong>Date Unavailable:</strong> {availability.reason}
                        <div style={{ fontSize: '0.72rem', marginTop: '0.2rem', color: 'var(--text-secondary)' }}>
                          Please select another date on the calendar.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.12)',
                      border: '1px solid #22c55e',
                      padding: '0.5rem 0.8rem',
                      borderRadius: '3px',
                      color: '#22c55e',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      <CheckCircle size={14} />
                      <span><strong>Date Available!</strong> {selectedSpace.name} is open for reservation.</span>
                    </div>
                  )}
                </div>
              )}
              {errors.date && !availability.available && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.date}</span>
              )}

              <div>
                <label className="form-label" htmlFor="guest-range">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Users size={13} className="text-gold" /> Estimated Guests ({guestCount})
                  </span>
                </label>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <span>5 Guests</span>
                  <span>Max: {selectedSpace.capacity}</span>
                </div>
              </div>

              {/* Dynamic Fee Quote */}
              <div style={{
                backgroundColor: 'var(--bg-tertiary)',
                padding: '0.9rem 1.2rem',
                borderLeft: '4px solid var(--color-gold)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'auto'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Daily Tariff &times; Duration</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>${selectedSpace.pricePerDay} &times; {days} Day(s)</span>
                </div>
                <span className="text-gold" style={{ fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'var(--font-serif)' }}>
                  ${totalCost}.00
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="rent-form-submit" style={{ gridColumn: 'span 2', marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={date && !availability.available}
                className="btn-gold"
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '0.9rem',
                  opacity: date && !availability.available ? 0.5 : 1,
                  cursor: date && !availability.available ? 'not-allowed' : 'pointer'
                }}
              >
                {date && !availability.available ? '⚠️ Date Unavailable — Select Another Date' : 'Confirm Venue Booking & Pay'}
              </button>
            </div>
          </form>
        </div>

        {/* ================= SUCCESS MODAL (LANDSCAPE 2-COLUMN) ================= */}
        {showSuccess && successEvent && (
          <div className="modal-overlay" onClick={handleCloseSuccess}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '820px',
                width: '95%',
                borderTop: '5px solid var(--color-gold)',
                padding: '1.8rem',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.2rem',
                paddingBottom: '0.6rem',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#dcfce7',
                    color: '#22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-serif)' }}>
                      Venue Reservation Confirmed!
                    </h3>
                    <span style={{ color: 'var(--color-gold)', fontSize: '0.78rem', fontWeight: '600', letterSpacing: '0.05em' }}>
                      REF NO. {successEvent.refNo} &bull; ADDED TO MANAGEMENT CALENDAR
                    </span>
                  </div>
                </div>
                <button className="modal-close" onClick={handleCloseSuccess}>
                  <X size={18} />
                </button>
              </div>

              {/* 2-Column Landscape Split */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.1fr 1fr',
                gap: '1.4rem',
                alignItems: 'start',
                marginBottom: '1.5rem'
              }}>
                {/* Left Column: Event & Client Overview */}
                <div style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  padding: '1.2rem',
                  borderRadius: '4px',
                  fontSize: '0.82rem',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem'
                }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.3rem' }}>
                    Reservation Particulars
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.4rem 1rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Venue:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{successEvent.hallName}</strong>

                    <span style={{ color: 'var(--text-muted)' }}>Host / Client:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{successEvent.clientName}</strong>

                    <span style={{ color: 'var(--text-muted)' }}>Classification:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{successEvent.eventType}</span>

                    <span style={{ color: 'var(--text-muted)' }}>Contact Email:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{successEvent.email}</span>

                    <span style={{ color: 'var(--text-muted)' }}>Contact Phone:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{successEvent.phone}</span>

                    <span style={{ color: 'var(--text-muted)' }}>Attendees:</span>
                    <span style={{ color: 'var(--text-primary)' }}>Approx. {successEvent.guestCount} Guests</span>
                  </div>
                </div>

                {/* Right Column: Date, Payment, and Amount */}
                <div style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  padding: '1.2rem',
                  borderRadius: '4px',
                  fontSize: '0.82rem',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.8rem'
                }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.3rem' }}>
                    Schedule & Settlement Breakdown
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.4rem 1rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Reserved Date:</span>
                    <strong style={{ color: 'var(--color-gold)' }}>{successEvent.date}</strong>

                    <span style={{ color: 'var(--text-muted)' }}>Duration:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{successEvent.days} Day(s)</strong>

                    <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
                    <strong style={{ color: '#22c55e' }}>{successEvent.paymentMethod}</strong>

                    <span style={{ color: 'var(--text-muted)' }}>Calendar Status:</span>
                    <span style={{ color: '#22c55e', fontWeight: 'bold' }}>LOCKED & CONFIRMED</span>
                  </div>

                  <div style={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px dashed var(--border-gold)',
                    borderRadius: '2px',
                    padding: '0.8rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.4rem'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '600' }}>Total Amount Paid</span>
                    <span className="text-gold" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', lineHeight: 1, fontWeight: 'bold' }}>
                      ${successEvent.totalAmount}.00
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="modal-btn-row" style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => downloadEventReceipt(successEvent)}
                  className="btn-gold"
                  style={{
                    flex: 1.4,
                    padding: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <Printer size={16} /> Download Event E-Receipt (PDF)
                </button>
                <button
                  onClick={handleCloseSuccess}
                  className="btn-black"
                  style={{ flex: 1, padding: '0.85rem', fontSize: '0.85rem' }}
                >
                  Return to Venues
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

