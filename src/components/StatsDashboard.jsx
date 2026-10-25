import React from 'react';
import {
  TrendingUp,
  BedDouble,
  DollarSign,
  CalendarCheck2,
  Users,
  Sparkles,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  CreditCard,
} from 'lucide-react';

export const StatsDashboard = ({ stats, rooms, bookings, setActiveTab, onOpenNewBooking }) => {
  const occupancy = stats?.occupancyRate || 75;
  const totalRevenue = stats?.totalRevenue || 10548;

  const quickStats = [
    {
      title: 'Current Occupancy',
      value: `${occupancy}%`,
      subtitle: `${stats?.occupiedRooms || 0} of ${stats?.totalRooms || 0} Suites Booked`,
      icon: BedDouble,
      accent: '#D4AF37',
      bgGlow: 'rgba(212, 175, 55, 0.1)',
      trend: '+12% vs last month',
    },
    {
      title: 'Gross Revenue',
      value: `$${Number(totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtitle: 'Real-time booking volume',
      icon: DollarSign,
      accent: '#10B981',
      bgGlow: 'rgba(16, 185, 129, 0.1)',
      trend: '+18.4% high season',
    },
    {
      title: 'Active Reservations',
      value: stats?.activeBookings || 4,
      subtitle: `${stats?.checkInsToday || 3} expected check-ins today`,
      icon: CalendarCheck2,
      accent: '#06B6D4',
      bgGlow: 'rgba(6, 182, 212, 0.1)',
      trend: 'Zero overdue departures',
    },
    {
      title: 'Guest Rating Score',
      value: '4.92 / 5.0',
      subtitle: 'Based on 420+ verified reviews',
      icon: Sparkles,
      accent: '#F59E0B',
      bgGlow: 'rgba(245, 158, 11, 0.1)',
      trend: 'Top 1% Luxury Hospitality',
    },
  ];

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      {/* Hero Welcome Bar */}
      <div className="glass-panel p-4 mb-4 position-relative overflow-hidden">
        <div className="row align-items-center g-3">
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="live-indicator"></span>
              <span className="small text-warning fw-semibold text-uppercase tracking-wider">
                Hotel Operations Console • Live
              </span>
            </div>
            <h1 className="font-cinzel text-white fs-2 fw-bold mb-2">
              Welcome to <span className="text-gold-gradient">HotelPro</span> Enterprise
            </h1>
            <p className="text-muted mb-0" style={{ maxWidth: '680px' }}>
              Streamlined reservations, guest profiles, automated room turnover, and multi-currency billing.
              Engineered with modern React JSX, Node.js Express backend, and JSON Web Token (JWT) compliance.
            </p>
          </div>
          <div className="col-lg-4 d-flex justify-content-lg-end gap-2 flex-wrap">
            <button
              onClick={onOpenNewBooking}
              className="btn btn-gold shadow"
            >
              <BedDouble size={18} />
              <span>Create Reservation</span>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className="btn btn-glass"
            >
              <span>Manage Guests</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="row g-3 mb-4">
        {quickStats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="col-12 col-sm-6 col-xl-3">
              <div className="glass-card-interactive p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="text-muted small fw-medium text-uppercase">{item.title}</span>
                    <h3 className="text-white font-cinzel fw-bold mt-1 mb-0 fs-2">{item.value}</h3>
                  </div>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: item.bgGlow,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${item.accent}33`,
                    }}
                  >
                    <Icon size={22} style={{ color: item.accent }} />
                  </div>
                </div>
                <div className="pt-2 border-top border-secondary border-opacity-10 d-flex justify-content-between align-items-center">
                  <span className="small text-muted">{item.subtitle}</span>
                  <span className="small text-emerald fw-semibold" style={{ color: '#10B981', fontSize: '0.78rem' }}>
                    {item.trend}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operations Row: Occupancy breakdown + Recent Bookings */}
      <div className="row g-4">
        {/* Room Status Analytics */}
        <div className="col-lg-5">
          <div className="glass-panel p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="font-cinzel text-white mb-0 fw-bold">Room Fleet Status</h5>
              <button
                className="btn btn-glass btn-sm"
                onClick={() => setActiveTab('inventory')}
              >
                View Fleet
              </button>
            </div>

            {/* Occupancy Progress */}
            <div className="mb-4">
              <div className="d-flex justify-content-between small mb-1">
                <span className="text-muted">Total Fleet Occupancy</span>
                <span className="text-warning fw-bold">{occupancy}%</span>
              </div>
              <div className="progress" style={{ height: '10px', background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="progress-bar bg-warning"
                  role="progressbar"
                  style={{ width: `${occupancy}%` }}
                ></div>
              </div>
            </div>

            {/* Status Breakdown items */}
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center justify-content-between p-2 rounded bg-dark bg-opacity-25 border border-secondary border-opacity-10">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge-available status-badge">Available</span>
                  <span className="small text-light">Ready for check-in</span>
                </div>
                <span className="fw-bold text-success">{stats?.availableRooms || 0} suites</span>
              </div>

              <div className="d-flex align-items-center justify-content-between p-2 rounded bg-dark bg-opacity-25 border border-secondary border-opacity-10">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge-occupied status-badge">Occupied</span>
                  <span className="small text-light">Currently hosting guests</span>
                </div>
                <span className="fw-bold text-danger">{stats?.occupiedRooms || 0} suites</span>
              </div>

              <div className="d-flex align-items-center justify-content-between p-2 rounded bg-dark bg-opacity-25 border border-secondary border-opacity-10">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge-cleaning status-badge">Cleaning</span>
                  <span className="small text-light">Housekeeping turnaround</span>
                </div>
                <span className="fw-bold text-info">{stats?.cleaningRooms || 0} suites</span>
              </div>

              <div className="d-flex align-items-center justify-content-between p-2 rounded bg-dark bg-opacity-25 border border-secondary border-opacity-10">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge-reserved status-badge">Reserved</span>
                  <span className="small text-light">Confirmed upcoming arrival</span>
                </div>
                <span className="fw-bold text-warning">{stats?.reservedRooms || 0} suites</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Guest Reservations Feed */}
        <div className="col-lg-7">
          <div className="glass-panel p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="font-cinzel text-white mb-0 fw-bold">Active Reservations</h5>
                <small className="text-muted">Live synchronization with Front Desk</small>
              </div>
              <button
                className="btn btn-glass btn-sm"
                onClick={() => setActiveTab('bookings')}
              >
                All Bookings
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
                <thead>
                  <tr className="border-secondary border-opacity-25 text-muted small text-uppercase">
                    <th>Guest</th>
                    <th>Suite</th>
                    <th>Stay Dates</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings?.slice(0, 4).map((bk) => (
                    <tr key={bk.id} className="border-secondary border-opacity-10">
                      <td>
                        <div className="fw-semibold text-white">{bk.guestName}</div>
                        <div className="small text-muted" style={{ fontSize: '0.74rem' }}>{bk.bookingReference}</div>
                      </td>
                      <td>
                        <span className="badge bg-secondary bg-opacity-50 text-warning px-2 py-1">
                          Room #{bk.roomNumber}
                        </span>
                      </td>
                      <td className="small text-muted">
                        <div>{bk.checkInDate}</div>
                        <div style={{ fontSize: '0.72rem' }}>to {bk.checkOutDate}</div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            bk.bookingStatus === 'Checked In'
                              ? 'bg-success'
                              : bk.bookingStatus === 'Confirmed'
                              ? 'bg-warning text-dark'
                              : 'bg-info'
                          } px-2 py-1`}
                          style={{ fontSize: '0.72rem' }}
                        >
                          {bk.bookingStatus}
                        </span>
                      </td>
                      <td className="fw-bold text-white small">
                        ${Number(bk.totalAmount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
