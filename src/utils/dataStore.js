// Centralized reactive data store for De Lux Crib
// Provides shared state between Public Guest Pages and Admin/Staff Portal with localStorage persistence

const STORE_KEY = 'delux_crib_store_v1';
const AUTH_KEY = 'delux_crib_staff_auth_v1';

export const ROLES = {
  ADMIN: {
    id: 'admin',
    name: 'Administrator',
    badge: 'System Admin',
    description: 'Full access to all modules, financial reporting, pricing, and system controls.',
    color: '#d4af37'
  },
  FDO: {
    id: 'fdo',
    name: 'Front Desk Officer',
    badge: 'Front Desk',
    description: 'E-receipt verification, payment confirmation, guest check-in/out, and room cleaning/maintenance status.',
    color: '#38bdf8'
  },
  EFO: {
    id: 'efo',
    name: 'Event & Facility Officer',
    badge: 'Event & Facility',
    description: 'Event hall calendar, hall capacity matching, venue bookings, date blocking, and setup coordination.',
    color: '#a855f7'
  }
};

export const DEMO_USERS = [
  {
    id: 'usr_admin',
    role: 'admin',
    name: 'Victoria Sterling',
    email: 'admin@deluxcrib.com',
    avatar: '👑',
    title: 'General Manager & Director'
  },
  {
    id: 'usr_fdo',
    role: 'fdo',
    name: 'Sarah Jenkins',
    email: 'frontdesk@deluxcrib.com',
    avatar: '🛎️',
    title: 'Senior Front Desk Officer'
  },
  {
    id: 'usr_efo',
    role: 'efo',
    name: 'Marcus Vance',
    email: 'events@deluxcrib.com',
    avatar: '🎭',
    title: 'Event & Facilities Director'
  }
];

export const INITIAL_ROOMS = {
  1: [
    { number: '101', floor: 1, type: 'Deluxe Room', price: 150, status: 'vacant', guest: null, description: 'King size bed, city view, walk-in shower' },
    { number: '102', floor: 1, type: 'Deluxe Room', price: 150, status: 'occupied', guest: 'Sarah Jenkins', bookingRef: 'DLX-102-20260806', checkIn: '2026-08-06', nights: 3, description: 'Twin beds, garden view, office workspace' },
    { number: '103', floor: 1, type: 'Deluxe Room', price: 150, status: 'vacant', guest: null, description: 'King size bed, quiet courtyard view, smart TV' },
    { number: '104', floor: 1, type: 'Deluxe Room', price: 150, status: 'cleaning', guest: null, description: 'King size bed, marble bathroom, minibar' },
    { number: '105', floor: 1, type: 'Deluxe Room', price: 150, status: 'vacant', guest: null, description: 'Twin beds, garden view, premium coffee maker' },
    { number: '106', floor: 1, type: 'Deluxe Room', price: 150, status: 'vacant', guest: null, description: 'King size bed, city view, lounge chair' }
  ],
  2: [
    { number: '201', floor: 2, type: 'Executive Suite', price: 280, status: 'vacant', guest: null, description: 'Spacious parlor, king size bed, balcony' },
    { number: '202', floor: 2, type: 'Executive Suite', price: 280, status: 'maintenance', guest: null, description: 'Double balcony, workspace, luxury bathtub' },
    { number: '203', floor: 2, type: 'Executive Suite', price: 280, status: 'occupied', guest: 'Robert Chen', bookingRef: 'DLX-203-20260807', checkIn: '2026-08-07', nights: 5, description: 'Lounge area, Nespresso machine, city views' },
    { number: '204', floor: 2, type: 'Executive Suite', price: 280, status: 'vacant', guest: null, description: 'Premium bedding, rainfall shower, workspace' },
    { number: '205', floor: 2, type: 'Executive Suite', price: 280, status: 'vacant', guest: null, description: 'Corner suite, high floor, luxury bath amenities' },
    { number: '206', floor: 2, type: 'Executive Suite', price: 280, status: 'vacant', guest: null, description: 'Spacious lounge, dining area, king bed' }
  ],
  3: [
    { number: '301', floor: 3, type: 'Premium Presidential', price: 490, status: 'occupied', guest: 'Elena Rostova', bookingRef: 'DLX-301-20260804', checkIn: '2026-08-04', nights: 2, description: 'Private butler service, panoramic views, hot tub' },
    { number: '302', floor: 3, type: 'Premium Presidential', price: 490, status: 'vacant', guest: null, description: 'En-suite dining room, master bedroom, smart automation' },
    { number: '303', floor: 3, type: 'Premium Presidential', price: 490, status: 'vacant', guest: null, description: 'Jacuzzi bath, bar cabinet, custom art collections' },
    { number: '304', floor: 3, type: 'Premium Presidential', price: 490, status: 'cleaning', guest: null, description: 'Double bedroom, walk-in wardrobe, high terrace' },
    { number: '305', floor: 3, type: 'Premium Presidential', price: 490, status: 'vacant', guest: null, description: 'Dedicated work office, luxury spa room access' },
    { number: '306', floor: 3, type: 'Premium Presidential', price: 490, status: 'vacant', guest: null, description: 'Grand lounge, cocktail bar, wrap-around balcony' }
  ],
  4: [
    { number: '401', floor: 4, type: 'De Lux Penthouse', price: 950, status: 'vacant', guest: null, description: 'Private rooftop pool, 360-degree skylines, helipad access' },
    { number: '402', floor: 4, type: 'De Lux Penthouse', price: 950, status: 'occupied', guest: 'Lord Sterling', bookingRef: 'DLX-402-20260810', checkIn: '2026-08-10', nights: 7, description: 'Private elevator, movie theater, cocktail lounge, grand deck' }
  ]
};

