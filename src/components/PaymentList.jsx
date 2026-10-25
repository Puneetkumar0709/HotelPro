import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  FileText,
  Download,
  Filter,
} from 'lucide-react';

export const PaymentList = ({ payments, onViewReceipt }) => {
  const [search, setSearch] = useState('');

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.transactionId.toLowerCase().includes(q) ||
      p.bookingReference.toLowerCase().includes(q) ||
      p.guestName.toLowerCase().includes(q) ||
      p.receiptNumber.toLowerCase().includes(q)
    );
  });

  const totalAmount = payments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="glass-panel p-3">
            <span className="small text-muted text-uppercase">Total Settled Volume</span>
            <div className="font-cinzel text-gold-gradient fw-bold fs-3">
              ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="small text-emerald" style={{ color: '#10B981' }}>
              ✓ 100% Zero Chargeback Rate
            </span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-panel p-3">
            <span className="small text-muted text-uppercase">Payment Gateway Mode</span>
            <div className="font-cinzel text-white fw-bold fs-3">Multi-Rail Live</div>
            <span className="small text-muted">Stripe, UPI, Card, NetBanking</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-panel p-3">
            <span className="small text-muted text-uppercase">Total Captured Transactions</span>
            <div className="font-cinzel text-white fw-bold fs-3">{payments.length} Records</div>
            <span className="small text-muted">Instant digital invoice issuance</span>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-panel p-0 overflow-hidden">
        <div className="p-3 border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <h5 className="font-cinzel text-white fw-bold mb-0">Financial Audit & Transaction Ledger</h5>
          </div>
          <div className="position-relative" style={{ maxWidth: '300px', width: '100%' }}>
            <Search size={14} className="position-absolute text-muted" style={{ top: '10px', left: '10px' }} />
            <input
              type="text"
              placeholder="Search transaction ID, guest..."
              className="luxury-input py-1 ps-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '0.8rem' }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
            <thead>
              <tr className="border-secondary border-opacity-25 text-muted small text-uppercase font-cinzel">
                <th className="ps-4">Transaction ID</th>
                <th>Booking Ref</th>
                <th>Payer / Guest</th>
                <th>Payment Method</th>
                <th>Timestamp</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="pe-4 text-end">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr key={tx.id} className="border-secondary border-opacity-10">
                  <td className="ps-4 font-monospace text-warning small">{tx.transactionId}</td>
                  <td className="small text-light font-monospace">{tx.bookingReference}</td>
                  <td className="fw-semibold text-white">{tx.guestName}</td>
                  <td className="small text-muted">
                    <span className="d-inline-flex align-items-center gap-1">
                      <CreditCard size={13} className="text-warning" />
                      <span>{tx.method} ({tx.cardLast4})</span>
                    </span>
                  </td>
                  <td className="small text-muted">{tx.date}</td>
                  <td className="fw-bold text-gold-gradient">${Number(tx.amount).toFixed(2)}</td>
                  <td>
                    <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25">
                      {tx.status}
                    </span>
                  </td>
                  <td className="pe-4 text-end">
                    <button
                      onClick={() => onViewReceipt(tx)}
                      className="btn btn-sm btn-glass d-inline-flex align-items-center gap-1"
                    >
                      <FileText size={13} />
                      <span className="small">View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
