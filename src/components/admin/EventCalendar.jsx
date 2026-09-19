import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Plus, 
  Ban, 
  Check, 
  X,
  ChevronLeft,
  ChevronRight,
  Unlock
} from 'lucide-react';
import { 
  createEventBooking, 
  blockHallDate, 
  unblockHallDate,
  releaseEventBooking,
  INITIAL_HALLS 
} from '../../utils/dataStore';

export default function EventCalendar({ store, user, onRefresh }) {
  const [currentMonth, setCurrentMonth] = useState(8); // September 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [notice, setNotice] = useState(null);

  // New Event Form
  const [eventForm, setEventForm] = useState({
    hallId: 'gala',
    clientName: '',
    date: '2026-09-26',
    days: 1,
    guestCount: 60
  });

  // Block Date Form
  const [blockForm, setBlockForm] = useState({
    hallId: 'gala',
    date: '2026-09-27',
    reason: 'Stage Rigging / Sound Check'
  });

  const halls = store.halls || INITIAL_HALLS;
  const eventBookings = store.eventBookings || [];
  const blockedDates = store.blockedDates || [];

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!eventForm.clientName.trim()) return;

    const hall = halls.find(h => h.id === eventForm.hallId) || halls[0];
    createEventBooking({
      ...eventForm,
      hallName: hall.name,
      totalAmount: hall.pricePerDay * parseInt(eventForm.days, 10),
      paymentStatus: 'confirmed',
      eventStatus: 'confirmed'
    }, user?.name || 'Event Officer');

    setShowAddModal(false);
    setNotice(`Booked ${hall.name} for ${eventForm.clientName}!`);
    if (onRefresh) onRefresh();
    setTimeout(() => setNotice(null), 3000);
  };

  const handleBlockSubmit = (e) => {
    e.preventDefault();
    const hall = halls.find(h => h.id === blockForm.hallId) || halls[0];
    blockHallDate(hall.id, hall.name, blockForm.date, blockForm.reason, user?.name || 'Event Officer');
    setShowBlockModal(false);
    setNotice(`Date ${blockForm.date} blocked for ${hall.name}.`);
    if (onRefresh) onRefresh();
    setTimeout(() => setNotice(null), 3000);
  };

  const handleReleaseEvent = (ev) => {
    if (!window.confirm(`Release the booking for "${ev.clientName}" on ${ev.date}? The date will become available again.`)) return;
    releaseEventBooking(ev.id, user?.name || 'Event Officer');
    setNotice(`Released ${ev.hallName} on ${ev.date} — the date is now available.`);
    if (onRefresh) onRefresh();
    setSelectedDate(null);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleReleaseBlock = (block) => {
    if (!window.confirm(`Release the hold on ${block.date} (${block.hallName})?`)) return;
    unblockHallDate(block.id, user?.name || 'Event Officer');
    setNotice(`Released hold on ${block.date} for ${block.hallName}.`);
    if (onRefresh) onRefresh();
    setSelectedDate(null);
    setTimeout(() => setNotice(null), 4000);
  };

  const selectedEvents = selectedDate ? eventBookings.filter(e => e.date === selectedDate) : [];
  const selectedBlocks = selectedDate ? blockedDates.filter(b => b.date === selectedDate) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {/* Top Controls */}
      <div className="admin-toolbar" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        backgroundColor: 'var(--card-bg)',
        padding: '1rem 1.5rem',
        border: '1px solid var(--border-color)',
        borderRadius: '4px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', margin: 0 }}>
            Event Hall Bookings & Calendar
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Schedule and manage reservations for all 3 hotel venues
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            onClick={() => setShowBlockModal(true)}
            className="btn-outline"
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.75rem', borderColor: '#ef4444', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Ban size={14} /> Block Date
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-gold"
            style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Plus size={14} /> Book Event Space
          </button>
        </div>
      </div>

      {notice && (
        <div style={{ padding: '0.6rem 1rem', backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#22c55e', borderRadius: '4px', fontSize: '0.85rem' }}>
          ✓ {notice}
        </div>
      )}

      {/* 2-Column Split: Calendar Matrix & Upcoming Events List */}
      <div className="event-split" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.2rem' }}>
        {/* Calendar Grid */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          padding: '1.2rem'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setCurrentMonth(prev => prev === 0 ? 11 : prev - 1)}
                style={{ padding: '0.3rem', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '2px' }}
              >
                <ChevronLeft size={16} />
              </button>
              <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)' }}>
                {monthNames[currentMonth]} {currentYear}
              </strong>
              <button
                onClick={() => setCurrentMonth(prev => prev === 11 ? 0 : prev + 1)}
                style={{ padding: '0.3rem', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '2px' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {eventBookings.length} scheduled event(s)
            </span>
          </div>

          {/* Weekdays */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} style={{ minHeight: '60px', opacity: 0.1 }} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dNum = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;
              const dayEvents = eventBookings.filter(e => e.date === dateStr);
              const isBlocked = blockedDates.some(b => b.date === dateStr);
              const isClickable = dayEvents.length > 0 || isBlocked;

              return (
                <div
                  key={dateStr}
                  onClick={() => isClickable && setSelectedDate(dateStr)}
                  title={isClickable ? 'Click to manage / release this date' : undefined}
                  style={{
                    minHeight: '60px',
                    padding: '0.3rem',
                    border: '1px solid var(--border-color)',
                    backgroundColor: dayEvents.length > 0 ? 'var(--color-gold-light)' : (isBlocked ? 'rgba(239, 68, 68, 0.1)' : 'transparent'),
                    borderRadius: '2px',
                    fontSize: '0.75rem',
                    cursor: isClickable ? 'pointer' : 'default',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: dayEvents.length > 0 ? 'bold' : 'normal' }}>
                    <span>{dNum}</span>
                    {isBlocked && <span style={{ color: '#ef4444', fontSize: '0.65rem' }}>HOLD</span>}
                  </div>
                  {dayEvents.map(ev => (
                    <div
                      key={ev.id}
                      style={{
                        fontSize: '0.6rem',
                        backgroundColor: 'var(--color-gold)',
                        color: '#000000',
                        padding: '1px 3px',
                        borderRadius: '2px',
                        marginTop: '2px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        fontWeight: 'bold'
                      }}
                      title={`${ev.clientName} (${ev.hallName})`}
                    >
                      {ev.clientName.split(' ')[0]}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events List */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          padding: '1.2rem'
        }}>
          <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Booked Venue Schedule
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '420px', overflowY: 'auto' }}>
            {eventBookings.map(ev => (
              <div
                key={ev.id}
                style={{
                  padding: '0.8rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderLeft: '3px solid var(--color-gold)',
                  borderRadius: '2px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.85rem' }}>{ev.clientName}</strong>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-gold)' }}>${ev.totalAmount}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {ev.hallName}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                  <span>📅 Date: {ev.date}</span>
                  <span>👥 {ev.guestCount} Guests</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Book Hall Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', borderTop: '5px solid var(--color-gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', margin: 0 }}>Book Event Space</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label className="form-label">Select Hall</label>
                <select
                  className="form-input"
                  value={eventForm.hallId}
                  onChange={(e) => setEventForm({ ...eventForm, hallId: e.target.value })}
                >
                  {halls.map(h => (
                    <option key={h.id} value={h.id}>{h.name} (${h.pricePerDay}/day)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Client / Event Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sterling Gala Dinner"
                  value={eventForm.clientName}
                  onChange={(e) => setEventForm({ ...eventForm, clientName: e.target.value })}
                  required
                />
              </div>

              <div className="event-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Event Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Guest Count</label>
                  <input
                    type="number"
                    className="form-input"
                    value={eventForm.guestCount}
                    onChange={(e) => setEventForm({ ...eventForm, guestCount: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline" style={{ flex: 1, padding: '0.7rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-gold" style={{ flex: 1.5, padding: '0.7rem' }}>
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Block Date Modal */}
      {showBlockModal && (
        <div className="modal-overlay" onClick={() => setShowBlockModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', borderTop: '5px solid #ef4444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', margin: 0 }}>Block Venue Date</h3>
              <button className="modal-close" onClick={() => setShowBlockModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleBlockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label className="form-label">Venue</label>
                <select
                  className="form-input"
                  value={blockForm.hallId}
                  onChange={(e) => setBlockForm({ ...blockForm, hallId: e.target.value })}
                >
                  {halls.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={blockForm.date}
                  onChange={(e) => setBlockForm({ ...blockForm, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label">Reason</label>
                <input
                  type="text"
                  className="form-input"
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                  placeholder="e.g. Stage maintenance"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowBlockModal(false)} className="btn-outline" style={{ flex: 1, padding: '0.7rem' }}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 1.5, padding: '0.7rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '2px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Block Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage / Release Booked Date Modal */}
      {selectedDate && (
        <div className="modal-overlay" onClick={() => setSelectedDate(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', borderTop: '5px solid var(--color-gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', margin: 0 }}>
                Manage Date: {selectedDate}
              </h3>
              <button className="modal-close" onClick={() => setSelectedDate(null)}><X size={18} /></button>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 0, marginBottom: '1.2rem' }}>
              Release a booking to make this date available again.
            </p>

            {selectedEvents.length === 0 && selectedBlocks.length === 0 && (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No bookings or holds on this date.
              </div>
            )}

            {selectedEvents.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: selectedBlocks.length > 0 ? '1.2rem' : 0 }}>
                <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold)' }}>
                  Booked Venues ({selectedEvents.length})
                </strong>
                {selectedEvents.map(ev => (
                  <div
                    key={ev.id}
                    style={{
                      padding: '0.9rem',
                      backgroundColor: 'var(--bg-secondary)',
                      borderLeft: '3px solid var(--color-gold)',
                      borderRadius: '2px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.9rem' }}>{ev.clientName}</strong>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-gold)' }}>${ev.totalAmount}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {ev.hallName} &bull; 👥 {ev.guestCount} Guests
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.7rem', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                        Status: {ev.eventStatus}
                      </span>
                      <button
                        onClick={() => handleReleaseEvent(ev)}
                        className="btn-outline"
                        style={{
                          padding: '0.45rem 0.8rem',
                          fontSize: '0.72rem',
                          borderColor: '#ef4444',
                          color: '#ef4444',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <Unlock size={13} /> Release Date
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedBlocks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ef4444' }}>
                  Held Dates ({selectedBlocks.length})
                </strong>
                {selectedBlocks.map(block => (
                  <div
                    key={block.id}
                    style={{
                      padding: '0.9rem',
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                      borderLeft: '3px solid #ef4444',
                      borderRadius: '2px'
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>{block.hallName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {block.reason}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.7rem' }}>
                      <button
                        onClick={() => handleReleaseBlock(block)}
                        className="btn-outline"
                        style={{
                          padding: '0.45rem 0.8rem',
                          fontSize: '0.72rem',
                          borderColor: '#ef4444',
                          color: '#ef4444',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <Unlock size={13} /> Release Hold
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