export const INITIAL_BOOKINGS = [
  {
    receiptNo: 'DLX-102-20260806',
    roomNumber: '102',
    floor: 1,
    type: 'Deluxe Room',
    guestName: 'Sarah Jenkins',
    email: 'sarah.j@crestview.io',
    phone: '+234 803 123 4567',
    date: '2026-08-06',
    nights: 3,
    totalPrice: 450,
    paymentStatus: 'confirmed', // confirmed, pending, online_verified
    stayStatus: 'checked_in', // upcoming, checked_in, checked_out, cancelled
    paymentMethod: 'Paystack / Online',
    createdAt: '2026-08-05T14:30:00Z',
    verifiedBy: 'System Auto-Reconciliation'
  },
  {
    receiptNo: 'DLX-203-20260807',
    roomNumber: '203',
    floor: 2,
    type: 'Executive Suite',
    guestName: 'Robert Chen',
    email: 'robert.chen@apexcapital.ng',
    phone: '+234 812 998 1122',
    date: '2026-08-07',
    nights: 5,
    totalPrice: 1400,
    paymentStatus: 'confirmed',
    stayStatus: 'checked_in',
    paymentMethod: 'Bank Transfer (POS Verified)',
    createdAt: '2026-08-06T09:15:00Z',
    verifiedBy: 'Front Desk (Sarah Jenkins)'
  },
  {
    receiptNo: 'DLX-301-20260804',
    roomNumber: '301',
    floor: 3,
    type: 'Premium Presidential',
    guestName: 'Elena Rostova',
    email: 'elena.rostova@monaco-yachts.com',
    phone: '+44 7700 900123',
    date: '2026-08-04',
    nights: 2,
    totalPrice: 980,
    paymentStatus: 'confirmed',
    stayStatus: 'checked_in',
    paymentMethod: 'Flutterwave / Card',
    createdAt: '2026-08-03T18:40:00Z',
    verifiedBy: 'System Auto-Reconciliation'
  },
  {
    receiptNo: 'DLX-402-20260810',
    roomNumber: '402',
    floor: 4,
    type: 'De Lux Penthouse',
    guestName: 'Lord Sterling',
    email: 'sterling.privy@ukholdings.co.uk',
    phone: '+234 809 777 0000',
    date: '2026-08-10',
    nights: 7,
    totalPrice: 6650,
    paymentStatus: 'confirmed',
    stayStatus: 'checked_in',
    paymentMethod: 'Direct Wire Transfer',
    createdAt: '2026-08-08T11:20:00Z',
    verifiedBy: 'Victoria Sterling (Admin)'
  },
  {
    receiptNo: 'DLX-105-20260920',
    roomNumber: '105',
    floor: 1,
    type: 'Deluxe Room',
    guestName: 'Dr. Chidi Okafor',
    email: 'chidi.okafor@medsurge.org',
    phone: '+234 802 334 5566',
    date: '2026-09-20',
    nights: 4,
    totalPrice: 600,
    paymentStatus: 'pending',
    stayStatus: 'upcoming',
    paymentMethod: 'Pay on Arrival / Transfer Pending',
    createdAt: '2026-09-17T16:00:00Z',
    verifiedBy: null
  }
];

