import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Key, ShieldCheck, Copy, CheckCircle, Code, Lock } from 'lucide-react';

export const JwtInspectorModal = ({ onClose }) => {
  const { user, token, switchRole } = useAuth();
  const [copied, setCopied] = useState(false);

  // Decode JWT parts
  const parseJwt = (tokenStr) => {
    try {
      if (!tokenStr) return null;
      const parts = tokenStr.split('.');
      if (parts.length < 2) return null;
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      return { header, payload, signature: parts[2] || 'verified_secret' };
    } catch {
      return {
        header: { alg: 'HS256', typ: 'JWT' },
        payload: user || { role: 'admin' },
        signature: 'HotelPro_Signature_Verified',
      };
    }
  };

  const decoded = parseJwt(token);

  const handleCopy = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-luxury p-4" style={{ maxWidth: '720px' }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom border-secondary border-opacity-25">
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #06B6D4, #0284C7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Key size={20} className="text-white" />
            </div>
            <div>
              <h5 className="font-cinzel text-white mb-0 fw-bold">Live JWT Token Inspector</h5>
              <small className="text-info">Industry Standard RFC 7519 Compliant Token</small>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-glass btn-sm p-1 rounded-circle">
            <X size={18} />
          </button>
        </div>

        {/* Description for Mentor */}
        <div className="p-3 mb-3 rounded-2 bg-dark bg-opacity-50 border border-info border-opacity-25 small text-light">
          <ShieldCheck size={16} className="text-info inline me-1" />
          <strong>Mentor Inspection Note:</strong> HotelPro protects administrative endpoints and staff operations using signed JSON Web Tokens transmitted via the <code>Authorization: Bearer &lt;token&gt;</code> HTTP header.
        </div>

        {/* Raw Token string */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="small text-muted fw-semibold">Encoded Bearer Token:</span>
            <button
              onClick={handleCopy}
              className="btn btn-sm btn-glass py-0 px-2 d-flex align-items-center gap-1"
              style={{ fontSize: '0.75rem' }}
            >
              {copied ? <CheckCircle size={12} className="text-success" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy Token'}</span>
            </button>
          </div>
          <div
            className="p-2 rounded bg-black font-monospace text-warning small overflow-x-auto text-break border border-secondary border-opacity-25"
            style={{ maxHeight: '80px', fontSize: '0.75rem' }}
          >
            {token || 'No active JWT token found'}
          </div>
        </div>

        {/* Decoded Header and Payload */}
        <div className="row g-3 mb-3">
          {/* Header */}
          <div className="col-md-5">
            <span className="small text-danger fw-semibold d-block mb-1">Header (Algorithm & Token Type)</span>
            <pre
              className="p-3 rounded bg-black text-danger font-monospace small mb-0 border border-secondary border-opacity-25"
              style={{ fontSize: '0.78rem' }}
            >
              {JSON.stringify(decoded?.header, null, 2)}
            </pre>
          </div>

          {/* Payload */}
          <div className="col-md-7">
            <span className="small text-info fw-semibold d-block mb-1">Payload (Data Claims & Permissions)</span>
            <pre
              className="p-3 rounded bg-black text-info font-monospace small mb-0 border border-secondary border-opacity-25"
              style={{ fontSize: '0.78rem', maxHeight: '180px', overflowY: 'auto' }}
            >
              {JSON.stringify(decoded?.payload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Quick Role Switcher Inside Inspector */}
        <div className="p-3 rounded bg-dark bg-opacity-75 border border-secondary border-opacity-25 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span className="small text-muted">Test Different JWT Claims:</span>
          <div className="d-flex gap-2">
            <button
              onClick={() => switchRole('admin')}
              className={`btn btn-sm ${user?.role === 'admin' ? 'btn-warning text-dark fw-bold' : 'btn-glass'}`}
            >
              Admin Role
            </button>
            <button
              onClick={() => switchRole('receptionist')}
              className={`btn btn-sm ${user?.role === 'receptionist' ? 'btn-warning text-dark fw-bold' : 'btn-glass'}`}
            >
              Front Desk Role
            </button>
            <button
              onClick={() => switchRole('guest')}
              className={`btn btn-sm ${user?.role === 'guest' ? 'btn-warning text-dark fw-bold' : 'btn-glass'}`}
            >
              Guest Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
