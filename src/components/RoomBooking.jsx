import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, Calendar, User, Clock, DollarSign, X } from 'lucide-react';

const FLOOR_ROOMS = {
  1: [
    { number: '101', type: 'Deluxe Room', price: 150, description: 'King size bed, city view, walk-in shower' },
    { number: '102', type: 'Deluxe Room', price: 150, description: 'Twin beds, garden view, office workspace' },
    { number: '103', type: 'Deluxe Room', price: 150, description: 'King size bed, quiet courtyard view, smart TV' },
    { number: '104', type: 'Deluxe Room', price: 150, description: 'King size bed, marble bathroom, minibar' },
    { number: '105', type: 'Deluxe Room', price: 150, description: 'Twin beds, garden view, premium coffee maker' },
    { number: '106', type: 'Deluxe Room', price: 150, description: 'King size bed, city view, lounge chair' }
  ],
  2: [
    { number: '201', type: 'Executive Suite', price: 280, description: 'Spacious parlor, king size bed, balcony' },
    { number: '202', type: 'Executive Suite', price: 280, description: 'Double balcony, workspace, luxury bathtub' },
    { number: '203', type: 'Executive Suite', price: 280, description: 'Lounge area, Nespresso machine, city views' },
    { number: '204', type: 'Executive Suite', price: 280, description: 'Premium bedding, rainfall shower, workspace' },
    { number: '205', type: 'Executive Suite', price: 280, description: 'Corner suite, high floor, luxury bath amenities' },
    { number: '206', type: 'Executive Suite', price: 280, description: 'Spacious lounge, dining area, king bed' }
  ],
  3: [
    { number: '301', type: 'Premium Presidential', price: 490, description: 'Private butler service, panoramic views, hot tub' },
    { number: '302', type: 'Premium Presidential', price: 490, description: 'En-suite dining room, master bedroom, smart automation' },
    { number: '303', type: 'Premium Presidential', price: 490, description: 'Jacuzzi bath, bar cabinet, custom art collections' },
    { number: '304', type: 'Premium Presidential', price: 490, description: 'Double bedroom, walk-in wardrobe, high terrace' },
    { number: '305', type: 'Premium Presidential', price: 490, description: 'Dedicated work office, luxury spa room access' },
    { number: '306', type: 'Premium Presidential', price: 490, description: 'Grand lounge, cocktail bar, wrap-around balcony' }
  ],
  4: [
    { number: '401', type: 'De Lux Penthouse', price: 950, description: 'Private rooftop pool, 360-degree skylines, helipad access' },
    { number: '402', type: 'De Lux Penthouse', price: 950, description: 'Private elevator, movie theater, cocktail lounge, grand deck' }
  ]
};

// Initial default bookings to test the "Already Booked" dialogue box
const DEFAULT_BOOKINGS = {
  '102': { name: 'Sarah Jenkins', nights: 3, date: '2026-08-06' },
  '203': { name: 'Robert Chen', nights: 5, date: '2026-08-07' },
  '301': { name: 'Elena Rostova', nights: 2, date: '2026-08-04' },
  '402': { name: 'Lord Sterling', nights: 7, date: '2026-08-10' }
};

// Helper to calculate stay progress relative to current local date
function getStayStatus(checkInStr, nights) {
  const totalNights = parseInt(nights, 10) || 0;
  if (!checkInStr) {
    return { paid: totalNights, left: totalNights, status: 'Unknown' };
  }

  // Parse check-in date parts directly to prevent timezone shift issues
  const [inYear, inMonth, inDay] = checkInStr.split('-').map(Number);
  const checkInDate = new Date(inYear, inMonth - 1, inDay);
  
  // Current local date (normalized to midnight)
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Check-out date
  const checkOutDate = new Date(checkInDate.getTime() + totalNights * 24 * 60 * 60 * 1000);
  
  if (today < checkInDate) {
    // Stay is in the future
    return {
      paid: totalNights,
      left: totalNights,
      status: 'Upcoming'
    };
  } else if (today >= checkOutDate) {
    // Stay is completed
    return {
      paid: totalNights,
      left: 0,
      status: 'Completed'
    };
  } else {
    // Active stay
    const diffTime = today.getTime() - checkInDate.getTime();
    const elapsedNights = Math.floor(diffTime / (24 * 60 * 60 * 1000));
    const leftNights = totalNights - elapsedNights;
    return {
      paid: totalNights,
      left: Math.max(0, leftNights),
      status: 'Active'
    };
  }
}

