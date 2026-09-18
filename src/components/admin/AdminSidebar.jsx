import React from 'react';
import { 
  LayoutDashboard,
  FileCheck2, 
  Building2, 
  Calendar,
  SlidersHorizontal,
  BarChart3,
  Lock
} from 'lucide-react';

export const ALL_TABS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    roles: ['admin']
  },
  {
    id: 'receipts',
    label: 'Front Desk & Receipts',
    icon: FileCheck2,
    roles: ['admin', 'fdo']
  },
  {
    id: 'occupancy',
    label: 'Room Occupancy',
    icon: Building2,
    roles: ['admin', 'fdo']
  },
  {
    id: 'calendar',
    label: 'Event Halls Calendar',
    icon: Calendar,
    roles: ['admin', 'efo']
  },
  {
    id: 'pricing',
    label: 'Rates & Tariffs',
    icon: SlidersHorizontal,
    roles: ['admin']
  },
  {
    id: 'analytics',
    label: 'Financial Reports',
    icon: BarChart3,
    roles: ['admin']
  }
];

export default function AdminSidebar({ activeTab, setActiveTab, userRole }) {
  // Filter tabs visible to this specific role (Admin sees all, FDO sees Front Desk & Rooms, EFO sees Event Calendar)
  const allowedTabs = ALL_TABS.filter(tab => tab.roles.includes(userRole));

  return (
    <div style={{
      backgroundColor: 'var(--card-bg)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.6rem 1.5rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {allowedTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                border: isActive ? '1px solid var(--color-gold)' : '1px solid transparent',
                backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                color: isActive ? 'var(--color-gold)' : 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                transition: 'var(--transition-fast)'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
