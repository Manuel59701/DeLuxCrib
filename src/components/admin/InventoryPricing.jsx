import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  Save, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Percent, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { updateRoomPricing, updateHallPricing, saveStore } from '../../utils/dataStore';

export default function InventoryPricing({ store, user, onRefresh }) {
  const [seasonalMultiplier, setSeasonalMultiplier] = useState(store.settings?.seasonalMultiplier || 1.0);
  const [currencySymbol, setCurrencySymbol] = useState(store.settings?.currency || '$');
  const [nairaRate, setNairaRate] = useState(store.settings?.nairaExchangeRate || 1550);
  const [notice, setNotice] = useState(null);

  // Edit Room Rates State
  const [roomsState, setRoomsState] = useState(store.rooms);
  // Edit Hall Rates State
  const [hallsState, setHallsState] = useState(store.halls);

  const handleRoomPriceChange = (floor, roomNum, val) => {
    const parsed = parseInt(val, 10) || 0;
    setRoomsState(prev => ({
      ...prev,
      [floor]: prev[floor].map(r => r.number === roomNum ? { ...r, price: parsed } : r)
    }));
  };

  const handleHallPriceChange = (hallId, val) => {
    const parsed = parseInt(val, 10) || 0;
    setHallsState(prev => prev.map(h => h.id === hallId ? { ...h, pricePerDay: parsed } : h));
  };

  const handleSaveAllChanges = (e) => {
    e.preventDefault();
    const updatedStore = {
      ...store,
      rooms: roomsState,
      halls: hallsState,
      settings: {
        ...store.settings,
        seasonalMultiplier: parseFloat(seasonalMultiplier),
        currency: currencySymbol,
        nairaExchangeRate: parseInt(nairaRate, 10)
      }
    };
    saveStore(updatedStore);
    setNotice('Pricing matrix, seasonal adjustments, and inventory successfully updated.');
    if (onRefresh) onRefresh();
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        backgroundColor: 'var(--card-bg)',
        padding: '1.2rem 1.5rem',
        border: '1px solid var(--border-color)',
        borderRadius: '2px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>
              Rates, Inventory & Seasonal Adjustments
            </h2>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: '700',
              padding: '0.15rem 0.5rem',
              borderRadius: '2px',
              backgroundColor: 'var(--color-gold)',
              color: '#000000',
              textTransform: 'uppercase'
            }}>
              ADMIN ONLY
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Configure standard room tariffs, venue fees, exchange rates, and dynamic seasonal pricing.
          </p>
        </div>

        <button
          onClick={handleSaveAllChanges}
          className="btn-gold"
          style={{
            padding: '0.7rem 1.4rem',
            fontSize: '0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Save size={16} /> Save Tariff Changes
        </button>
      </div>

      {notice && (
        <div style={{
          padding: '0.75rem 1.2rem',
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid #22c55e',
          color: '#22c55e',
          borderRadius: '2px',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={16} /> {notice}
        </div>
      )}

      {/* Global Adjustments / Multiplier Card */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '2px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={18} className="text-gold" /> Macro Policies & Dynamic Multipliers
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
          <div>
            <label className="form-label">Seasonal Rate Multiplier</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <input
                type="range"
                min="0.8"
                max="1.8"
                step="0.05"
                value={seasonalMultiplier}
                onChange={(e) => setSeasonalMultiplier(e.target.value)}
                style={{ flex: 1, accentColor: 'var(--color-gold)' }}
              />
              <span style={{ fontWeight: 'bold', color: 'var(--color-gold)', width: '45px', textAlign: 'right' }}>
                {parseFloat(seasonalMultiplier).toFixed(2)}x
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {seasonalMultiplier > 1 ? `Surge pricing: +${Math.round((seasonalMultiplier - 1) * 100)}%` : (seasonalMultiplier < 1 ? `Discount pricing: -${Math.round((1 - seasonalMultiplier) * 100)}%` : 'Standard Base Rates (1.0x)')}
            </span>
          </div>

          <div>
            <label className="form-label">USD to NGN Naira Peg (₦/$)</label>
            <input
              type="number"
              className="form-input"
              value={nairaRate}
              onChange={(e) => setNairaRate(e.target.value)}
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Auto-calculates payment gateway invoice conversions
            </span>
          </div>

          <div>
            <label className="form-label">Room Locking Engine</label>
            <div style={{
              padding: '0.6rem 0.8rem',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '2px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              <ShieldCheck size={16} className="text-gold" />
              <span>Anti-Double Booking Room Lock: <strong>ENABLED</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Hall Tariffs Table */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '2px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} className="text-gold" /> Event Space Daily Tariffs
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {hallsState.map(hall => (
            <div key={hall.id} style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              padding: '1.2rem',
              borderRadius: '2px'
            }}>
              <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                {hall.name}
              </strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                Capacity: {hall.capacity}
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Base Tariff / Day ($ USD)</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={14} className="text-gold" style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="number"
                    className="form-input"
                    value={hall.pricePerDay}
                    onChange={(e) => handleHallPriceChange(hall.id, e.target.value)}
                    style={{ paddingLeft: '1.8rem', fontWeight: 'bold' }}
                  />
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-gold)', marginTop: '0.3rem' }}>
                  Equivalent: ₦{(hall.pricePerDay * nairaRate).toLocaleString()} NGN
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Tariffs by Floor */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '2px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={18} className="text-gold" /> Chamber & Suite Nightly Rates
        </h3>

        {Object.entries(roomsState).map(([floorNum, floorRooms]) => (
          <div key={floorNum} style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
              Floor 0{floorNum} ({floorRooms[0]?.type})
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.8rem' }}>
              {floorRooms.map(r => (
                <div key={r.number} style={{
                  padding: '0.8rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '2px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', fontFamily: 'var(--font-serif)' }}>Room {r.number}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Fl. 0{floorNum}</span>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <DollarSign size={13} className="text-gold" style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="number"
                      className="form-input"
                      value={r.price}
                      onChange={(e) => handleRoomPriceChange(floorNum, r.number, e.target.value)}
                      style={{ paddingLeft: '1.5rem', fontSize: '0.85rem', padding: '0.4rem 0.4rem 0.4rem 1.5rem' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
