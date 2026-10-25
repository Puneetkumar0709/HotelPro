import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const HousekeepingView = ({ rooms, onUpdateStatus }) => {
  const staffMembers = ['Maria Santos', 'David Chen', 'Elena Rostova', 'Kenji Takahashi'];

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      {/* Header */}
      <div className="glass-panel p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h2 className="font-cinzel text-white fw-bold mb-1">Housekeeping & Staff Workflows</h2>
            <p className="text-muted small mb-0">
              Real-time room sanitization protocols, staff task allocations, and instant room turnover.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-dark text-warning border border-warning border-opacity-25 px-3 py-2">
              <Sparkles size={14} className="me-1 inline" /> 14 Hospitality Staff on Duty
            </span>
          </div>
        </div>
      </div>

      {/* Housekeeping Cards Grid */}
      <div className="row g-3">
        {rooms.map((room) => {
          const isClean = room.status === 'Available';
          const isCleaning = room.status === 'Cleaning';
          const isOccupied = room.status === 'Occupied';
          const isReserved = room.status === 'Reserved';

          return (
            <div key={room.id} className="col-12 col-md-6 col-xl-3">
              <div
                className="glass-card-interactive p-3 h-100 d-flex flex-column"
                style={{
                  borderLeft: isClean
                    ? '4px solid #10B981'
                    : isCleaning
                    ? '4px solid #06B6D4'
                    : isOccupied
                    ? '4px solid #F43F5E'
                    : '4px solid #F59E0B',
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="font-cinzel fw-bold text-white fs-5">
                    Suite #{room.roomNumber}
                  </span>
                  <span
                    className={`badge ${
                      isClean
                        ? 'badge-available'
                        : isCleaning
                        ? 'badge-cleaning'
                        : isOccupied
                        ? 'badge-occupied'
                        : 'badge-reserved'
                    } status-badge`}
                  >
                    {room.status}
                  </span>
                </div>

                <div className="small text-muted mb-2 text-truncate" title={room.title}>
                  {room.title}
                </div>

                <div className="p-2 mb-3 rounded-2 bg-dark bg-opacity-40 border border-secondary border-opacity-10 small">
                  <div className="d-flex align-items-center gap-1 text-light mb-1">
                    <User size={13} className="text-warning" />
                    <span>Attendant: <strong>{room.housekeeperAssigned || 'Team Lead'}</strong></span>
                  </div>
                  <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.72rem' }}>
                    <Clock size={12} />
                    <span>Floor {room.floor} • Standard 35 min turnaround</span>
                  </div>
                </div>

                {/* Status Toggle Actions */}
                <div className="mt-auto pt-2 border-top border-secondary border-opacity-10 d-flex gap-1">
                  <button
                    onClick={() => onUpdateStatus(room.id, 'Available')}
                    className={`btn btn-sm flex-grow-1 ${
                      isClean ? 'btn-success' : 'btn-outline-success'
                    }`}
                    style={{ fontSize: '0.75rem' }}
                    title="Mark Ready for Guests"
                  >
                    <CheckCircle2 size={13} className="me-1 inline" /> Clean
                  </button>
                  <button
                    onClick={() => onUpdateStatus(room.id, 'Cleaning')}
                    className={`btn btn-sm flex-grow-1 ${
                      isCleaning ? 'btn-info text-dark' : 'btn-outline-info'
                    }`}
                    style={{ fontSize: '0.75rem' }}
                    title="Mark Turnaround In Progress"
                  >
                    <RefreshCw size={13} className="me-1 inline" /> In-Progress
                  </button>
                  <button
                    onClick={() => onUpdateStatus(room.id, 'Occupied')}
                    className={`btn btn-sm flex-grow-1 ${
                      isOccupied ? 'btn-danger' : 'btn-outline-danger'
                    }`}
                    style={{ fontSize: '0.75rem' }}
                    title="Mark In-Use"
                  >
                    Occupied
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
