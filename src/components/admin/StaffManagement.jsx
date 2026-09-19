import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Users,
  Mail,
  Lock,
  User,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  X
} from 'lucide-react';
import {
  getStaffUsers,
  registerStaff,
  removeStaff,
  appendAuditLog,
  ROLES
} from '../../utils/dataStore';

const ROLE_OPTIONS = [ROLES.FDO, ROLES.EFO];

export default function StaffManagement({ user }) {
  const [staff, setStaff] = useState(() => getStaffUsers());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'fdo' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const handleStaffUpdate = (e) => setStaff(e.detail || getStaffUsers());
    window.addEventListener('delux_staff_updated', handleStaffUpdate);
    return () => window.removeEventListener('delux_staff_updated', handleStaffUpdate);
  }, []);

  const openModal = () => {
    setForm({ name: '', email: '', password: '', confirmPassword: '', role: 'fdo' });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password) {
      setError('Please provide an email and password for the staff member.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const created = registerStaff({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });
      appendAuditLog(
        user?.name || 'Administrator',
        `Registered new ${ROLES[created.role.toUpperCase()]?.name || 'staff'} account (${created.email})`
      );
      setNotice(`Staff account for ${created.email} was registered successfully.`);
      closeModal();
      setTimeout(() => setNotice(null), 4000);
    } catch (err) {
      setError(err.message || 'Unable to register staff account.');
    }
  };

  const handleRemove = (member) => {
    if (!window.confirm(`Remove staff account ${member.email}?`)) return;
    removeStaff(member.id);
    appendAuditLog(user?.name || 'Administrator', `Removed staff account (${member.email})`);
    setNotice(`Staff account for ${member.email} was removed.`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="admin-toolbar" style={{
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
            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', margin: 0 }}>
              Staff Management
            </h2>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-gold)',
              border: '1px solid var(--border-gold)',
              padding: '0.15rem 0.5rem',
              borderRadius: '2px'
            }}>
              Admin Only
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.3rem 0 0' }}>
            Register and manage Front Desk Officer (FDO) and Event &amp; Facility Officer (EFO) accounts.
          </p>
        </div>

        <button
          onClick={openModal}
          className="btn-gold"
          style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <UserPlus size={16} /> Register Staff
        </button>
      </div>

      {notice && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.8rem 1rem',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid #22c55e',
          color: '#22c55e',
          fontSize: '0.85rem',
          borderRadius: '2px'
        }}>
          <CheckCircle2 size={16} /> {notice}
        </div>
      )}

      {/* Staff Roster */}
      <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '2px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <Users size={18} className="text-gold" />
          <strong style={{ fontSize: '0.9rem' }}>Registered Staff</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({staff.length})</span>
        </div>

        {staff.length === 0 ? (
          <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No staff accounts have been registered yet. Click <strong className="text-gold">Register Staff</strong> to add an FDO or EFO.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {staff.map((member) => {
              const meta = ROLES[member.role.toUpperCase()] || ROLES.FDO;
              return (
                <div
                  key={member.id}
                  className="staff-row"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: 0 }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-tertiary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      flexShrink: 0
                    }}>
                      {member.avatar}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{member.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {member.email}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexShrink: 0 }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: meta.color,
                      border: `1px solid ${meta.color}`,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '2px'
                    }}>
                      {meta.badge}
                    </span>
                    <button
                      onClick={() => handleRemove(member)}
                      title="Remove staff account"
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        borderRadius: '2px',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '0.4rem',
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Register Staff Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} aria-label="Close">
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <UserPlus size={20} className="text-gold" />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', margin: 0 }}>Register New Staff</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', marginBottom: '1.5rem' }}>
              Create login credentials for a Front Desk Officer or Event &amp; Facility Officer.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Staff Role</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {ROLE_OPTIONS.map((role) => {
                    const isSelected = form.role === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, role: role.id }))}
                        style={{
                          padding: '0.7rem 0.5rem',
                          borderRadius: '2px',
                          border: isSelected ? `2px solid ${role.color}` : '1px solid var(--border-color)',
                          backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                          cursor: 'pointer',
                          textAlign: 'center',
                          color: isSelected ? role.color : 'var(--text-primary)'
                        }}
                      >
                        <strong style={{ fontSize: '0.75rem', display: 'block' }}>{role.badge}</strong>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{role.id.toUpperCase()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={14} className="text-gold" /> Full Name (optional)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} className="text-gold" /> Staff Email
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={form.email}
                  onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. jane.doe@deluxcrib.com"
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={14} className="text-gold" /> Password
                </label>
                <input
                  type="password"
                  className="form-input"
                  value={form.password}
                  onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={14} className="text-gold" /> Confirm Password
                </label>
                <input
                  type="password"
                  className="form-input"
                  value={form.confirmPassword}
                  onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Re-enter password"
                  required
                />
              </div>

              {error && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.8rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid #ef4444',
                  color: '#ef4444',
                  fontSize: '0.8rem',
                  borderRadius: '2px'
                }}>
                  <AlertCircle size={15} /> {error}
                </div>
              )}

              <div className="modal-btn-row" style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
                <button type="button" onClick={closeModal} className="btn-outline" style={{ padding: '0.6rem 1.1rem', fontSize: '0.82rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-gold" style={{ padding: '0.6rem 1.2rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserPlus size={15} /> Register Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