export const INITIAL_HALLS = [
  {
    id: 'gala',
    name: 'The Grand Gala Hall',
    capacity: '50 - 150 guests',
    maxCapacity: 150,
    minCapacity: 50,
    pricePerDay: 2500,
    status: 'available',
    description: 'A stately hall with towering crystal chandeliers, golden drapery, and a private stage.'
  },
  {
    id: 'rooftop',
    name: 'Vortex Sky Deck (Rooftop Lounge)',
    capacity: '20 - 80 guests',
    maxCapacity: 80,
    minCapacity: 20,
    pricePerDay: 1800,
    status: 'available',
    description: 'An open-air luxury deck overlooking the city skyline, equipped with fire pits, ambient fairy lights.'
  },
  {
    id: 'boardroom',
    name: 'Sovereign Boardroom & Salon',
    capacity: '10 - 25 guests',
    maxCapacity: 25,
    minCapacity: 10,
    pricePerDay: 1000,
    status: 'available',
    description: 'A wood-crafted corporate salon offering state-of-the-art projection systems and leather seating.'
  }
];

export const INITIAL_EVENT_BOOKINGS = [
  {
    id: 'EVE-901',
    refNo: 'DLX-EVE-GALA-901',
    hallId: 'gala',
    hallName: 'The Grand Gala Hall',
    clientName: 'Chevron Leadership Summit',
    email: 'events@chevron-ng.com',
    phone: '+234 803 555 1212',
    eventType: 'Corporate Board Meeting / Banquet',
    date: '2026-09-22',
    days: 2,
    guestCount: 120,
    totalAmount: 5000,
    paymentStatus: 'confirmed',
    eventStatus: 'confirmed', // reserved, confirmed, setup, in_progress, completed, cancelled
    seatingStyle: 'Banquet Rounds (12 tables)',
    createdAt: '2026-09-10T10:00:00Z'
  },
  {
    id: 'EVE-902',
    refNo: 'DLX-EVE-ROOF-902',
    hallId: 'rooftop',
    hallName: 'Vortex Sky Deck (Rooftop Lounge)',
    clientName: 'Adewale & Folake Wedding Reception',
    email: 'adewale.f@gmail.com',
    phone: '+234 818 444 8899',
    eventType: 'Wedding Banquet',
    date: '2026-09-25',
    days: 1,
    guestCount: 75,
    totalAmount: 1800,
    paymentStatus: 'confirmed',
    eventStatus: 'confirmed',
    seatingStyle: 'Cocktail & Lounge High Tops',
    createdAt: '2026-09-12T15:30:00Z'
  },
  {
    id: 'EVE-903',
    refNo: 'DLX-EVE-BRD-903',
    hallId: 'boardroom',
    hallName: 'Sovereign Boardroom & Salon',
    clientName: 'Zenith Tech Ventures Q3 Review',
    email: 'contact@zenithtech.io',
    phone: '+234 701 223 9900',
    eventType: 'Corporate Board Meeting',
    date: '2026-09-28',
    days: 1,
    guestCount: 18,
    totalAmount: 1000,
    paymentStatus: 'pending',
    eventStatus: 'reserved',
    seatingStyle: 'U-Shape Executive Boardroom',
    createdAt: '2026-09-18T08:00:00Z'
  }
];

export const INITIAL_BLOCKED_DATES = [
  {
    id: 'BLK-01',
    hallId: 'gala',
    hallName: 'The Grand Gala Hall',
    date: '2026-09-30',
    reason: 'Audio-Visual Rigging & Chandelier Maintenance',
    blockedBy: 'Marcus Vance (EFO)'
  }
];

