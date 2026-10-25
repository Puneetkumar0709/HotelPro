import React from 'react';
import { X, Printer, Download, Hotel, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';

export const InvoiceModal = ({ booking, payment, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = payment?.receiptNumber || `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const transactionId = payment?.transactionId || `TXN-84910-HP`;

  return (
    <div className="modal-overlay">
      <div className="modal-content-luxury p-0 overflow-hidden" style={{ maxWidth: '680px' }}>
        {/* Modal Top Actions */}
        <div className="d-flex justify-content-between align-items-center p-3 bg-dark border-bottom border-secondary border-opacity-25">
          <span className="small text-warning font-cinzel fw-bold">Official Hotel Folio & Tax Invoice</span>
          <div className="d-flex align-items-center gap-2">
            <button onClick={handlePrint} className="btn btn-sm btn-gold d-flex align-items-center gap-1">
              <Printer size={14} />
              <span>Print Invoice</span>
            </button>
            <button onClick={onClose} className="btn btn-glass btn-sm p-1 rounded-circle">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Folio Document */}
        <div className="p-4 bg-white text-dark" id="hotelpro-printable-invoice">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <Hotel size={26} className="text-warning" />
                <h3 className="font-cinzel fw-bold text-dark mb-0">HOTELPRO RESORTS</h3>
              </div>
              <div className="small text-secondary">
                100 Oceanfront Promenade, Marina Bay<br />
                support@hotelpro.com • +1 (800) 555-HOTEL<br />
                Tax ID / GSTIN: 27AABCH1829Q1Z8
              </div>
            </div>

            <div className="text-end">
              <span className="badge bg-success px-3 py-2 fs-6 mb-2">PAID IN FULL</span>
              <div className="small text-secondary">
                Invoice No: <strong className="text-dark">{invoiceNumber}</strong><br />
                Date: <strong>{new Date().toISOString().substring(0, 10)}</strong><br />
                Booking Ref: <strong className="font-monospace text-dark">{booking.bookingReference}</strong>
              </div>
            </div>
          </div>

          {/* Guest & Reservation Info */}
          <div className="row g-3 mb-3 p-3 bg-light rounded">
            <div className="col-6">
              <div className="small text-muted text-uppercase fw-bold">Billed To</div>
              <div className="fw-bold fs-6 text-dark">{booking.guestName}</div>
              <div className="small text-secondary">{booking.guestEmail}</div>
              <div className="small text-secondary">{booking.guestPhone}</div>
            </div>
            <div className="col-6 text-end">
              <div className="small text-muted text-uppercase fw-bold">Stay Details</div>
              <div className="fw-bold text-dark">{booking.roomTitle} (Suite #{booking.roomNumber})</div>
              <div className="small text-secondary">
                {booking.checkInDate} to {booking.checkOutDate} ({booking.totalNights} Nights)
              </div>
              <div className="small text-secondary">{booking.totalGuests} Registered Guests</div>
            </div>
          </div>

          {/* Line items table */}
          <table className="table table-bordered mb-3">
            <thead className="table-light small text-uppercase font-cinzel">
              <tr>
                <th>Description</th>
                <th className="text-center">Qty / Nights</th>
                <th className="text-end">Rate</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody className="small">
              <tr>
                <td>
                  <strong>{booking.roomTitle}</strong>
                  <div className="text-muted small">Luxury accommodations & ocean privileges</div>
                </td>
                <td className="text-center">{booking.totalNights}</td>
                <td className="text-end">${booking.baseAmount / (booking.totalNights || 1)}</td>
                <td className="text-end fw-bold">${booking.baseAmount}</td>
              </tr>
              {booking.addOnAmount > 0 && (
                <tr>
                  <td>
                    <strong>Selected Curated Add-ons</strong>
                    <div className="text-muted small">
                      {booking.addOns?.join(', ') || 'Airport Transfer, Gourmet Breakfast'}
                    </div>
                  </td>
                  <td className="text-center">1</td>
                  <td className="text-end">${booking.addOnAmount}</td>
                  <td className="text-end fw-bold">${booking.addOnAmount}</td>
                </tr>
              )}
              <tr>
                <td>
                  <strong>Hospitality VAT & Resort Amenities Fee</strong>
                  <div className="text-muted small">12% Standard statutory luxury tourism tax</div>
                </td>
                <td className="text-center">—</td>
                <td className="text-end">12%</td>
                <td className="text-end fw-bold">${booking.taxAmount || Math.round(booking.totalAmount * 0.12 * 100) / 100}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="table-dark fs-6">
                <th colSpan="3" className="text-end font-cinzel">TOTAL PAID (USD):</th>
                <th className="text-end font-cinzel text-warning">${booking.totalAmount}</th>
              </tr>
            </tfoot>
          </table>

          {/* Footer note */}
          <div className="d-flex justify-content-between align-items-center pt-2 border-top">
            <div className="small text-muted">
              <div>Payment Method: <strong>{booking.paymentMethod || 'Credit Card'}</strong></div>
              <div>Transaction ID: <span className="font-monospace">{transactionId}</span></div>
              <div>Thank you for choosing HotelPro Luxury Resorts.</div>
            </div>
            <div className="text-end">
              <QrCode size={52} className="text-dark" />
              <div className="text-muted" style={{ fontSize: '0.65rem' }}>Scan to Verify Authenticity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
