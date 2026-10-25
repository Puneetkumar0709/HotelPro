import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  Lock,
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
} from 'lucide-react';

export const PaymentModal = ({ bookingData, onClose, onPaymentSuccess, onViewInvoice }) => {
  const [method, setMethod] = useState('Credit Card');
  const [processing, setProcessing] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // Card fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 8831');
  const [cardHolder, setCardHolder] = useState(bookingData?.guestName || 'Valued Guest');
  const [expiry, setExpiry] = useState('08/28');
  const [cvv, setCvv] = useState('883');

  const handlePay = () => {
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      const generatedTxId = `TXN-${Math.floor(10000 + Math.random() * 90000)}-HP`;
      const receiptNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const paymentRecord = {
        transactionId: generatedTxId,
        receiptNumber: receiptNo,
        bookingReference: bookingData.bookingReference || `HP-BK-${Math.floor(1000 + Math.random() * 9000)}`,
        guestName: bookingData.guestName,
        amount: bookingData.totalAmount,
        currency: 'USD',
        method,
        status: 'Success',
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        cardLast4: method === 'Credit Card' ? '8831' : 'VPA',
      };

      setSuccessData(paymentRecord);
      onPaymentSuccess(bookingData, paymentRecord);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#10B981', '#F3E5AB'],
        });
      } catch (err) {
        console.warn('Confetti unavailable', err);
      }
    }, 1400);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-luxury p-4" style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom border-secondary border-opacity-25">
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CreditCard size={20} className="text-white" />
            </div>
            <div>
              <h5 className="font-cinzel text-white mb-0 fw-bold">HotelPro Secure Gateway</h5>
              <small className="text-emerald" style={{ color: '#10B981' }}>
                <Lock size={12} className="inline me-1" /> 256-Bit TLS Encrypted
              </small>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-glass btn-sm p-1 rounded-circle">
            <X size={18} />
          </button>
        </div>

        {/* If payment completed */}
        {successData ? (
          <div className="text-center py-4">
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: '72px',
                height: '72px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid #10B981',
              }}
            >
              <CheckCircle2 size={42} className="text-emerald" style={{ color: '#10B981' }} />
            </div>

            <h4 className="font-cinzel text-white fw-bold mb-1">Reservation Confirmed!</h4>
            <p className="text-muted small mb-3">
              Payment of <strong className="text-warning">${bookingData?.totalAmount}</strong> authorized successfully.
            </p>

            <div className="p-3 mb-4 rounded-3 bg-dark bg-opacity-75 border border-secondary border-opacity-25 text-start">
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Guest Name:</span>
                <span className="text-white fw-medium">{bookingData?.guestName}</span>
              </div>
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Transaction Ref:</span>
                <span className="text-warning font-monospace">{successData.transactionId}</span>
              </div>
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Receipt Number:</span>
                <span className="text-light">{successData.receiptNumber}</span>
              </div>
              <div className="d-flex justify-content-between small text-muted">
                <span>Suite Reserved:</span>
                <span className="text-white">Suite #{bookingData?.roomNumber}</span>
              </div>
            </div>

            <div className="d-flex justify-content-center gap-3">
              <button
                onClick={() => onViewInvoice(bookingData, successData)}
                className="btn btn-gold"
              >
                <FileText size={16} />
                <span>View Official Invoice</span>
              </button>
              <button onClick={onClose} className="btn btn-glass">
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <div>
            {/* Amount Banner */}
            <div className="p-3 mb-3 rounded-3 d-flex justify-content-between align-items-center bg-dark bg-opacity-50 border border-secondary border-opacity-25">
              <div>
                <span className="small text-muted">Total Payable:</span>
                <div className="font-cinzel text-gold-gradient fw-bold fs-3">
                  ${bookingData?.totalAmount}
                </div>
              </div>
              <div className="text-end">
                <span className="badge bg-secondary bg-opacity-50 text-light px-2 py-1">
                  Suite #{bookingData?.roomNumber}
                </span>
                <div className="small text-muted mt-1">{bookingData?.totalNights} Nights Stay</div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="d-flex gap-2 mb-3">
              {[
                { id: 'Credit Card', label: 'Credit Card', icon: CreditCard },
                { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                { id: 'Net Banking', label: 'Net Banking', icon: Building2 },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`btn flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2 rounded-2 ${
                      isSelected
                        ? 'btn-warning text-dark fw-bold'
                        : 'btn-outline-secondary text-light'
                    }`}
                    style={{ fontSize: '0.84rem' }}
                  >
                    <Icon size={16} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Virtual Card Display */}
            {method === 'Credit Card' && (
              <div className="mb-3">
                <div
                  className="p-3 rounded-3 text-white mb-3 shadow"
                  style={{
                    background: 'linear-gradient(135deg, #1A2849 0%, #0D162B 50%, #15223E 100%)',
                    border: '1px solid rgba(212,175,55,0.4)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="font-cinzel text-warning fw-bold small">HOTELPRO CORPORATE PASS</span>
                    <ShieldCheck size={20} className="text-emerald" style={{ color: '#10B981' }} />
                  </div>
                  <div className="font-monospace fs-5 text-light tracking-widest mb-3">
                    {cardNumber}
                  </div>
                  <div className="d-flex justify-content-between align-items-end small">
                    <div>
                      <div className="text-muted" style={{ fontSize: '0.68rem' }}>CARDHOLDER</div>
                      <div className="fw-semibold text-uppercase">{cardHolder}</div>
                    </div>
                    <div>
                      <div className="text-muted" style={{ fontSize: '0.68rem' }}>EXPIRES</div>
                      <div className="fw-semibold">{expiry}</div>
                    </div>
                  </div>
                </div>

                <div className="row g-2">
                  <div className="col-8">
                    <label className="form-label text-muted small">Card Number</label>
                    <input
                      type="text"
                      className="luxury-input py-1"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="col-4">
                    <label className="form-label text-muted small">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      className="luxury-input py-1"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {method === 'UPI' && (
              <div className="p-4 mb-3 rounded-3 text-center bg-dark bg-opacity-50 border border-secondary border-opacity-25">
                <QrCode size={110} className="text-warning mx-auto mb-2" />
                <div className="small text-white fw-bold">Scan & Pay with Any UPI App</div>
                <div className="small text-muted">GPay, PhonePe, Paytm, BHIM accepted</div>
                <div className="badge bg-secondary text-warning mt-2 font-monospace">hotelpro@icici</div>
              </div>
            )}

            {method === 'Net Banking' && (
              <div className="mb-3">
                <label className="form-label text-muted small">Select Luxury Banking Partner</label>
                <select className="luxury-select w-100 text-light py-2">
                  <option>J.P. Morgan Private Bank</option>
                  <option>HSBC Premier Banking</option>
                  <option>Barclays Wealth</option>
                  <option>HDFC Bank HNW Portal</option>
                  <option>Citibank Gold</option>
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="d-flex justify-content-end gap-2 pt-2 border-top border-secondary border-opacity-25">
              <button type="button" onClick={onClose} className="btn btn-glass" disabled={processing}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePay}
                disabled={processing}
                className="btn btn-gold px-4"
              >
                {processing ? (
                  <>
                    <Loader2 size={16} className="spinner-border spinner-border-sm" />
                    <span>Authorizing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Authorize ${bookingData?.totalAmount}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
