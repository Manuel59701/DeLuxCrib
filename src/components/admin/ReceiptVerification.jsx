import React, { useState } from 'react';
import { 
  Search, 
  FileCheck2, 
  CheckCircle, 
  Printer, 
  UserCheck, 
  DoorOpen, 
  CreditCard, 
  ShieldCheck, 
  Plus,
  X,
  Building2,
  Banknote,
  Smartphone
} from 'lucide-react';
import { 
  verifyReceiptPayment, 
  checkInGuest, 
  checkOutGuest,
  createRoomBooking
} from '../../utils/dataStore';
import { downloadBookingReceipt } from '../../utils/receipt';

export default function ReceiptVerification({ store, user, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(() => store.bookings?.[0] || null);
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [notice, setNotice] = useState(null);

  // Walk-in form state with Floor, Room & Payment Confirmation
  const [walkinFloor, setWalkinFloor] = useState('1');
  const [walkin, setWalkin] = useState({
    roomNumber: '101',
    name: '',
    phone: '',
    nights: 1,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'POS Terminal (Card)',
    paymentRef: '',
    paymentConfirmed: true
  });

  const bookings = store.bookings || [];

  // Filter bookings by receipt number or name
  const filtered = bookings.filter(b => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      b.receiptNo?.toLowerCase().includes(q) ||
      b.guestName?.toLowerCase().includes(q) ||
      b.roomNumber?.toLowerCase().includes(q)
    );
  });

  const handleFloorChange = (newFloor) => {
    setWalkinFloor(newFloor);
    const roomsOnFloor = store.rooms?.[newFloor] || [];
    const firstVacant = roomsOnFloor.find(r => r.status === 'vacant');
    setWalkin(prev => ({
      ...prev,
      roomNumber: firstVacant ? firstVacant.number : (roomsOnFloor[0]?.number || '')
    }));
  };

  const handleConfirm = (booking) => {
    const updated = verifyReceiptPayment(booking.receiptNo, user);
    if (updated) {
      setSelectedReceipt(updated);
      setNotice(`Payment Confirmed for #${booking.receiptNo}!`);
      if (onRefresh) onRefresh();
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const handleCheckIn = (booking) => {
    const updated = checkInGuest(booking.receiptNo, user);
    if (updated) {
      setSelectedReceipt(updated);
      setNotice(`Guest ${booking.guestName} checked into Room ${booking.roomNumber}.`);
      if (onRefresh) onRefresh();
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const handleCheckOut = (booking) => {
    const updated = checkOutGuest(booking.receiptNo, user);
    if (updated) {
      setSelectedReceipt(updated);
      setNotice(`Guest ${booking.guestName} checked out. Room is ready for cleaning.`);
      if (onRefresh) onRefresh();
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const handlePrint = (booking) => {
    downloadBookingReceipt({
      roomNumber: booking.roomNumber,
      type: booking.type,
      name: booking.guestName,
      nights: booking.nights,
      date: booking.date,
      totalPrice: booking.totalPrice
    });
  };

  const handleWalkinSubmit = (e) => {
    e.preventDefault();
    if (!walkin.name.trim()) return;

    const floor = parseInt(walkinFloor, 10) || Math.floor(parseInt(walkin.roomNumber) / 100) || 1;
    const roomObj = (store.rooms[floor] || []).find(r => r.number === walkin.roomNumber);
    const total = (roomObj?.price || 150) * parseInt(walkin.nights, 10);

    const paymentMethodDisplay = walkin.paymentRef.trim()
      ? `${walkin.paymentMethod} (Ref: ${walkin.paymentRef.trim()})`
      : walkin.paymentMethod;

    const created = createRoomBooking({
      ...walkin,
      type: roomObj?.type || 'Deluxe Room',
      floor,
      totalPrice: total,
      stayStatus: 'checked_in',
      paymentStatus: 'confirmed',
      paymentMethod: paymentMethodDisplay
    }, `${user?.name || 'Front Desk'} (${walkin.paymentMethod} Confirmed)`);

    setSelectedReceipt(created);
    setShowWalkinModal(false);
    setNotice(`Walk-in guest ${created.guestName} checked in to Room ${created.roomNumber} (${paymentMethodDisplay} Confirmed)!`);
    if (onRefresh) onRefresh();
    setTimeout(() => setNotice(null), 3500);
  };

  // Rooms available on selected floor
  const roomsOnSelectedFloor = store.rooms?.[walkinFloor] || [];
  const selectedRoomObj = roomsOnSelectedFloor.find(r => r.number === walkin.roomNumber);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {/* Top Header & Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        backgroundColor: 'var(--card-bg)',
        padding: '1.2rem 1.5rem',
        border: '1px solid var(--border-color)',
        borderRadius: '4px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '280px', maxWidth: '500px' }}>
          <Search size={16} className="text-gold" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search Receipt No (e.g. DLX-102), Name, or Room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.6rem', fontSize: '0.85rem' }}
          />
        </div>

        {/* Walk-in Button */}
        <button
          onClick={() => {
            const firstVacant = (store.rooms?.[walkinFloor] || []).find(r => r.status === 'vacant');
            if (firstVacant) {
              setWalkin(prev => ({ ...prev, roomNumber: firstVacant.number }));
            }
            setShowWalkinModal(true);
          }}
          className="btn-gold"
          style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} /> New Walk-In Check-In
        </button>
      </div>

      {/* Notice Message */}
      {notice && (
        <div style={{
          padding: '0.8rem 1.2rem',
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid #22c55e',
          color: '#22c55e',
          borderRadius: '4px',
          fontSize: '0.85rem',
          fontWeight: '600'
        }}>
          &check; {notice}
        </div>
      )}

      {/* 2-Column Split: Booking List & Selected Receipt Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1.2rem', alignItems: 'start' }}>
        {/* Left: Receipts List */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '0.8rem 1.2rem', backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: 'bold' }}>
            All Booking Receipts ({filtered.length})
          </div>

          <div style={{ maxHeight: '560px', overflowY: 'auto' }}>
            {filtered.map(b => {
              const isSelected = selectedReceipt?.receiptNo === b.receiptNo;
              const isConfirmed = b.paymentStatus === 'confirmed';
              const isInHouse = b.stayStatus === 'checked_in';

              return (
                <div
                  key={b.receiptNo}
                  onClick={() => setSelectedReceipt(b)}
                  style={{
                    padding: '0.9rem 1.2rem',
                    borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                    borderLeft: isSelected ? '4px solid var(--color-gold)' : '4px solid transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--color-gold)', fontSize: '0.85rem' }}>
                        {b.receiptNo}
                      </span>
                      <span style={{
                        fontSize: '0.65rem',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '2px',
                        fontWeight: 'bold',
                        backgroundColor: isConfirmed ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                        color: isConfirmed ? '#22c55e' : '#eab308'
                      }}>
                        {isConfirmed ? 'PAID' : 'PENDING PAYMENT'}
                      </span>
                      {isInHouse && (
                        <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '2px', fontWeight: 'bold', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                          CHECKED IN
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {b.guestName} &bull; Room {b.roomNumber}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Date: {b.date} ({b.nights} night{b.nights > 1 ? 's' : ''})
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
                    ${b.totalPrice}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Receipt Detail & Action Buttons */}
        {selectedReceipt && (
          <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-gold)',
            borderRadius: '4px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-md)',
            position: 'sticky',
            top: '5rem'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Receipt</span>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-gold)', fontFamily: 'monospace', margin: 0 }}>
                  {selectedReceipt.receiptNo}
                </h3>
              </div>
              <span style={{
                padding: '0.3rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                borderRadius: '2px',
                backgroundColor: selectedReceipt.paymentStatus === 'confirmed' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                color: selectedReceipt.paymentStatus === 'confirmed' ? '#22c55e' : '#eab308'
              }}>
                {selectedReceipt.paymentStatus === 'confirmed' ? '✓ PAYMENT CONFIRMED' : '⚠ PENDING CONFIRMATION'}
              </span>
            </div>

            {/* Details Table */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.8rem',
              fontSize: '0.85rem',
              backgroundColor: 'var(--bg-tertiary)',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1.2rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>GUEST NAME</span>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedReceipt.guestName}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>ASSIGNED ROOM</span>
                <strong style={{ color: 'var(--color-gold)' }}>Room {selectedReceipt.roomNumber} ({selectedReceipt.type})</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>CHECK-IN DATE</span>
                <span>{selectedReceipt.date}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>STAY DURATION</span>
                <span>{selectedReceipt.nights} Night(s)</span>
              </div>
              <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>PAYMENT METHOD</span>
                  <span>{selectedReceipt.paymentMethod || 'Online Payment'}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>TOTAL AMOUNT</span>
                  <strong style={{ fontSize: '1.3rem', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
                    ${selectedReceipt.totalPrice}.00
                  </strong>
                </div>
              </div>
            </div>

            {/* 3 Main Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {selectedReceipt.paymentStatus !== 'confirmed' && (
                <button
                  onClick={() => handleConfirm(selectedReceipt)}
                  className="btn-gold"
                  style={{ width: '100%', padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                >
                  <CreditCard size={16} /> Confirm Payment
                </button>
              )}

              {selectedReceipt.stayStatus !== 'checked_in' && selectedReceipt.stayStatus !== 'checked_out' && (
                <button
                  onClick={() => handleCheckIn(selectedReceipt)}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    backgroundColor: '#22c55e',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <UserCheck size={16} /> Check In Guest (Issue Key)
                </button>
              )}

              {selectedReceipt.stayStatus === 'checked_in' && (
                <button
                  onClick={() => handleCheckOut(selectedReceipt)}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    backgroundColor: '#f97316',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <DoorOpen size={16} /> Check Out Guest & Free Room
                </button>
              )}

              <button
                onClick={() => handlePrint(selectedReceipt)}
                className="btn-outline"
                style={{ width: '100%', padding: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8rem' }}
              >
                <Printer size={15} /> Download PDF E-Receipt
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= LANDSCAPE WALK-IN POPUP MODAL ================= */}
      {showWalkinModal && (
        <div className="modal-overlay" onClick={() => setShowWalkinModal(false)}>
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
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.2rem',
              paddingBottom: '0.6rem',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-serif)', margin: 0, color: 'var(--text-primary)' }}>
                  Walk-In Guest Check-In & Settlement
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Instant room allocation, payment verification, and verified e-receipt issuance
                </span>
              </div>
              <button className="modal-close" onClick={() => setShowWalkinModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleWalkinSubmit}>
              {/* 2-Column Landscape Split */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
                alignItems: 'start'
              }}>
                {/* Left Column: Room & Guest Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  {/* Step 1: Floor Selection */}
                  <div>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      <Building2 size={13} className="text-gold" /> Step 1: Select Floor
                    </label>
                    <select
                      className="form-input"
                      value={walkinFloor}
                      onChange={(e) => handleFloorChange(e.target.value)}
                      style={{ cursor: 'pointer', fontSize: '0.85rem', padding: '0.5rem 0.8rem' }}
                    >
                      <option value="1">Floor 01 — Deluxe Chambers ($150/night)</option>
                      <option value="2">Floor 02 — Executive Suites ($280/night)</option>
                      <option value="3">Floor 03 — Presidential Luxury Suites ($490/night)</option>
                      <option value="4">Floor 04 — De Lux Penthouse Deck ($950/night)</option>
                    </select>
                  </div>

                  {/* Step 2: Room Selection */}
                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                      Step 2: Assign Room on Floor 0{walkinFloor}
                    </label>
                    <select
                      className="form-input"
                      value={walkin.roomNumber}
                      onChange={(e) => setWalkin({ ...walkin, roomNumber: e.target.value })}
                      style={{ cursor: 'pointer', fontSize: '0.85rem', padding: '0.5rem 0.8rem' }}
                    >
                      {roomsOnSelectedFloor.map((r) => {
                        const isVacant = r.status === 'vacant';
                        const isBooked = r.status === 'occupied';
                        const isCleaning = r.status === 'cleaning';
                        const isMaintenance = r.status === 'maintenance';

                        let badge = '[AVAILABLE]';
                        if (isBooked) badge = `[OCCUPIED${r.guest ? ': ' + r.guest : ''}]`;
                        else if (isCleaning) badge = '[CLEANING]';
                        else if (isMaintenance) badge = '[MAINTENANCE]';

                        return (
                          <option
                            key={r.number}
                            value={r.number}
                            disabled={!isVacant}
                            style={{
                              color: isVacant ? 'inherit' : '#888888',
                              backgroundColor: isVacant ? 'inherit' : '#f4f4f4',
                              fontWeight: isVacant ? 'bold' : 'normal'
                            }}
                          >
                            Room {r.number} ({r.type}) — ${r.price}/night {badge}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Guest Name */}
                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Guest Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Chief Adebayo Adeleke"
                      value={walkin.name}
                      onChange={(e) => setWalkin({ ...walkin, name: e.target.value })}
                      style={{ fontSize: '0.85rem', padding: '0.5rem 0.8rem' }}
                      required
                    />
                  </div>

                  {/* Phone & Check-In Date */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.6rem' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Phone Number</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="+234 803 000 0000"
                        value={walkin.phone}
                        onChange={(e) => setWalkin({ ...walkin, phone: e.target.value })}
                        style={{ fontSize: '0.85rem', padding: '0.5rem 0.8rem' }}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Stay Nights</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        className="form-input"
                        value={walkin.nights}
                        onChange={(e) => setWalkin({ ...walkin, nights: e.target.value })}
                        style={{ fontSize: '0.85rem', padding: '0.5rem 0.8rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Payment Method, Fare Calculation & Confirmation */}
                <div style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  padding: '1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem'
                }}>
                  {/* Fare Summary Box */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: '0.6rem'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Quotation</span>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Room {selectedRoomObj?.number || walkin.roomNumber} &times; {walkin.nights || 1} Night(s)
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Due</span>
                      <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)', lineHeight: 1 }}>
                        ${((selectedRoomObj?.price || 150) * (parseInt(walkin.nights, 10) || 1))}.00
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Payment Method 2x2 Grid */}
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                      Step 3: Confirmed Payment Method
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                      {[
                        { id: 'POS Terminal (Card)', label: 'POS Card Terminal', icon: CreditCard },
                        { id: 'Cash Settlement', label: 'Cash Settlement', icon: Banknote },
                        { id: 'Bank Transfer (Verified)', label: 'Bank Transfer', icon: Smartphone },
                        { id: 'Corporate Account / Voucher', label: 'Corporate Account', icon: ShieldCheck }
                      ].map(m => {
                        const isSelected = walkin.paymentMethod === m.id;
                        const Icon = m.icon;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setWalkin({ ...walkin, paymentMethod: m.id })}
                            style={{
                              padding: '0.5rem 0.6rem',
                              border: isSelected ? '2px solid var(--color-gold)' : '1px solid var(--border-color)',
                              backgroundColor: isSelected ? 'var(--card-bg)' : 'transparent',
                              color: isSelected ? 'var(--color-gold)' : 'var(--text-secondary)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontSize: '0.75rem',
                              fontWeight: isSelected ? 'bold' : 'normal',
                              textAlign: 'left'
                            }}
                          >
                            <Icon size={13} />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Transaction Ref / Code */}
                  <div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={`Approval code / reference (e.g. ${walkin.paymentMethod.includes('POS') ? 'STAN-9921' : (walkin.paymentMethod.includes('Cash') ? 'CSH-042' : 'TRF-8812')})`}
                      value={walkin.paymentRef}
                      onChange={(e) => setWalkin({ ...walkin, paymentRef: e.target.value })}
                      style={{ fontSize: '0.75rem', padding: '0.45rem 0.6rem' }}
                    />
                  </div>

                  {/* Staff Confirmation Checkbox */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.4rem',
                    fontSize: '0.72rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    lineHeight: '1.3'
                  }}>
                    <input
                      type="checkbox"
                      checked={walkin.paymentConfirmed}
                      onChange={(e) => setWalkin({ ...walkin, paymentConfirmed: e.target.checked })}
                      style={{ accentColor: 'var(--color-gold)', width: '15px', height: '15px', marginTop: '2px', flexShrink: 0 }}
                      required
                    />
                    <span>
                      I confirm payment of <strong>${((selectedRoomObj?.price || 150) * (parseInt(walkin.nights, 10) || 1))}.00</strong> has been received via <strong>{walkin.paymentMethod}</strong> before issuing key.
                    </span>
                  </label>

                  {/* Modal Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.2rem' }}>
                    <button
                      type="button"
                      onClick={() => setShowWalkinModal(false)}
                      className="btn-outline"
                      style={{ flex: 1, padding: '0.65rem', fontSize: '0.8rem' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-gold"
                      disabled={!selectedRoomObj || selectedRoomObj.status !== 'vacant' || !walkin.paymentConfirmed}
                      style={{ flex: 1.5, padding: '0.65rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                    >
                      Verify & Check In
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
