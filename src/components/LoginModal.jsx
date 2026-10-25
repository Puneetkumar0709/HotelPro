import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, ShieldCheck, Key, ArrowRight } from 'lucide-react';

export const LoginModal = ({ onClose }) => {
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('admin@hotelpro.com');
  const [password, setPassword] = useState('adminPassword123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginUser(email, password);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const setCredentials = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-luxury p-4" style={{ maxWidth: '500px' }}>
        {/* Header */}
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
              <Lock size={18} className="text-dark" />
            </div>
            <div>
              <h5 className="font-cinzel text-white mb-0 fw-bold">Sign In to HotelPro</h5>
              <small className="text-warning">Role-Based JWT Authentication</small>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-glass btn-sm p-1 rounded-circle">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 small mb-3">
            {error}
          </div>
        )}

        {/* 1-Click Evaluation Credentials for Mentors */}
        <div className="p-3 mb-3 rounded-2 bg-dark bg-opacity-75 border border-warning border-opacity-25">
          <span className="small text-warning fw-bold font-cinzel d-block mb-2">
            ONE-CLICK MENTOR DEMO ROLES:
          </span>
          <div className="d-flex flex-column gap-1">
            <button
              type="button"
              onClick={() => setCredentials('admin@hotelpro.com', 'adminPassword123')}
              className="btn btn-sm btn-glass text-start py-1 px-2 d-flex justify-content-between align-items-center"
            >
              <span>👑 <strong>General Manager</strong> (Admin)</span>
              <span className="small text-muted">admin@hotelpro.com</span>
            </button>
            <button
              type="button"
              onClick={() => setCredentials('frontdesk@hotelpro.com', 'frontdeskPassword123')}
              className="btn btn-sm btn-glass text-start py-1 px-2 d-flex justify-content-between align-items-center"
            >
              <span>🛎️ <strong>Front Desk Supervisor</strong> (Staff)</span>
              <span className="small text-muted">frontdesk@hotelpro.com</span>
            </button>
            <button
              type="button"
              onClick={() => setCredentials('guest@hotelpro.com', 'guestPassword123')}
              className="btn btn-sm btn-glass text-start py-1 px-2 d-flex justify-content-between align-items-center"
            >
              <span>🧳 <strong>Private Guest</strong> (Customer)</span>
              <span className="small text-muted">guest@hotelpro.com</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-muted small fw-semibold">Email Address</label>
            <div className="position-relative">
              <input
                type="email"
                required
                className="luxury-input ps-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail size={14} className="position-absolute text-muted" style={{ top: '12px', left: '10px' }} />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-muted small fw-semibold">Password</label>
            <div className="position-relative">
              <input
                type="password"
                required
                className="luxury-input ps-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Key size={14} className="position-absolute text-muted" style={{ top: '12px', left: '10px' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In with JWT'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
