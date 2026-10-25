import React, { useState, useId } from 'react';
import {
  X,
  Calendar,
  User,
  Mail,
  Phone,
  Bed,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const BookingModal = ({ room, rooms, onClose, onProceedToPayment }) => {
  const [selectedRoomId, setSelectedRoomId] = useState(room?.id || rooms[0]?.id || '');
  const activeRoom = rooms.find((r) => r.id === selectedRoomId) || room || rooms[0];

  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const checkInId = useId();
  const checkOutId = useId();
  const guestsCountId = useId();
  const roomSelectId = useId();

  const [guestName, setGuestName] = useState('Lady Genevieve Hastings');
  const [guestEmail, setGuestEmail] = useState('genevieve.hastings@royalholdings.co.uk');
  const [guestPhone, setGuestPhone] = useState('+44 20 7946 0912');
  const [checkInDate, setCheckInDate] = useState('2026-10-26');
  const [checkOutDate, setCheckOutDate] = useState('2026-10-30');
  const [totalGuests, setTotalGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('High floor ocean view, welcome flowers.');

  // Luxury Add-ons
  const [selectedAddons, setSelectedAddons] = useState([
    { id: 'breakfast', name: 'Gourmet Champagne Breakfast', price: 45, checked: true },
    { id: 'transfer', name: 'VIP Airport Chauffeur (S-Class)', price: 90, checked: true },
    { id: 'spa', name: 'Full-Day Wellness & Spa Sanctuary', price: 120, checked: false },
    { id: 'lateCheckout', name: 'Guaranteed 4:00 PM Late Check-out', price: 60, checked: false },
  ]);

  const toggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.map((addon) => (addon.id === id ? { ...addon, checked: !addon.checked } : addon))
    );
  };

  // Calculations
  const calculateNights = () => {
    try {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const nights = calculateNights();
  const roomRate = activeRoom?.pricePerNight || 300;
  const baseRoomTotal = roomRate * nights;
  const addonsTotal = selectedAddons
    .filter((a) => a.checked)
    .reduce((sum, a) => sum + a.price, 0);
  const tax = Math.round((baseRoomTotal + addonsTotal) * 0.12 * 100) / 100;
  const grandTotal = Math.round((baseRoomTotal + addonsTotal + tax) * 100) / 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingPayload = {
      guestName,
      guestEmail,
      guestPhone,
      roomId: activeRoom.id,
      roomNumber: activeRoom.roomNumber,
      roomTitle: activeRoom.title,
      checkInDate,
      checkOutDate,
      totalNights: nights,
      totalGuests: Number(totalGuests),
      baseAmount: baseRoomTotal,
      addOnAmount: addonsTotal,
      taxAmount: tax,
      totalAmount: grandTotal,
      addOns: selectedAddons.filter((a) => a.checked).map((a) => a.name),
      specialRequests,
    };

    onProceedToPayment(bookingPayload, activeRoom);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-luxury p-4" style={{ maxWidth: '780px' }}>
        {/* Modal Header */}
        <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom border-secondary border-opacity-25">
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #F3E5AB, #D4AF37)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bed size={20} className="text-dark" />
            </div>
            <div>
              <h5 className="font-cinzel text-white mb-0 fw-bold">Reserve Luxury Suite</h5>
              <small className="text-warning">Step 1 of 2: Reservation Details</small>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-glass btn-sm p-1 rounded-circle">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Suite Selector Preview */}
          <div className="p-3 mb-4 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25">
            <div className="row align-items-center g-3">
              <div className="col-sm-4">
                <img
                  src={activeRoom?.image}
                  alt={activeRoom?.title}
                  className="rounded-2 w-100 object-fit-cover shadow"
                  style={{ height: '90px' }}
                />
              </div>
              <div className="col-sm-8">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label htmlFor={roomSelectId} className="font-cinzel text-gold-gradient fw-bold mb-0">
                    {activeRoom?.title}
                  </label>
                  <span className="badge bg-warning text-dark font-cinzel">
                    Suite #{activeRoom?.roomNumber}
                  </span>
                </div>
                <div className="small text-muted mb-2">
                  {activeRoom?.bedType} • Up to {activeRoom?.capacity} Guests • {activeRoom?.sizeSqFt} sq ft
                </div>
                <select
                  id={roomSelectId}
                  className="luxury-select w-100 py-1 px-2 text-light"
                  style={{ fontSize: '0.8rem' }}
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      Suite #{r.roomNumber} - {r.title} (${r.pricePerNight}/night) [{r.status}]
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-3">
            {/* Guest Details */}
            <div className="col-md-4">
              <label htmlFor={nameId} className="form-label text-muted small fw-semibold">
                Guest Full Name
              </label>
              <div className="position-relative">
                <input
                  id={nameId}
                  type="text"
                  required
                  className="luxury-input ps-4"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                />
                <User size={14} className="position-absolute text-muted" style={{ top: '12px', left: '10px' }} />
              </div>
            </div>

            <div className="col-md-4">
              <label htmlFor={emailId} className="form-label text-muted small fw-semibold">
                Email Address
              </label>
              <div className="position-relative">
                <input
                  id={emailId}
                  type="email"
                  required
                  className="luxury-input ps-4"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="guest@domain.com"
                />
                <Mail size={14} className="position-absolute text-muted" style={{ top: '12px', left: '10px' }} />
              </div>
            </div>

            <div className="col-md-4">
              <label htmlFor={phoneId} className="form-label text-muted small fw-semibold">
                Contact Phone
              </label>
              <div className="position-relative">
                <input
                  id={phoneId}
                  type="text"
                  required
                  className="luxury-input ps-4"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
                <Phone size={14} className="position-absolute text-muted" style={{ top: '12px', left: '10px' }} />
              </div>
            </div>

            {/* Dates & Guests */}
            <div className="col-md-4">
              <label htmlFor={checkInId} className="form-label text-muted small fw-semibold">
                Check-in Date
              </label>
              <input
                id={checkInId}
                type="date"
                required
                className="luxury-input"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label htmlFor={checkOutId} className="form-label text-muted small fw-semibold">
                Check-out Date
              </label>
              <input
                id={checkOutId}
                type="date"
                required
                className="luxury-input"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label htmlFor={guestsCountId} className="form-label text-muted small fw-semibold">
                Total Guests
              </label>
              <select
                id={guestsCountId}
                className="luxury-select w-100 text-light"
                value={totalGuests}
                onChange={(e) => setTotalGuests(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Luxury Addons */}
          <div className="mb-3">
            <label className="form-label text-warning small fw-semibold d-flex align-items-center gap-1">
              <Sparkles size={14} /> Curated Luxury Enhancements
            </label>
            <div className="row g-2">
              {selectedAddons.map((addon) => (
                <div key={addon.id} className="col-sm-6">
                  <div
                    onClick={() => toggleAddon(addon.id)}
                    className="p-2 rounded-2 d-flex align-items-center justify-content-between cursor-pointer border"
                    style={{
                      background: addon.checked ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                      borderColor: addon.checked ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded d-flex align-items-center justify-content-center"
                        style={{
                          width: '18px',
                          height: '18px',
                          background: addon.checked ? '#D4AF37' : 'transparent',
                          border: '1px solid rgba(212,175,55,0.5)',
                        }}
                      >
                        {addon.checked && <Check size={12} className="text-dark fw-bold" />}
                      </div>
                      <span className="small text-light">{addon.name}</span>
                    </div>
                    <span className="small text-warning fw-bold">+${addon.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Bill Summary */}
          <div className="p-3 mb-4 rounded-3 bg-dark bg-opacity-75 border border-secondary border-opacity-25">
            <div className="d-flex justify-content-between small text-muted mb-1">
              <span>{activeRoom?.title} (${roomRate} × {nights} nights):</span>
              <span className="text-white">${baseRoomTotal}</span>
            </div>
            {addonsTotal > 0 && (
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Selected Luxury Add-ons:</span>
                <span className="text-warning">+${addonsTotal}</span>
              </div>
            )}
            <div className="d-flex justify-content-between small text-muted mb-2">
              <span>Taxes & Luxury Resort Surcharge (12%):</span>
              <span className="text-white">${tax}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
              <span className="font-cinzel text-white fw-bold">Grand Total:</span>
              <span className="font-cinzel text-gold-gradient fw-bold fs-4">${grandTotal}</span>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="d-flex justify-content-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-glass">
              Cancel
            </button>
            <button type="submit" className="btn btn-gold px-4">
              <CreditCard size={16} />
              <span>Continue to Payment (${grandTotal})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
