import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  CheckCircle, 
  User, 
  Sparkles, 
  Wrench,
  X,
  ArrowUpDown,
  CalendarArrowUp,
  CalendarArrowDown,
  CalendarDays,
  CalendarX2
} from 'lucide-react';
import { updateRoomStatus } from '../../utils/dataStore';

const STATUSES = [
  { id: 'vacant', label: 'Vacant', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', icon: CheckCircle },
  { id: 'occupied', label: 'Occupied', color: '#d4af37', bg: 'rgba(212, 175, 55, 0.15)', icon: User },
  { id: 'cleaning', label: 'Cleaning', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', icon: Sparkles },
  { id: 'maintenance', label: 'Maintenance', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: Wrench }
];

export default function OccupancyBoard({ store, user, onRefresh }) {
  const [activeFloor, setActiveFloor] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [notice, setNotice] = useState(null);
  const [sortDir, setSortDir] = useState(null); // null | 'asc' | 'desc'
  const [filterDate, setFilterDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const bookingsSorted = useMemo(() => {
    let list = [...(store.bookings || [])];
    if (filterDate) {
      list = list.filter(b => (b.date || b.checkIn || '').slice(0, 10) === filterDate);
    }
    if (!sortDir) return list;
    return list.sort((a, b) => {
      const da = new Date(a.date || a.checkIn || 0).getTime();
      const db = new Date(b.date || b.checkIn || 0).getTime();
      return sortDir === 'asc' ? da - db : db - da;
    });
  }, [store.bookings, sortDir, filterDate]);

  const rooms = store.rooms || {};
  const allRooms = Object.values(rooms).flat();
  const vacantCount = allRooms.filter(r => r.status === 'vacant').length;
  const occupiedCount = allRooms.filter(r => r.status === 'occupied').length;

  const handleQuickStatusChange = (roomNumber, newStatus) => {
    updateRoomStatus(roomNumber, newStatus, null, user?.name || 'Staff');
    setNotice(`Room ${roomNumber} changed to ${newStatus.toUpperCase()}`);
    setSelectedRoom(null);
    if (onRefresh) onRefresh();
    setTimeout(() => setNotice(null), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {/* Quick Summary & Floor Tabs */}
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
        {/* Floor Filter Tabs */}
        <div className="floor-tabs" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Rooms' },
            { id: '1', label: 'Floor 1 (Deluxe)' },
            { id: '2', label: 'Floor 2 (Executive)' },
            { id: '3', label: 'Floor 3 (Presidential)' },
            { id: '4', label: 'Floor 4 (Penthouse)' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFloor(f.id)}
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.75rem',
                fontWeight: activeFloor === f.id ? 'bold' : 'normal',
                borderRadius: '4px',
                border: activeFloor === f.id ? '1px solid var(--color-gold)' : '1px solid var(--border-color)',
                backgroundColor: activeFloor === f.id ? 'var(--bg-tertiary)' : 'transparent',
                color: activeFloor === f.id ? 'var(--color-gold)' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Quick Counts */}
        <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSortDir(prev => (prev === null ? 'asc' : prev === 'asc' ? 'desc' : null))}
            title="Sort bookings by check-in date"
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderRadius: '4px',
              cursor: 'pointer',
              border: sortDir ? '1px solid var(--color-gold)' : '1px solid var(--border-color)',
              backgroundColor: sortDir ? 'var(--bg-tertiary)' : 'transparent',
              color: sortDir ? 'var(--color-gold)' : 'var(--text-secondary)',
              fontWeight: sortDir ? 'bold' : 'normal'
            }}
          >
            {sortDir === 'asc' ? <CalendarArrowUp size={14} /> : sortDir === 'desc' ? <CalendarArrowDown size={14} /> : <ArrowUpDown size={14} />}
            {sortDir === 'asc' ? 'Check-in: Oldest First' : sortDir === 'desc' ? 'Check-in: Newest First' : 'Sort by Check-in Date'}
          </button>
          <button
            onClick={() => setShowDatePicker(prev => !prev)}
            title="Filter by specific check-in date"
            style={{
              padding: '0.4rem 0.7rem',
              fontSize: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderRadius: '4px',
              cursor: 'pointer',
              border: (showDatePicker || filterDate) ? '1px solid var(--color-gold)' : '1px solid var(--border-color)',
              backgroundColor: (showDatePicker || filterDate) ? 'var(--bg-tertiary)' : 'transparent',
              color: (showDatePicker || filterDate) ? 'var(--color-gold)' : 'var(--text-secondary)',
              fontWeight: (showDatePicker || filterDate) ? 'bold' : 'normal'
            }}
          >
            <CalendarDays size={14} />
            {filterDate || 'Pick a Date'}
            {filterDate && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); setFilterDate(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') setFilterDate(''); }}
                title="Clear date filter"
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                <CalendarX2 size={13} />
              </span>
            )}
          </button>
          <span style={{ color: '#22c55e', fontWeight: 'bold' }}>● {vacantCount} Vacant</span>
          <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>● {occupiedCount} Occupied</span>
          <span style={{ color: 'var(--text-muted)' }}>({allRooms.length} Total Rooms)</span>
        </div>
      </div>

      {notice && (
        <div style={{ padding: '0.6rem 1rem', backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#22c55e', borderRadius: '4px', fontSize: '0.85rem' }}>
          ✓ {notice}
        </div>
      )}

      {/* Bookings ordered by check-in date (Front Desk) */}
      {showDatePicker && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          backgroundColor: 'var(--card-bg)',
          padding: '0.7rem 1.2rem',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          fontSize: '0.8rem'
        }}>
          <CalendarDays size={15} style={{ color: 'var(--color-gold)' }} />
          <label style={{ fontWeight: 'bold' }}>Check-in date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ maxWidth: '200px', padding: '0.4rem 0.6rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
          />
          {filterDate && (
            <button onClick={() => setFilterDate('')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Clear
            </button>
          )}
          <span style={{ color: 'var(--text-muted)' }}>
            {filterDate ? `Showing bookings for ${filterDate} (${bookingsSorted.length})` : 'Pick a date to filter bookings'}
          </span>
        </div>
      )}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '0.7rem 1.2rem', backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: 'bold' }}>
          Front Desk Bookings by Check-in Date ({bookingsSorted.length}){sortDir ? (sortDir === 'asc' ? ' · Oldest → Newest' : ' · Newest → Oldest') : ''}
        </div>
        <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
          {bookingsSorted.map(b => (
            <div key={b.receiptNo} style={{ padding: '0.55rem 1.2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
              <span><strong style={{ color: 'var(--color-gold)', fontFamily: 'monospace' }}>{b.receiptNo}</strong> · {b.guestName} · Room {b.roomNumber}</span>
              <span style={{ color: 'var(--text-muted)' }}>Check-in: {b.date || b.checkIn || '—'} ({b.nights} night{b.nights > 1 ? 's' : ''})</span>
            </div>
          ))}
          {bookingsSorted.length === 0 && (
            <div style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>No bookings found.</div>
          )}
        </div>
      </div>

      {/* Floors & Room Cards */}
      {Object.entries(rooms)
        .filter(([floor]) => activeFloor === 'all' || activeFloor === String(floor))
        .map(([floor, floorRooms]) => (
          <div key={floor} style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '1.2rem 1.5rem'
          }}>
            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Floor 0{floor} &bull; {floorRooms[0]?.type}
            </h3>

            <div className="occupancy-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {floorRooms.map(room => {
                const statusObj = STATUSES.find(s => s.id === room.status) || STATUSES[0];
                const Icon = statusObj.icon;

                return (
                  <div
                    key={room.number}
                    onClick={() => setSelectedRoom(room)}
                    style={{
                      padding: '1rem',
                      borderRadius: '4px',
                      border: `1px solid ${statusObj.color}40`,
                      borderTop: `4px solid ${statusObj.color}`,
                      backgroundColor: 'var(--bg-secondary)',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)' }}>Room {room.number}</strong>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '2px',
                        backgroundColor: statusObj.bg,
                        color: statusObj.color,
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}>
                        <Icon size={11} /> {statusObj.label}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                      {room.guest ? (
                        <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                          Guest: {room.guest}
                        </div>
                      ) : (
                        <span>${room.price}/night</span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.7rem', color: 'var(--color-gold)', textAlign: 'right', fontWeight: 'bold' }}>
                      Change Status &rarr;
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      {/* Room Status Toggle Modal */}
      {selectedRoom && (
        <div className="modal-overlay" onClick={() => setSelectedRoom(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', borderTop: '5px solid var(--color-gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', margin: 0 }}>Room {selectedRoom.number}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)' }}>{selectedRoom.type}</span>
              </div>
              <button className="modal-close" onClick={() => setSelectedRoom(null)}><X size={18} /></button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Select a new status for this room:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {STATUSES.map(st => {
                const isCurrent = selectedRoom.status === st.id;
                const Icon = st.icon;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleQuickStatusChange(selectedRoom.number, st.id)}
                    style={{
                      padding: '0.8rem',
                      border: isCurrent ? `2px solid ${st.color}` : '1px solid var(--border-color)',
                      backgroundColor: isCurrent ? st.bg : 'transparent',
                      color: isCurrent ? st.color : 'var(--text-primary)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: isCurrent ? 'bold' : 'normal'
                    }}
                  >
                    <Icon size={16} />
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