export default function RoomBooking() {
  const [activeFloor, setActiveFloor] = useState(1);
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('delux_crib_bookings_v2');
    return saved ? JSON.parse(saved) : DEFAULT_BOOKINGS;
  });
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isBookedModalOpen, setIsBookedModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);

  // Form State
  const [guestName, setGuestName] = useState('');
  const [duration, setDuration] = useState(1);
  const [checkInDate, setCheckInDate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem('delux_crib_bookings_v2', JSON.stringify(bookings));
  }, [bookings]);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    if (bookings[room.number]) {
      setIsBookedModalOpen(true);
    } else {
      setGuestName('');
      setDuration(1);
      setCheckInDate(new Date().toISOString().split('T')[0]);
      setErrors({});
      setIsFormModalOpen(true);
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!guestName.trim()) {
      newErrors.guestName = 'Guest name is required';
    }
    if (duration <= 0) {
      newErrors.duration = 'Duration must be at least 1 night';
    }
    if (!checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Book the room
    const newBooking = {
      name: guestName,
      nights: parseInt(duration, 10),
      date: checkInDate
    };

    setBookings(prev => ({
      ...prev,
      [selectedRoom.number]: newBooking
    }));

    setIsFormModalOpen(false);
    
    // Show success dialog
    setSuccessBooking({
      roomNumber: selectedRoom.number,
      type: selectedRoom.type,
      name: guestName,
      nights: duration,
      totalPrice: selectedRoom.price * duration
    });
  };

  const cancelBooking = (roomNumber) => {
    const confirmCancel = window.confirm(`Are you sure you want to release Room ${roomNumber}?`);
    if (confirmCancel) {
      const updated = { ...bookings };
      delete updated[roomNumber];
      setBookings(updated);
      setIsBookedModalOpen(false);
    }
  };

  const currentRooms = FLOOR_ROOMS[activeFloor] || [];

  return (
    <section id="booking" className="section-padding bg-light-section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-subtitle">Exquisite Stays</span>
          <h2 className="section-title">Rooms & Suites</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
            Select a floor below to preview our sanctuaries. Experience personalized comfort and reservation control.
          </p>
        </div>

        {/* Floor Navigation Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4].map(floor => (
            <button
              key={floor}
              onClick={() => setActiveFloor(floor)}
              className={activeFloor === floor ? 'btn-black floor-tab is-active' : 'btn-outline floor-tab'}
              style={{
                borderRadius: '0',
                padding: '0.6rem 1.5rem',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                borderColor: activeFloor === floor ? 'var(--color-gold)' : 'var(--border-color)',
                backgroundColor: activeFloor === floor ? 'var(--text-primary)' : 'transparent',
                color: activeFloor === floor ? 'var(--bg-primary)' : 'var(--text-primary)'
              }}
              onMouseEnter={(e) => {
                if (activeFloor !== floor) {
                  e.currentTarget.style.borderColor = 'var(--color-gold)';
                  e.currentTarget.style.color = 'var(--color-gold)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeFloor !== floor) {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
            >
              {floor === 4 ? 'PENTHOUSE DECK' : `FLOOR 0${floor}`}
            </button>
          ))}
        </div>

        {/* Room Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {currentRooms.map((room, index) => {
            const isBooked = !!bookings[room.number];
            return (
              <div
                key={room.number}
                onClick={() => handleRoomClick(room)}
                className={`hover-gold-border reveal room-card reveal-delay-${index % 3}`}
                style={{
                  backgroundColor: 'var(--card-bg)',
                  padding: '2rem',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '260px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'var(--transition-smooth)',
                  borderTop: isBooked ? '3px solid var(--text-muted)' : '3px solid var(--color-gold)'
                }}
              >
                {/* Status Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{
                    fontSize: '1.25rem',
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 'bold',
                    color: isBooked ? 'var(--text-muted)' : 'var(--color-gold)'
                  }}>
                    No. {room.number}
                  </span>
                  
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    letterSpacing: '0.08em',
                    padding: '0.2rem 0.6rem',
                    textTransform: 'uppercase',
                    backgroundColor: isBooked ? 'var(--bg-tertiary)' : 'var(--color-gold-light)',
                    color: isBooked ? 'var(--text-muted)' : 'var(--color-gold)',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    {isBooked ? (
                      <>
                        <ShieldAlert size={12} /> Booked
                      </>
                    ) : (
                      <>
                        <CheckCircle size={12} /> Vacant
                      </>
                    )}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>{room.type}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: isBooked ? '0.5rem' : '1.5rem' }}>{room.description}</p>
                  
                  {isBooked && (() => {
                    const booking = bookings[room.number];
                    if (!booking) return null;
                    const status = getStayStatus(booking.date, booking.nights);
                    return (
                      <div style={{
                        marginTop: '0.8rem',
                        marginBottom: '1.2rem',
                        padding: '0.6rem 0.8rem',
                        backgroundColor: 'var(--bg-tertiary)',
                        borderLeft: '3px solid var(--color-gold)',
                        fontSize: '0.8rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.2rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Paid Duration:</span>
                          <strong>{status.paid} Night(s)</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Duration Left:</span>
                          <strong style={{ color: status.left > 0 ? 'var(--color-gold)' : 'var(--text-muted)' }}>
                            {status.left} Night(s) ({status.status})
                          </strong>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Per Night</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: '500', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
                      ${room.price}
                    </span>
                  </div>
                  <span className="text-gold room-card-cta" style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {isBooked ? 'Details' : 'Book Suite →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= MODAL: ROOM ALREADY BOOKED ================= */}
        {isBookedModalOpen && selectedRoom && (
          <div className="modal-overlay" onClick={() => setIsBookedModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ borderTop: '6px solid #e11d48' }}>
              <button className="modal-close" onClick={() => setIsBookedModalOpen(false)}>
                <X size={20} />
              </button>
              
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#fee2e2',
                  color: '#ef4444',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <ShieldAlert size={32} />
                </div>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Room {selectedRoom.number} Occupied
                </h3>
                <p className="text-gold" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.05em' }}>
                  {selectedRoom.type}
                </p>
              </div>

              <div style={{
                backgroundColor: 'var(--bg-tertiary)',
                padding: '1.2rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginBottom: '1.5rem',
                borderLeft: '3px solid var(--color-gold)'
              }}>
                <p style={{ marginBottom: '0.8rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                  This room has already been reserved.
                </p>
                {(() => {
                  const booking = bookings[selectedRoom.number];
                  if (!booking) return null;
                  const status = getStayStatus(booking.date, booking.nights);
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1rem', marginTop: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Check-in Date:</span>
                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{booking.date}</span>
                      
                      <span style={{ color: 'var(--text-muted)' }}>Duration Paid:</span>
                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{status.paid} Night(s)</span>
                      
                      <span style={{ color: 'var(--text-muted)' }}>Duration Left:</span>
                      <span style={{ fontWeight: '600', color: status.left > 0 ? 'var(--color-gold)' : 'var(--text-muted)' }}>
                        {status.left} Night(s) ({status.status})
                      </span>
                    </div>
                  );
                })()}
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
                Please choose another suite on Floor 0{activeFloor} or check other floors for available vacancies.
              </p>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setIsBookedModalOpen(false)}
                  className="btn-black"
                  style={{ flex: 1, padding: '0.8rem' }}
                >
                  Choose Another Room
                </button>
                
                <button
                  onClick={() => cancelBooking(selectedRoom.number)}
                  className="btn-outline"
                  style={{ padding: '0.8rem', borderColor: '#f87171', color: '#f87171' }}
                  title="Demo feature: release this room"
                >
                  Release Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODAL: BOOKING FORM ================= */}
        {isFormModalOpen && selectedRoom && (
          <div className="modal-overlay" onClick={() => setIsFormModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ borderTop: '6px solid var(--color-gold)' }}>
              <button className="modal-close" onClick={() => setIsFormModalOpen(false)}>
                <X size={20} />
              </button>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                  Reserve Suite {selectedRoom.number}
                </h3>
                <span style={{ color: 'var(--color-gold)', fontSize: '0.85rem', fontWeight: '500' }}>
                  {selectedRoom.type} &bull; ${selectedRoom.price}/Night
                </span>
              </div>

              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="guest-name">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <User size={14} /> Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    id="guest-name"
                    className="form-input"
                    placeholder="e.g. Alexandra Sterling"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                  {errors.guestName && (
                    <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                      {errors.guestName}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="check-in-date">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={14} /> Check-in Date
                    </span>
                  </label>
                  <input
                    type="date"
                    id="check-in-date"
                    className="form-input"
                    value={checkInDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckInDate(e.target.value)}
                  />
                  {errors.checkInDate && (
                    <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                      {errors.checkInDate}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="stay-duration">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={14} /> Duration of Stay
                    </span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input
                      type="number"
                      id="stay-duration"
                      className="form-input"
                      min="1"
                      max="30"
                      value={duration}
                      onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value, 10) || 0))}
                      style={{ width: '80px', textAlign: 'center' }}
                    />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nights</span>
                  </div>
                  {errors.duration && (
                    <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                      {errors.duration}
                    </span>
                  )}
                </div>

                {/* Price Calculation Summary */}
                <div style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  padding: '1.2rem',
                  borderRadius: '4px',
                  marginBottom: '1.8rem',
                  border: '1px dashed var(--border-gold)'
                }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    Fare Quotation
                  </span>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '0.3rem' }}>
                    <span>Rate / Night</span>
                    <span>${selectedRoom.price}.00</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
                    <span>Nights</span>
                    <span>x {duration}</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '0.8rem',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    color: 'var(--text-primary)'
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <DollarSign size={16} className="text-gold" /> Total Cost
                    </span>
                    <span className="text-gold" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem' }}>
                      ${selectedRoom.price * duration}.00
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="btn-outline"
                    style={{ flex: 1, padding: '0.8rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold"
                    style={{ flex: 2, padding: '0.8rem' }}
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= SUCCESS POPUP DIALOG ================= */}
        {successBooking && (
          <div className="modal-overlay" onClick={() => setSuccessBooking(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ borderTop: '6px solid #22c55e', textAlign: 'center' }}>
              <button className="modal-close" onClick={() => setSuccessBooking(null)}>
                <X size={20} />
              </button>

              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#22c55e',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <CheckCircle size={32} />
              </div>

              <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Booking Confirmed!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Suite <strong>{successBooking.roomNumber}</strong> has been secured for <strong>{successBooking.name}</strong>.
              </p>

              <div style={{
                backgroundColor: 'var(--bg-tertiary)',
                padding: '1rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                textAlign: 'left',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>SUITE TYPE</span>
                    <strong>{successBooking.type}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>DURATION</span>
                    <strong>{successBooking.nights} Night(s)</strong>
                  </div>
                  <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.2rem' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>AMOUNT SETTLED</span>
                    <strong className="text-gold" style={{ fontSize: '1.1rem' }}>${successBooking.totalPrice}.00</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSuccessBooking(null)}
                className="btn-black"
                style={{ width: '100%', padding: '0.8rem' }}
              >
                Return to Rooms
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
