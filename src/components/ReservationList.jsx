import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Calendar,
  CheckCircle,
  LogOut,
  FileText,
  Clock,
  Filter,
  Users,
  Bed,
  Plus,
} from 'lucide-react';

export const ReservationList = ({
  bookings,
  onUpdateStatus,
  onViewInvoice,
  onOpenNewBooking,
}) => {
  const { isStaff } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredBookings = bookings.filter((b) => {
    const matchStatus = statusFilter === 'All' || b.bookingStatus.toLowerCase() === statusFilter.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchSearch =
      b.guestName.toLowerCase().includes(q) ||
      b.bookingReference.toLowerCase().includes(q) ||
      b.roomNumber.includes(q) ||
      b.guestEmail.toLowerCase().includes(q);

    return matchStatus && matchSearch;
  });

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      {/* Header Panel */}
      <div className="glass-panel p-4 mb-4">
        <div className="row align-items-center g-3 mb-3">
          <div className="col-md-6">
            <h2 className="font-cinzel text-white fw-bold mb-1">Reservation & Front Desk Registry</h2>
            <p className="text-muted small mb-0">
              Manage arrivals, check-in guests, handle departures, and generate branded guest folios.
            </p>
          </div>
          <div className="col-md-6 d-flex justify-content-md-end gap-2">
            <button onClick={onOpenNewBooking} className="btn btn-gold">
              <Plus size={16} />
              <span>New Reservation</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="row g-2 pt-2 border-top border-secondary border-opacity-10 align-items-center">
          <div className="col-md-7">
            <div className="position-relative">
              <Search
                size={16}
                className="position-absolute text-muted"
                style={{ top: '12px', left: '12px' }}
              />
              <input
                type="text"
                placeholder="Search by guest name, booking ref (HP-BK-...), room #..."
                className="luxury-input ps-5 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-5 d-flex justify-content-md-end align-items-center gap-2">
            <span className="small text-muted">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="luxury-select text-light py-2"
              style={{ minWidth: '150px' }}
            >
              <option value="All">All Reservations</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked In">Checked In</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass-panel p-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
            <thead>
              <tr className="border-secondary border-opacity-25 text-muted small text-uppercase font-cinzel">
                <th className="ps-4">Reference & Guest</th>
                <th>Suite Reserved</th>
                <th>Duration & Dates</th>
                <th>Financial Total</th>
                <th>Status</th>
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No reservations matching filter query.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((bk) => (
                  <tr key={bk.id} className="border-secondary border-opacity-10">
                    {/* Guest info */}
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: 'rgba(212,175,55,0.15)',
                            border: '1px solid rgba(212,175,55,0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: '#F3E5AB',
                          }}
                        >
                          {bk.guestName.charAt(0)}
                        </div>
                        <div>
                          <div className="fw-bold text-white">{bk.guestName}</div>
                          <div className="small text-warning font-monospace" style={{ fontSize: '0.74rem' }}>
                            {bk.bookingReference}
                          </div>
                          <div className="small text-muted" style={{ fontSize: '0.72rem' }}>
                            {bk.guestEmail}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Room */}
                    <td>
                      <div className="fw-semibold text-light">{bk.roomTitle}</div>
                      <span className="badge bg-secondary bg-opacity-40 text-warning">
                        Suite #{bk.roomNumber}
                      </span>
                    </td>

                    {/* Dates */}
                    <td className="small text-muted">
                      <div className="text-white d-flex align-items-center gap-1">
                        <Calendar size={13} className="text-warning" />
                        <span>{bk.checkInDate} → {bk.checkOutDate}</span>
                      </div>
                      <div className="small text-muted mt-1">
                        {bk.totalNights} Nights • {bk.totalGuests} Guests
                      </div>
                    </td>

                    {/* Amount */}
                    <td>
                      <div className="text-gold-gradient fw-bold font-cinzel fs-6">
                        ${Number(bk.totalAmount).toLocaleString()}
                      </div>
                      <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-25" style={{ fontSize: '0.68rem' }}>
                        {bk.paymentStatus || 'Paid'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td>
                      <span
                        className={`badge ${
                          bk.bookingStatus === 'Checked In'
                            ? 'bg-success text-white'
                            : bk.bookingStatus === 'Confirmed'
                            ? 'bg-warning text-dark'
                            : bk.bookingStatus === 'Checked Out'
                            ? 'bg-info text-dark'
                            : 'bg-secondary'
                        } px-2 py-1`}
                      >
                        {bk.bookingStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="pe-4 text-end">
                      <div className="d-inline-flex align-items-center gap-1">
                        {/* Check-In Action */}
                        {bk.bookingStatus === 'Confirmed' && isStaff && (
                          <button
                            onClick={() => onUpdateStatus(bk.id, 'Checked In')}
                            className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                            title="Check-in Guest into Room"
                          >
                            <CheckCircle size={14} />
                            <span>Check In</span>
                          </button>
                        )}

                        {/* Check-Out Action */}
                        {bk.bookingStatus === 'Checked In' && isStaff && (
                          <button
                            onClick={() => onUpdateStatus(bk.id, 'Checked Out')}
                            className="btn btn-sm btn-outline-info d-flex align-items-center gap-1"
                            title="Complete Guest Departure"
                          >
                            <LogOut size={14} />
                            <span>Check Out</span>
                          </button>
                        )}

                        {/* View Invoice */}
                        <button
                          onClick={() => onViewInvoice(bk)}
                          className="btn btn-sm btn-glass d-flex align-items-center gap-1"
                          title="Generate Guest Invoice"
                        >
                          <FileText size={14} />
                          <span className="d-none d-lg-inline">Invoice</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