export const INITIAL_LOGS = [
  { id: 'log_1', time: 'Today, 08:30 AM', actor: 'System', action: 'Occupancy engine synchronized 20 rooms across 4 floors.' },
  { id: 'log_2', time: 'Today, 09:15 AM', actor: 'Sarah Jenkins (FDO)', action: 'Verified e-receipt DLX-203-20260807 for Robert Chen (Executive Suite 203).' },
  { id: 'log_3', time: 'Today, 10:00 AM', actor: 'Marcus Vance (EFO)', action: 'Confirmed The Grand Gala Hall reservation for Chevron Leadership Summit.' },
  { id: 'log_4', time: 'Today, 11:45 AM', actor: 'Victoria Sterling (Admin)', action: 'Approved seasonal discount policies & updated Penthouse tier amenities.' }
];

const SESSION_STORE_KEY = 'delux_session_store';

// Detect hard refresh (browser reload) vs SPA soft navigation
function isHardRefresh() {
  try {
    const nav = performance.getEntriesByType('navigation')[0];
    return nav && nav.type === 'reload';
  } catch (e) {
    return false;
  }
}

// In-memory reactive store — persisted to sessionStorage so hash-nav changes survive
let memoryStore = null;

export function getDefaultStore() {
  return JSON.parse(JSON.stringify({
    rooms: INITIAL_ROOMS,
    bookings: INITIAL_BOOKINGS,
    halls: INITIAL_HALLS,
    eventBookings: INITIAL_EVENT_BOOKINGS,
    blockedDates: INITIAL_BLOCKED_DATES,
    logs: INITIAL_LOGS,
    settings: {
      currency: '$',
      nairaExchangeRate: 1550,
      vatPercent: 7.5,
      seasonalMultiplier: 1.0,
      autoLockRooms: true
    }
  }));
}

// Initialize and retrieve store.
// — Hard refresh (F5 / browser reload): always resets to defaults.
// — Hash/SPA navigation within same tab: restores from sessionStorage so
//   admin room-status changes are immediately visible on the guest side.
export function getStore() {
  if (memoryStore) return memoryStore;

  if (isHardRefresh()) {
    // Clear stale session data and start fresh
    try { sessionStorage.removeItem(SESSION_STORE_KEY); } catch (_) {}
    memoryStore = getDefaultStore();
    return memoryStore;
  }

  // Try to restore from sessionStorage (preserves admin edits across navigation)
  try {
    const raw = sessionStorage.getItem(SESSION_STORE_KEY);
    if (raw) {
      memoryStore = JSON.parse(raw);
      return memoryStore;
    }
  } catch (_) {}

  memoryStore = getDefaultStore();
  return memoryStore;
}

export function saveStore(store) {
  memoryStore = store;
  try { sessionStorage.setItem(SESSION_STORE_KEY, JSON.stringify(store)); } catch (_) {}
  window.dispatchEvent(new CustomEvent('delux_store_updated', { detail: store }));
}

export function resetStore() {
  memoryStore = getDefaultStore();
  try { sessionStorage.removeItem(SESSION_STORE_KEY); } catch (_) {}
  window.dispatchEvent(new CustomEvent('delux_store_updated', { detail: memoryStore }));
  return memoryStore;
}

// Staff Auth Helper
export function getStaffAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse auth:', e);
  }
  return null;
}

export function setStaffAuth(user) {
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
  window.dispatchEvent(new CustomEvent('delux_auth_updated', { detail: user }));
}

