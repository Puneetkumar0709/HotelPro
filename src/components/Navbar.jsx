import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Hotel,
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  CreditCard,
  Sparkles,
  ShieldCheck,
  UserCheck,
  LogOut,
  LogIn,
  PlusCircle,
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenNewBooking, onOpenLogin }) => {
  const { user, isAuthenticated, logoutUser, switchRole } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Suites & Inventory', icon: BedDouble },
    { id: 'bookings', label: 'Reservations', icon: CalendarCheck },
    { id: 'payments', label: 'Payments & Billing', icon: CreditCard },
    { id: 'housekeeping', label: 'Housekeeping', icon: Sparkles },
  ];

  return (
    <nav
      style={{
        background: 'rgba(11, 19, 43, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
      className="py-2"
    >
      <div className="container-fluid px-3 px-lg-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          {/* Brand Logo */}
          <div
            className="d-flex align-items-center gap-2 cursor-pointer"
            onClick={() => setActiveTab('dashboard')}
            style={{ cursor: 'pointer' }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #997A15 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
              }}
            >
              <Hotel size={24} className="text-dark" />
            </div>
            <div>
              <div className="font-cinzel fw-bold text-white fs-5 lh-1 d-flex align-items-center gap-2">
                HOTEL<span className="text-gold-gradient">PRO</span>
                <span className="live-indicator" title="Live Server Connected"></span>
              </div>
              <div className="small text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>
                HOSPITALITY MANAGEMENT SYSTEM
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="d-flex align-items-center gap-1 bg-dark bg-opacity-50 p-1 rounded-3 border border-secondary border-opacity-25 overflow-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-2 transition-all ${
                    isActive
                      ? 'bg-warning text-dark fw-bold shadow-sm'
                      : 'text-light opacity-75 hover-opacity-100'
                  }`}
                  style={{
                    border: 'none',
                    fontSize: '0.84rem',
                    whiteSpace: 'nowrap',
                    background: isActive ? 'linear-gradient(135deg, #F3E5AB, #D4AF37)' : 'transparent',
                  }}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Role Switcher & Actions */}
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={onOpenNewBooking}
              className="btn btn-gold btn-sm d-none d-sm-inline-flex"
            >
              <PlusCircle size={15} />
              <span>Book Suite</span>
            </button>

            {/* Quick Role Switcher Dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-glass btn-sm dropdown-toggle d-flex align-items-center gap-1"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <ShieldCheck size={15} className="text-warning" />
                <span className="small text-capitalize">{user?.role || 'Guest'}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg" style={{ background: '#0D1527', border: '1px solid rgba(212,175,55,0.3)' }}>
                <li>
                  <h6 className="dropdown-header text-warning small font-cinzel">SWITCH SIMULATED ROLE</h6>
                </li>
                <li>
                  <button
                    className={`dropdown-item small d-flex align-items-center gap-2 ${user?.role === 'admin' ? 'active bg-warning text-dark' : ''}`}
                    onClick={() => switchRole('admin')}
                  >
                    <UserCheck size={14} /> General Manager (Admin)
                  </button>
                </li>
                <li>
                  <button
                    className={`dropdown-item small d-flex align-items-center gap-2 ${user?.role === 'receptionist' ? 'active bg-warning text-dark' : ''}`}
                    onClick={() => switchRole('receptionist')}
                  >
                    <UserCheck size={14} /> Front Desk Staff
                  </button>
                </li>
                <li>
                  <button
                    className={`dropdown-item small d-flex align-items-center gap-2 ${user?.role === 'guest' ? 'active bg-warning text-dark' : ''}`}
                    onClick={() => switchRole('guest')}
                  >
                    <UserCheck size={14} /> Guest View
                  </button>
                </li>
                <li><hr className="dropdown-divider border-secondary border-opacity-25" /></li>
                <li>
                  {isAuthenticated ? (
                    <button className="dropdown-item small text-danger d-flex align-items-center gap-2" onClick={logoutUser}>
                      <LogOut size={14} /> Logout
                    </button>
                  ) : (
                    <button className="dropdown-item small text-warning d-flex align-items-center gap-2" onClick={onOpenLogin}>
                      <LogIn size={14} /> Sign In
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
