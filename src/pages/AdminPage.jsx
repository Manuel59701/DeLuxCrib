import React, { useState, useEffect } from 'react';
import { 
  getStaffAuth, 
  setStaffAuth, 
  getStore, 
  ROLES 
} from '../utils/dataStore';
import AdminLogin from '../components/admin/AdminLogin';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminSidebar from '../components/admin/AdminSidebar';
import ReceiptVerification from '../components/admin/ReceiptVerification';
import OccupancyBoard from '../components/admin/OccupancyBoard';
import EventCalendar from '../components/admin/EventCalendar';
import InventoryPricing from '../components/admin/InventoryPricing';
import ReportsAnalytics from '../components/admin/ReportsAnalytics';
import StaffManagement from '../components/admin/StaffManagement';
import AuditLog from '../components/admin/AuditLog';
import { 
  Building2, 
  FileCheck2, 
  Calendar, 
  DollarSign,
  UserPlus
} from 'lucide-react';

export default function AdminPage({ onExit }) {
  const [currentUser, setCurrentUser] = useState(() => getStaffAuth());
  const [activeTab, setActiveTab] = useState(() => {
    const auth = getStaffAuth();
    if (!auth) return 'receipts';
    if (auth.role === 'admin') return 'overview';
    if (auth.role === 'efo') return 'calendar';
    return 'receipts';
  });

  const [store, setStoreState] = useState(() => getStore());

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('delux_crib_theme');
    if (saved) return saved === 'dark';
    return true;
  });

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Sync theme
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('delux_crib_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('delux_crib_theme', 'light');
    }
  }, [darkMode]);

  // Set default tab on login / role change
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        setActiveTab(prev => ['overview', 'receipts', 'occupancy', 'calendar', 'pricing', 'analytics', 'staff'].includes(prev) ? prev : 'overview');
      } else if (currentUser.role === 'fdo') {
        setActiveTab(prev => ['receipts', 'occupancy'].includes(prev) ? prev : 'receipts');
      } else if (currentUser.role === 'efo') {
        setActiveTab('calendar');
      }
    }
  }, [currentUser?.role]);

  // Listen to store updates
  useEffect(() => {
    const handleStoreUpdate = (e) => {
      setStoreState(e.detail || getStore());
    };
    window.addEventListener('delux_store_updated', handleStoreUpdate);
    return () => window.removeEventListener('delux_store_updated', handleStoreUpdate);
  }, []);

  const refreshStore = () => {
    setStoreState(getStore());
  };

  const handleLogout = () => {
    setStaffAuth(null);
    setCurrentUser(null);
  };

  // If not logged in, show login page
  if (!currentUser) {
    return <AdminLogin onLoginSuccess={(usr) => setCurrentUser(usr)} onExit={onExit} />;
  }

  // Quick stats
  const allRoomsList = Object.values(store.rooms || {}).flat();
  const occupiedCount = allRoomsList.filter(r => r.status === 'occupied').length;
  const totalRooms = allRoomsList.length || 20;
  const pendingReceipts = (store.bookings || []).filter(b => b.paymentStatus === 'pending').length;
  const upcomingEvents = (store.eventBookings || []).filter(e => e.eventStatus !== 'completed' && e.eventStatus !== 'cancelled').length;
  const totalRevenue = (store.bookings || []).filter(b => b.paymentStatus === 'confirmed').reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0) +
    (store.eventBookings || []).filter(e => e.paymentStatus === 'confirmed').reduce((sum, e) => sum + (Number(e.totalAmount) || 0), 0);

  const roleMeta = ROLES[currentUser.role.toUpperCase()] || ROLES.ADMIN;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Navbar */}
      <AdminNavbar
        user={currentUser}
        onLogout={handleLogout}
        onExit={onExit}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Role-Based Navigation Bar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={currentUser.role}
      />

      {/* Quick Summary Pill Banner */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.6rem 1.5rem',
        fontSize: '0.8rem'
      }}>
        <div className="admin-summary-inner" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.8rem'
        }}>
          <div className="admin-summary-stats" style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
            <span>🏢 Occupancy: <strong className="text-gold">{Math.round((occupiedCount / totalRooms) * 100)}% ({occupiedCount}/{totalRooms} Rooms)</strong></span>
            <span>🧾 Pending Payments: <strong style={{ color: pendingReceipts > 0 ? '#eab308' : '#22c55e' }}>{pendingReceipts}</strong></span>
            <span>📅 Upcoming Events: <strong>{upcomingEvents}</strong></span>
            {currentUser.role === 'admin' && (
              <span>💰 Revenue: <strong className="text-gold">${totalRevenue.toLocaleString()}</strong></span>
            )}
          </div>

          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            Active Session: <strong>{currentUser.name}</strong> ({roleMeta.badge})
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="admin-main" style={{ flex: 1, padding: '1.5rem', maxWidth: '1280px', width: '100%', margin: '0 auto' }}>
        {/* ================= ADMIN OVERVIEW TAB ================= */}
        {activeTab === 'overview' && currentUser.role === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Greeting */}
            <div className="admin-greeting-card" style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-gold)',
              padding: '1.5rem',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-gold)', textTransform: 'uppercase' }}>
                  Full System Overview &bull; Executive Control
                </span>
                <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', margin: '0.2rem 0' }}>
                  Welcome, {currentUser.name}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  You have complete administrative oversight across front desk receipts, chamber occupancies, event halls, rates, and financial reports.
                </p>
              </div>

              <div className="admin-greeting-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setActiveTab('receipts')} className="btn-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                  Verify Receipts
                </button>
                <button onClick={() => setActiveTab('occupancy')} className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                  Room Grid
                </button>
                <button onClick={() => setActiveTab('calendar')} className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                  Event Halls
                </button>
                <button onClick={() => setActiveTab('staff')} className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserPlus size={15} /> Register Staff
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div onClick={() => setActiveTab('occupancy')} style={{ padding: '1.2rem', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderTop: '4px solid var(--color-gold)', borderRadius: '4px', cursor: 'pointer' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Live Occupancy</div>
                <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', fontWeight: 'bold', color: 'var(--color-gold)', margin: '0.2rem 0' }}>
                  {Math.round((occupiedCount / totalRooms) * 100)}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{occupiedCount} Booked / {totalRooms - occupiedCount} Free</div>
              </div>

              <div onClick={() => setActiveTab('receipts')} style={{ padding: '1.2rem', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderTop: '4px solid #eab308', borderRadius: '4px', cursor: 'pointer' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Receipts</div>
                <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', fontWeight: 'bold', color: '#eab308', margin: '0.2rem 0' }}>
                  {pendingReceipts}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Awaiting verification</div>
              </div>

              <div onClick={() => setActiveTab('calendar')} style={{ padding: '1.2rem', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderTop: '4px solid #a855f7', borderRadius: '4px', cursor: 'pointer' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Event Bookings</div>
                <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', fontWeight: 'bold', color: '#a855f7', margin: '0.2rem 0' }}>
                  {upcomingEvents}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Upcoming hall dates</div>
              </div>

              <div onClick={() => setActiveTab('analytics')} style={{ padding: '1.2rem', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderTop: '4px solid #22c55e', borderRadius: '4px', cursor: 'pointer' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Settled Revenue</div>
                <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', fontWeight: 'bold', color: 'var(--color-gold)', margin: '0.2rem 0' }}>
                  ${totalRevenue.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>View financial reports &rarr;</div>
              </div>
            </div>

            {/* Audit Log */}
            <AuditLog store={store} />
          </div>
        )}

        {/* ================= RECEIPT VERIFICATION (ADMIN & FDO) ================= */}
        {activeTab === 'receipts' && ['admin', 'fdo'].includes(currentUser.role) && (
          <ReceiptVerification
            store={store}
            user={currentUser}
            onRefresh={refreshStore}
          />
        )}

        {/* ================= OCCUPANCY BOARD (ADMIN & FDO) ================= */}
        {activeTab === 'occupancy' && ['admin', 'fdo'].includes(currentUser.role) && (
          <OccupancyBoard
            store={store}
            user={currentUser}
            onRefresh={refreshStore}
          />
        )}

        {/* ================= EVENT CALENDAR (ADMIN & EFO) ================= */}
        {activeTab === 'calendar' && ['admin', 'efo'].includes(currentUser.role) && (
          <EventCalendar
            store={store}
            user={currentUser}
            onRefresh={refreshStore}
          />
        )}

        {/* ================= RATES & TARIFFS (ADMIN ONLY) ================= */}
        {activeTab === 'pricing' && currentUser.role === 'admin' && (
          <InventoryPricing
            store={store}
            user={currentUser}
            onRefresh={refreshStore}
          />
        )}

        {/* ================= FINANCIAL REPORTS (ADMIN ONLY) ================= */}
        {activeTab === 'analytics' && currentUser.role === 'admin' && (
          <ReportsAnalytics
            store={store}
          />
        )}

        {/* ================= STAFF MANAGEMENT (ADMIN ONLY) ================= */}
        {activeTab === 'staff' && currentUser.role === 'admin' && (
          <StaffManagement
            user={currentUser}
          />
        )}
      </main>
    </div>
  );
}