// Log an action to the audit trail
export function appendAuditLog(actor, action) {
  const store = getStore();
  const newLog = {
    id: 'log_' + Date.now(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (' + new Date().toLocaleDateString() + ')',
    actor,
    action
  };
  store.logs = [newLog, ...(store.logs || [])].slice(0, 50);
  saveStore(store);
}

// Check if a room is available
export function isRoomAvailable(roomNumber) {
  const store = getStore();
  for (const floor of Object.values(store.rooms)) {
    const r = floor.find(rm => String(rm.number) === String(roomNumber));
    if (r) {
      return r.status === 'vacant';
    }
  }
  return false;
}

// Update room status
export function updateRoomStatus(roomNumber, newStatus, guestDetails = null, actor = 'Staff') {
  const store = getStore();
  let found = false;
  let roomType = '';

  for (const floorNum of Object.keys(store.rooms)) {
    store.rooms[floorNum] = store.rooms[floorNum].map(rm => {
      if (String(rm.number) === String(roomNumber)) {
        found = true;
        roomType = rm.type;
        return {
          ...rm,
          status: newStatus,
          guest: guestDetails ? guestDetails.name || guestDetails : (newStatus === 'vacant' ? null : rm.guest),
          bookingRef: guestDetails ? guestDetails.bookingRef || rm.bookingRef : (newStatus === 'vacant' ? null : rm.bookingRef),
          checkIn: guestDetails ? guestDetails.checkIn || rm.checkIn : (newStatus === 'vacant' ? null : rm.checkIn),
          nights: guestDetails ? guestDetails.nights || rm.nights : (newStatus === 'vacant' ? null : rm.nights)
        };
      }
      return rm;
    });
  }

  if (found) {
    appendAuditLog(actor, `Updated Room ${roomNumber} (${roomType}) status to "${newStatus}".`);
    saveStore(store);
  }
  return found;
}

// Add a public/front-desk booking
export function createRoomBooking(bookingData, actor = 'Guest / Online Portal') {
  const store = getStore();
  const receiptNo = bookingData.receiptNo || `DLX-${bookingData.roomNumber}-${String(bookingData.date || '').replace(/\D/g, '') || Date.now().toString().slice(-6)}`;
  
  const newBooking = {
    receiptNo,
    roomNumber: String(bookingData.roomNumber),
    floor: bookingData.floor || Math.floor(parseInt(bookingData.roomNumber) / 100) || 1,
    type: bookingData.type || 'Deluxe Room',
    guestName: bookingData.name || bookingData.guestName || 'Guest',
    email: bookingData.email || 'guest@example.com',
    phone: bookingData.phone || '—',
    date: bookingData.date || new Date().toISOString().split('T')[0],
    nights: parseInt(bookingData.nights, 10) || 1,
    totalPrice: Number(bookingData.totalPrice) || 150,
    paymentStatus: bookingData.paymentStatus || 'confirmed',
    stayStatus: bookingData.stayStatus || 'upcoming',
    paymentMethod: bookingData.paymentMethod || 'Online Paystack / Card',
    createdAt: new Date().toISOString(),
    verifiedBy: bookingData.paymentStatus === 'confirmed' ? actor : null
  };

  // Prepend to bookings
  store.bookings = [newBooking, ...store.bookings.filter(b => b.receiptNo !== receiptNo)];

  // Update room state to occupied
  for (const floorNum of Object.keys(store.rooms)) {
    store.rooms[floorNum] = store.rooms[floorNum].map(rm => {
      if (String(rm.number) === String(bookingData.roomNumber)) {
        return {
          ...rm,
          status: 'occupied',
          guest: newBooking.guestName,
          bookingRef: receiptNo,
          checkIn: newBooking.date,
          nights: newBooking.nights
        };
      }
      return rm;
    });
  }

  appendAuditLog(actor, `Booked Room ${newBooking.roomNumber} for ${newBooking.guestName} (Receipt: ${receiptNo}, $${newBooking.totalPrice}).`);
  saveStore(store);

  return newBooking;
}

// Verify payment by Receipt Number
export function verifyReceiptPayment(receiptNo, staffUser) {
  const store = getStore();
  let verifiedBooking = null;

  store.bookings = store.bookings.map(b => {
    if (b.receiptNo.trim().toUpperCase() === receiptNo.trim().toUpperCase()) {
      verifiedBooking = {
        ...b,
        paymentStatus: 'confirmed',
        verifiedBy: staffUser ? `${staffUser.name} (${staffUser.title || staffUser.role.toUpperCase()})` : 'Front Desk Officer'
      };
      return verifiedBooking;
    }
    return b;
  });

  if (verifiedBooking) {
    appendAuditLog(
      staffUser ? staffUser.name : 'Front Desk',
      `Confirmed payment for Receipt #${receiptNo} ($${verifiedBooking.totalPrice} - Guest: ${verifiedBooking.guestName}).`
    );
    saveStore(store);
  }

  return verifiedBooking;
}

// Check-in guest by Receipt Number
export function checkInGuest(receiptNo, staffUser) {
  const store = getStore();
  let updatedBooking = null;

  store.bookings = store.bookings.map(b => {
    if (b.receiptNo.trim().toUpperCase() === receiptNo.trim().toUpperCase()) {
      updatedBooking = {
        ...b,
        stayStatus: 'checked_in',
        paymentStatus: 'confirmed',
        checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      return updatedBooking;
    }
    return b;
  });

  if (updatedBooking) {
    // Ensure room is marked occupied
    updateRoomStatus(updatedBooking.roomNumber, 'occupied', {
      name: updatedBooking.guestName,
      bookingRef: updatedBooking.receiptNo,
      checkIn: updatedBooking.date,
      nights: updatedBooking.nights
    }, staffUser ? staffUser.name : 'Front Desk');

    appendAuditLog(
      staffUser ? staffUser.name : 'Front Desk',
      `Checked-in guest ${updatedBooking.guestName} to Room ${updatedBooking.roomNumber}.`
    );
    saveStore(store);
  }

  return updatedBooking;
}

// Check-out guest by Receipt Number
export function checkOutGuest(receiptNo, staffUser) {
  const store = getStore();
  let updatedBooking = null;

  store.bookings = store.bookings.map(b => {
    if (b.receiptNo.trim().toUpperCase() === receiptNo.trim().toUpperCase()) {
      updatedBooking = {
        ...b,
        stayStatus: 'checked_out',
        checkOutTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      return updatedBooking;
    }
    return b;
  });

  if (updatedBooking) {
    // Release room to cleaning
    updateRoomStatus(updatedBooking.roomNumber, 'cleaning', null, staffUser ? staffUser.name : 'Front Desk');

    appendAuditLog(
      staffUser ? staffUser.name : 'Front Desk',
      `Checked-out guest ${updatedBooking.guestName} from Room ${updatedBooking.roomNumber}. Room marked for Cleaning.`
    );
    saveStore(store);
  }

  return updatedBooking;
}

// Helper to get array of YYYY-MM-DD date strings for a date range
export function getDateRange(startDateStr, days = 1) {
  if (!startDateStr) return [];
  const numDays = Math.max(1, parseInt(days, 10) || 1);
  const parts = startDateStr.split('-').map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    return [startDateStr];
  }
  const [y, m, d] = parts;
  const dates = [];
  for (let i = 0; i < numDays; i++) {
    const cur = new Date(y, m - 1, d + i);
    const yStr = cur.getFullYear();
    const mStr = String(cur.getMonth() + 1).padStart(2, '0');
    const dStr = String(cur.getDate()).padStart(2, '0');
    dates.push(`${yStr}-${mStr}-${dStr}`);
  }
  return dates;
}

// Check if a hall is available for the given start date and duration
export function checkHallAvailability(hallId, startDateStr, days = 1) {
  const store = getStore();
  if (!startDateStr) return { available: true };
  const requestedDates = getDateRange(startDateStr, days);

  for (const dateStr of requestedDates) {
    // 1. Check if blocked by admin / EFO
    const blocked = (store.blockedDates || []).find(b => 
      (b.hallId === hallId || b.hallId === 'all') && b.date === dateStr
    );
    if (blocked) {
      return {
        available: false,
        reason: `This venue is not available on the selected date. Please choose another date.`,
        type: 'blocked',
        conflict: blocked,
        conflictingDate: dateStr
      };
    }

    // 2. Check if already booked by another event
    const existing = (store.eventBookings || []).find(ev => {
      if (ev.eventStatus === 'cancelled') return false;
      if (ev.hallId !== hallId && hallId !== 'all') return false;
      const bookedDates = getDateRange(ev.date, ev.days || 1);
      return bookedDates.includes(dateStr);
    });

    if (existing) {
      return {
        available: false,
        reason: `This venue is not available on the selected date. Please choose another date.`,
        type: 'booked',
        conflict: existing,
        conflictingDate: dateStr
      };
    }
  }

  return { available: true };
}

// Get all booked & blocked dates for a specific hall
export function getHallOccupiedDates(hallId) {
  const store = getStore();
  const occupied = [];

  // Add booked dates
  (store.eventBookings || []).forEach(ev => {
    if (ev.eventStatus !== 'cancelled' && (ev.hallId === hallId || hallId === 'all')) {
      const dates = getDateRange(ev.date, ev.days || 1);
      dates.forEach(d => {
        occupied.push({
          date: d,
          type: 'booked',
          clientName: ev.clientName,
          eventType: ev.eventType,
          refNo: ev.refNo
        });
      });
    }
  });

  // Add blocked dates
  (store.blockedDates || []).forEach(b => {
    if (b.hallId === hallId || b.hallId === 'all') {
      occupied.push({
        date: b.date,
        type: 'blocked',
        reason: b.reason
      });
    }
  });

  return occupied;
}

// Create or update Event Hall reservation
export function createEventBooking(eventData, actor = 'Client / Event Portal') {
  const store = getStore();
  const refNo = eventData.refNo || `DLX-EVE-${String(eventData.hallId || 'HALL').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newEvent = {
    id: 'EVE-' + Date.now().toString().slice(-4),
    refNo,
    hallId: eventData.hallId,
    hallName: eventData.hallName,
    clientName: eventData.clientName || eventData.name,
    email: eventData.email,
    phone: eventData.phone || '—',
    eventType: eventData.eventType || 'Special Event',
    date: eventData.date,
    days: parseInt(eventData.days, 10) || 1,
    guestCount: parseInt(eventData.guestCount, 10) || 50,
    totalAmount: Number(eventData.totalAmount) || 2000,
    paymentStatus: eventData.paymentStatus || 'confirmed',
    paymentMethod: eventData.paymentMethod || 'Online Payment (Paystack / Card)',
    eventStatus: eventData.eventStatus || 'confirmed',
    seatingStyle: eventData.seatingStyle || 'Standard Setup',
    createdAt: new Date().toISOString()
  };

  store.eventBookings = [newEvent, ...(store.eventBookings || [])];
  appendAuditLog(actor, `Reserved hall "${newEvent.hallName}" for ${newEvent.clientName} on ${newEvent.date} (${newEvent.guestCount} guests). Method: ${newEvent.paymentMethod}.`);
  saveStore(store);

  return newEvent;
}

// Update Event status (Reserved -> Confirmed -> Setup -> Completed)
export function updateEventStatus(eventId, newStatus, actor = 'Event Officer') {
  const store = getStore();
  let updatedEvent = null;

  store.eventBookings = (store.eventBookings || []).map(ev => {
    if (ev.id === eventId || ev.refNo === eventId) {
      updatedEvent = { ...ev, eventStatus: newStatus };
      if (newStatus === 'confirmed') {
        updatedEvent.paymentStatus = 'confirmed';
      }
      return updatedEvent;
    }
    return ev;
  });

  if (updatedEvent) {
    appendAuditLog(actor, `Updated event "${updatedEvent.clientName}" status to "${newStatus}".`);
    saveStore(store);
  }
  return updatedEvent;
}

// Block a date for hall maintenance / VIP setup
export function blockHallDate(hallId, hallName, date, reason, actor = 'Event Officer') {
  const store = getStore();
  const newBlock = {
    id: 'BLK-' + Date.now(),
    hallId,
    hallName,
    date,
    reason: reason || 'Scheduled Maintenance / Stage Rigging',
    blockedBy: actor
  };

  store.blockedDates = [newBlock, ...(store.blockedDates || [])];
  appendAuditLog(actor, `Blocked date ${date} for ${hallName} (${reason}).`);
  saveStore(store);
  return newBlock;
}

// Unblock a date
export function unblockHallDate(blockId, actor = 'Event Officer') {
  const store = getStore();
  store.blockedDates = (store.blockedDates || []).filter(b => b.id !== blockId);
  appendAuditLog(actor, `Unblocked hall schedule block #${blockId}.`);
  saveStore(store);
}

// Update Room Pricing & Hall Pricing (Admin Only)
export function updateRoomPricing(floorNum, roomNumber, newPrice, actor = 'Admin') {
  const store = getStore();
  if (store.rooms[floorNum]) {
    store.rooms[floorNum] = store.rooms[floorNum].map(r => {
      if (String(r.number) === String(roomNumber)) {
        return { ...r, price: Number(newPrice) };
      }
      return r;
    });
    appendAuditLog(actor, `Updated Room ${roomNumber} base nightly rate to $${newPrice}.`);
    saveStore(store);
  }
}

export function updateHallPricing(hallId, newPricePerDay, actor = 'Admin') {
  const store = getStore();
  store.halls = (store.halls || []).map(h => {
    if (h.id === hallId) {
      return { ...h, pricePerDay: Number(newPricePerDay) };
    }
    return h;
  });
  appendAuditLog(actor, `Updated Hall ${hallId} daily rate to $${newPricePerDay}.`);
  saveStore(store);
}
