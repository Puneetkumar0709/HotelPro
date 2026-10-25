import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { api, initLocalFallback } from './services/api';
import { SubmissionBanner } from './components/SubmissionBanner';
import { Navbar } from './components/Navbar';
import { StatsDashboard } from './components/StatsDashboard';
import { RoomInventory } from './components/RoomInventory';
import { ReservationList } from './components/ReservationList';
import { PaymentList } from './components/PaymentList';
import { HousekeepingView } from './components/HousekeepingView';
import { BookingModal } from './components/BookingModal';
import { PaymentModal } from './components/PaymentModal';
import { InvoiceModal } from './components/InvoiceModal';
import { JwtInspectorModal } from './components/JwtInspectorModal';
import { LoginModal } from './components/LoginModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

function HotelProApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activeBookingForPayment, setActiveBookingForPayment] = useState(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [activeInvoiceBooking, setActiveInvoiceBooking] = useState(null);
  const [activeInvoicePayment, setActiveInvoicePayment] = useState(null);
  const [jwtModalOpen, setJwtModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load initial data
  const loadData = async () => {
    try {
      initLocalFallback();
      const [roomsData, bookingsData, paymentsData, statsData] = await Promise.all([
        api.getRooms(),
        api.getBookings(),
        api.getPayments(),
        api.getStats(),
      ]);

      setRooms(roomsData);
      setBookings(bookingsData);
      setPayments(paymentsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching hotel data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Room status update handler
  const handleUpdateRoomStatus = async (roomId, newStatus) => {
    const updated = await api.updateRoomStatus(roomId, newStatus);
    if (updated) {
      setRooms((prev) =>
        prev.map((r) => (r.id === roomId || r.roomNumber === roomId ? { ...r, status: newStatus } : r))
      );
      // Reload stats
      const newStats = await api.getStats();
      setStats(newStats);
      showToast(`Suite status updated to '${newStatus}'`);
    }
  };

  // Booking status update handler (check-in / check-out)
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    const updated = await api.updateBookingStatus(bookingId, newStatus);
    if (updated) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: newStatus } : b))
      );
      // Synchronize rooms and stats
      const [newRooms, newStats] = await Promise.all([api.getRooms(), api.getStats()]);
      setRooms(newRooms);
      setStats(newStats);
      showToast(`Reservation updated: ${newStatus}`);
    }
  };

  // Booking wizard flow
  const handleOpenBooking = (room = null) => {
    setSelectedRoomForBooking(room);
    setBookingModalOpen(true);
  };

  const handleProceedToPayment = (bookingPayload, room) => {
    setBookingModalOpen(false);
    setActiveBookingForPayment(bookingPayload);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (bookingPayload, paymentRecord) => {
    await api.createBooking({
      ...bookingPayload,
      paymentMethod: paymentRecord.method,
    });
    // Refresh all state
    await loadData();
    showToast(`Reservation successfully confirmed for ${bookingPayload.guestName}!`);
  };

  const handleViewInvoice = (booking, payment = null) => {
    setActiveInvoiceBooking(booking);
    setActiveInvoicePayment(
      payment ||
        payments.find(
          (p) => p.bookingReference === booking.bookingReference || p.guestName === booking.guestName
        )
    );
    setInvoiceModalOpen(true);
  };

  return (
    <div className="min-vh-100 d-flex flex-column text-light position-relative">
      {/* Top Mentor Evaluation Banner */}
      <SubmissionBanner
        onOpenJwtModal={() => setJwtModalOpen(true)}
      />

      {/* Main Luxury Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewBooking={() => handleOpenBooking(null)}
        onOpenLogin={() => setLoginModalOpen(true)}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className="position-fixed bottom-0 end-0 m-4 p-3 rounded-3 shadow-lg d-flex align-items-center gap-2"
          style={{
            zIndex: 1100,
            background: toast.type === 'success' ? '#0F291E' : '#2D1515',
            border: `1px solid ${toast.type === 'success' ? '#10B981' : '#F43F5E'}`,
            animation: 'fadeIn 0.25s ease',
          }}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} className="text-success" />
          ) : (
            <AlertCircle size={18} className="text-danger" />
          )}
          <span className="small text-white fw-medium">{toast.message}</span>
        </div>
      )}

      {/* Tab Contents */}
      <main className="flex-grow-1">
        {loading ? (
          <div className="d-flex align-items-center justify-content-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading HotelPro...</span>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <StatsDashboard
                stats={stats}
                rooms={rooms}
                bookings={bookings}
                setActiveTab={setActiveTab}
                onOpenNewBooking={() => handleOpenBooking(null)}
              />
            )}

            {activeTab === 'inventory' && (
              <RoomInventory
                rooms={rooms}
                onBookRoom={(room) => handleOpenBooking(room)}
                onUpdateRoomStatus={handleUpdateRoomStatus}
              />
            )}

            {activeTab === 'bookings' && (
              <ReservationList
                bookings={bookings}
                onUpdateStatus={handleUpdateBookingStatus}
                onViewInvoice={(bk) => handleViewInvoice(bk)}
                onOpenNewBooking={() => handleOpenBooking(null)}
              />
            )}

            {activeTab === 'payments' && (
              <PaymentList
                payments={payments}
                onViewReceipt={(tx) => {
                  const matchedBooking = bookings.find((b) => b.bookingReference === tx.bookingReference);
                  handleViewInvoice(
                    matchedBooking || {
                      bookingReference: tx.bookingReference,
                      guestName: tx.guestName,
                      roomTitle: 'Executive Luxury Suite',
                      roomNumber: '102',
                      checkInDate: '2026-10-24',
                      checkOutDate: '2026-10-28',
                      totalNights: 4,
                      totalGuests: 2,
                      baseAmount: tx.amount * 0.88,
                      taxAmount: tx.amount * 0.12,
                      totalAmount: tx.amount,
                    },
                    tx
                  );
                }}
              />
            )}

            {activeTab === 'housekeeping' && (
              <HousekeepingView
                rooms={rooms}
                onUpdateStatus={handleUpdateRoomStatus}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {bookingModalOpen && (
        <BookingModal
          room={selectedRoomForBooking}
          rooms={rooms}
          onClose={() => setBookingModalOpen(false)}
          onProceedToPayment={handleProceedToPayment}
        />
      )}

      {paymentModalOpen && activeBookingForPayment && (
        <PaymentModal
          bookingData={activeBookingForPayment}
          onClose={() => setPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
          onViewInvoice={(booking, payment) => {
            setPaymentModalOpen(false);
            handleViewInvoice(booking, payment);
          }}
        />
      )}

      {invoiceModalOpen && (
        <InvoiceModal
          booking={activeInvoiceBooking}
          payment={activeInvoicePayment}
          onClose={() => setInvoiceModalOpen(false)}
        />
      )}

      {jwtModalOpen && (
        <JwtInspectorModal
          onClose={() => setJwtModalOpen(false)}
        />
      )}

      {loginModalOpen && (
        <LoginModal
          onClose={() => setLoginModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="py-3 px-4 border-top border-secondary border-opacity-10 text-center text-muted small bg-black bg-opacity-40">
        <div className="container d-flex flex-wrap align-items-center justify-content-between gap-2">
          <span className="font-cinzel text-warning">
            HOTELPRO © 2026 • Enterprise Hospitality Architecture
          </span>
          <span className="small">
            NASSCOM Hospitality Individual Project Evaluation • Evaluator: Full Stack Review
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HotelProApp />
    </AuthProvider>
  );
}
