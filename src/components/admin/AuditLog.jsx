import React from 'react';
import { History, Shield, Clock, CheckCircle2, User } from 'lucide-react';

export default function AuditLog({ store }) {
  const logs = store.logs || [];

  return (
    <div style={{
      backgroundColor: 'var(--card-bg)',
      border: '1px solid var(--border-color)',
      borderRadius: '2px',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="audit-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.8rem',
        marginBottom: '1.2rem'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={20} className="text-gold" /> System Audit & Staff Activity Log
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Immutable trail of all check-ins, payment confirmations, and status alterations
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {logs.map((log) => (
          <div
            key={log.id}
            className="audit-row"
            style={{
              padding: '0.8rem 1.2rem',
              backgroundColor: 'var(--bg-secondary)',
              borderLeft: '3px solid var(--color-gold)',
              borderRadius: '2px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              fontSize: '0.85rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                  {log.actor}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                {log.action}
              </p>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.3rem' }} />
              {log.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
