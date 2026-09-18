import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle, 
  User, 
  Sparkles, 
  Wrench,
  X
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
      <div style={{
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
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
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
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
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
