import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, Calendar, User, Clock, DollarSign, Printer, X, Wrench, Sparkles } from 'lucide-react';
import { downloadBookingReceipt } from '../utils/receipt';
import { getStore, createRoomBooking, isRoomAvailable } from '../utils/dataStore';

// Helper to calculate stay progress relative to current local date
function getStayStatus(checkInStr, nights) {
  const totalNights = parseInt(nights, 10) || 0;
  if (!checkInStr) {
    return { paid: totalNights, left: totalNights, status: 'Unknown' };
  }

  const [inYear, inMonth, inDay] = checkInStr.split('-').map(Number);
  const checkInDate = new Date(inYear, inMonth - 1, inDay);
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const checkOutDate = new Date(checkInDate.getTime() + totalNights * 24 * 60 * 60 * 1000);
  
  if (today < checkInDate) {
    return {
      paid: totalNights,
      left: totalNights,
      status: 'Upcoming'
    };
  } else if (today >= checkOutDate) {
    return {
      paid: totalNights,
      left: 0,
      status: 'Completed'
    };
  } else {
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
  const [store, setStore] = useState(() => getStore());
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isBookedModalOpen, setIsBookedModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);

  // Form State
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [duration, setDuration] = useState('1');
  const [checkInDate, setCheckInDate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleUpdate = (e) => {
      setStore(e.detail || getStore());
    };
    window.addEventListener('delux_store_updated', handleUpdate);
    return () => window.removeEventListener('delux_store_updated', handleUpdate);
  }, []);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    if (room.status === 'maintenance') {
      setIsMaintenanceModalOpen(true);
    } else if (room.status === 'occupied' || room.status === 'cleaning') {
      setIsBookedModalOpen(true);
    } else {
      setGuestName('');
      setEmail('');
      setPhone('');
      setDuration('1');
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
    const parsedDuration = parseInt(duration, 10);
    if (!duration.trim()) {
      newErrors.duration = 'Duration is required';
    } else if (parsedDuration <= 0 || parsedDuration > 30) {
      newErrors.duration = 'Duration must be between 1 and 30 nights';
    }
    if (!checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const calculatedTotal = selectedRoom.price * parsedDuration;
    const receiptNo = `DLX-${selectedRoom.number}-${String(checkInDate).replace(/\D/g, '') || Date.now().toString().slice(-6)}`;

    // Create booking in shared store
    const created = createRoomBooking({
      receiptNo,
      roomNumber: selectedRoom.number,
      floor: selectedRoom.floor || activeFloor,
      type: selectedRoom.type,
      name: guestName,
      email: email || 'guest@deluxcrib.com',
      phone: phone || '+234 800 000 0000',
      date: checkInDate,
      nights: parsedDuration,
      totalPrice: calculatedTotal,
      paymentStatus: 'confirmed',
      stayStatus: 'upcoming',
      paymentMethod: 'Paystack / Online Payment'
    }, 'Guest Online Booking Flow');

    setIsFormModalOpen(false);
    
    // Show success dialog
    setSuccessBooking({
      receiptNo: created.receiptNo,
      roomNumber: selectedRoom.number,
      type: selectedRoom.type,
      name: guestName,
      nights: parsedDuration,
      date: checkInDate,
      totalPrice: calculatedTotal
    });
  };

  const currentRooms = store.rooms[activeFloor] || [];
  const nightsCount = parseInt(duration, 10) || 0;

  return (
    <section id="booking" className="section-padding bg-light-section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-subtitle">Exquisite Stays</span>
          <h2 className="section-title">Rooms & Suites</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
            Select a floor below to preview our sanctuaries. Experience personalized comfort and real-time room lock reservation control.
          </p>
        </div>

        {/* Floor Navigation Tabs */}
        <div className="floor-tabs" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
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
            >
              {floor === 4 ? 'PENTHOUSE DECK' : `FLOOR 0${floor}`}
            </button>
          ))}
        </div>

        {/* Room Grid */}
        <div className="room-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {currentRooms.map((room, index) => {
            const isBooked = room.status === 'occupied';
            const isCleaning = room.status === 'cleaning';
            const isMaintenance = room.status === 'maintenance';
            const isVacant = room.status === 'vacant';

            let statusLabel = 'Vacant';
            let statusBg = 'var(--color-gold-light)';
            let statusColor = 'var(--color-gold)';
            let StatusIcon = CheckCircle;

            if (isBooked) {
              statusLabel = 'Booked';
              statusBg = 'var(--bg-tertiary)';
              statusColor = 'var(--text-muted)';
              StatusIcon = ShieldAlert;
            } else if (isCleaning) {
              statusLabel = 'Housekeeping';
              statusBg = 'rgba(56, 189, 248, 0.15)';
              statusColor = '#38bdf8';
              StatusIcon = Sparkles;
            } else if (isMaintenance) {
              statusLabel = 'Maintenance';
              statusBg = 'rgba(239, 68, 68, 0.15)';
              statusColor = '#ef4444';
              StatusIcon = Wrench;
            }

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
                  borderTop: isVacant ? '3px solid var(--color-gold)' : (isMaintenance ? '3px solid #ef4444' : '3px solid var(--text-muted)')
                }}
              >
                {/* Status Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{
                    fontSize: '1.25rem',
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 'bold',
                    color: isVacant ? 'var(--color-gold)' : 'var(--text-muted)'
                  }}>
                    No. {room.number}
                  </span>
                  
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    letterSpacing: '0.08em',
                    padding: '0.2rem 0.6rem',
                    textTransform: 'uppercase',
                    backgroundColor: statusBg,
                    color: statusColor,
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <StatusIcon size={12} /> {statusLabel}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>{room.type}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: (isBooked || isCleaning) ? '0.5rem' : '1.5rem' }}>{room.description}</p>
                  
                  {isBooked && room.checkIn && (() => {
                    const status = getStayStatus(room.checkIn, room.nights || 1);
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
                          <span style={{ color: 'var(--text-muted)' }}>Stay Duration:</span>
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
                    {isVacant ? 'Book Suite →' : 'Details'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= MODAL: ROOM UNDER MAINTENANCE ================= */}
        {isMaintenanceModalOpen && selectedRoom && (
          <div className="modal-overlay" onClick={() => setIsMaintenanceModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ borderTop: '6px solid #ef4444' }}>
              <button className="modal-close" onClick={() => setIsMaintenanceModalOpen(false)}>
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
                  <Wrench size={32} />
                </div>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Room {selectedRoom.number} Under Maintenance
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
                borderLeft: '3px solid #ef4444'
              }}>
                <p style={{ marginBottom: '0.4rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                  This suite is temporarily withheld for preventative maintenance and quality inspection.
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Please select any other vacant chamber on Floor 0{activeFloor}.
                </p>
              </div>

              <div className="modal-btn-row" style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setIsMaintenanceModalOpen(false)}
                  className="btn-black"
                  style={{ flex: 1, padding: '0.8rem' }}
                >
                  Choose Another Suite
                </button>
              </div>
            </div>
          </div>
        )}

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
                  Room {selectedRoom.number} {selectedRoom.status === 'cleaning' ? 'In Preparation' : 'Occupied'}
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
                  This room has already been reserved and locked in our database.
                </p>
                {selectedRoom.checkIn && (() => {
                  const status = getStayStatus(selectedRoom.checkIn, selectedRoom.nights || 1);
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1rem', marginTop: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Check-in Date:</span>
                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{selectedRoom.checkIn}</span>
                      
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

              <div className="modal-btn-row" style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setIsBookedModalOpen(false)}
                  className="btn-black"
                  style={{ flex: 1, padding: '0.8rem' }}
                >
                  Choose Another Room
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODAL: BOOKING FORM (LANDSCAPE 2-COLUMN) ================= */}
        {isFormModalOpen && selectedRoom && (
          <div className="modal-overlay" onClick={() => setIsFormModalOpen(false)}>
            <div
              className="modal-content book-suite-modal"
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
                <div>
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-serif)' }}>
                    Reserve Suite {selectedRoom.number}
                  </h3>
                  <span style={{ color: 'var(--color-gold)', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {selectedRoom.type} &bull; Floor 0{selectedRoom.floor || activeFloor} &bull; ${selectedRoom.price}/Night
                  </span>
                </div>
                <button className="modal-close" onClick={() => setIsFormModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleBookingSubmit}>
                {/* 2-Column Landscape Split */}
                <div className="booking-form-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: '1.1fr 1fr',
                  gap: '1.5rem',
                  alignItems: 'start'
                }}>
                  {/* Left Column: Guest & Stay Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    <div>
                      <label className="form-label" htmlFor="guest-name" style={{ fontSize: '0.75rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <User size={13} className="text-gold" /> Full Name
                        </span>
                      </label>
                      <input
                        type="text"
                        id="guest-name"
                        className="form-input"
                        placeholder="e.g. Alexandra Sterling"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        style={{ fontSize: '0.85rem', padding: '0.5rem 0.8rem' }}
                      />
                      {errors.guestName && (
                        <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                          {errors.guestName}
                        </span>
                      )}
                    </div>

                    <div className="booking-mini-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
                      <div>
                        <label className="form-label" htmlFor="guest-email" style={{ fontSize: '0.75rem' }}>Email Address</label>
                        <input
                          type="email"
                          id="guest-email"
                          className="form-input"
                          placeholder="alexandra@mail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          style={{ fontSize: '0.85rem', padding: '0.5rem 0.8rem' }}
                        />
                      </div>
                      <div>
                        <label className="form-label" htmlFor="guest-phone" style={{ fontSize: '0.75rem' }}>Phone Number</label>
                        <input
                          type="text"
                          id="guest-phone"
                          className="form-input"
                          placeholder="+234 803 123 4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          style={{ fontSize: '0.85rem', padding: '0.5rem 0.8rem' }}
                        />
                      </div>
                    </div>

                    <div className="booking-mini-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.7rem' }}>
                      <div>
                        <label className="form-label" htmlFor="check-in-date" style={{ fontSize: '0.75rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Calendar size={13} className="text-gold" /> Check-in Date
                          </span>
                        </label>
                        <input
                          type="date"
                          id="check-in-date"
                          className="form-input"
                          value={checkInDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setCheckInDate(e.target.value)}
                          style={{ fontSize: '0.85rem', padding: '0.5rem 0.8rem' }}
                        />
                        {errors.checkInDate && (
                          <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                            {errors.checkInDate}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="form-label" htmlFor="stay-duration" style={{ fontSize: '0.75rem' }}>
                          Duration (Nights)
                        </label>
                        <input
                          type="number"
                          id="stay-duration"
                          className="form-input"
                          min="1"
                          max="30"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value.replace(/[^0-9]/g, ''))}
                          style={{ fontSize: '0.85rem', padding: '0.5rem 0.8rem' }}
                        />
                        {errors.duration && (
                          <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                            {errors.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Suite Overview & Fare Quotation */}
                  <div style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    padding: '1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    {/* Chamber Spec Summary */}
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.3rem' }}>
                        Chamber Specification
                      </span>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>
                        Suite {selectedRoom.number} &bull; {selectedRoom.type}
                      </strong>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: '1.4' }}>
                        {selectedRoom.description}
                      </p>
                    </div>

                    {/* Fare Quotation Box */}
                    <div style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px dashed var(--border-gold)',
                      borderRadius: '2px',
                      padding: '0.9rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                        <span>Tariff / Night</span>
                        <span>${selectedRoom.price}.00</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                        <span>Stay Duration</span>
                        <span>x {nightsCount} Night{nightsCount > 1 ? 's' : ''}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid var(--border-color)',
                        paddingTop: '0.6rem',
                        fontWeight: 'bold'
                      }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Total Amount</span>
                        <span className="text-gold" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', lineHeight: 1 }}>
                          ${selectedRoom.price * nightsCount}.00
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="booking-actions" style={{ display: 'flex', gap: '0.6rem' }}>
                      <button
                        type="button"
                        onClick={() => setIsFormModalOpen(false)}
                        className="btn-outline"
                        style={{ flex: 1, padding: '0.7rem', fontSize: '0.8rem' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-gold"
                        style={{ flex: 1.6, padding: '0.7rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                      >
                        Confirm Booking & Pay
                      </button>
                    </div>
                  </div>
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
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>RECEIPT NUMBER</span>
                    <strong style={{ color: 'var(--color-gold)', fontFamily: 'monospace' }}>{successBooking.receiptNo}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>SUITE TYPE</span>
                    <strong>{successBooking.type}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>DURATION</span>
                    <strong>{successBooking.nights} Night(s)</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>STATUS</span>
                    <strong style={{ color: '#22c55e' }}>VERIFIED ONLINE</strong>
                  </div>
                  <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.2rem' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>AMOUNT SETTLED</span>
                    <strong className="text-gold" style={{ fontSize: '1.1rem' }}>${successBooking.totalPrice}.00</strong>
                  </div>
                </div>
              </div>

              <div className="modal-btn-row" style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => downloadBookingReceipt(successBooking)}
                  className="btn-gold"
                  style={{ flex: 1, padding: '0.8rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <Printer size={16} /> Print E-Receipt
                </button>
                <button
                  onClick={() => setSuccessBooking(null)}
                  className="btn-black"
                  style={{ flex: 1, padding: '0.8rem' }}
                >
                  Return to Rooms
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
