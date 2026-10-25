import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Bed,
  Users,
  Maximize2,
  Star,
  Search,
  Filter,
  Check,
  Shield,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const RoomInventory = ({ rooms, onBookRoom, onUpdateRoomStatus }) => {
  const { isStaff } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Luxury', 'Executive', 'Deluxe', 'Villa', 'Standard'];
  const statuses = ['All', 'Available', 'Occupied', 'Cleaning', 'Reserved'];

  const filteredRooms = rooms.filter((room) => {
    const matchCategory = selectedCategory === 'All' || room.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchStatus = selectedStatus === 'All' || room.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchSearch =
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.roomNumber.includes(searchQuery) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchStatus && matchSearch;
  });

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'available':
        return <span className="status-badge badge-available">Available</span>;
      case 'occupied':
        return <span className="status-badge badge-occupied">Occupied</span>;
      case 'cleaning':
        return <span className="status-badge badge-cleaning">Cleaning</span>;
      case 'reserved':
        return <span className="status-badge badge-reserved">Reserved</span>;
      default:
        return <span className="status-badge badge-available">{status}</span>;
    }
  };

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">
      {/* Header and Filter Controls */}
      <div className="glass-panel p-4 mb-4">
        <div className="row align-items-center g-3 mb-3">
          <div className="col-md-6">
            <h2 className="font-cinzel text-white fw-bold mb-1">Suites & Room Inventory</h2>
            <p className="text-muted small mb-0">
              Real-time room availability, luxury amenity packages, and instantaneous reservation locking.
            </p>
          </div>
          <div className="col-md-6">
            <div className="position-relative">
              <Search
                size={18}
                className="position-absolute text-muted"
                style={{ top: '12px', left: '14px' }}
              />
              <input
                type="text"
                placeholder="Search by suite name, room number (e.g. 101, Penthouse)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="luxury-input ps-5"
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 border-top border-secondary border-opacity-10">
          {/* Category Tabs */}
          <div className="d-flex align-items-center gap-1 overflow-auto">
            <span className="small text-muted me-2 d-none d-sm-inline">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm px-3 py-1 rounded-pill ${
                  selectedCategory === cat
                    ? 'btn-warning text-dark fw-bold'
                    : 'btn-outline-secondary text-light'
                }`}
                style={{ fontSize: '0.8rem' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Dropdown */}
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="luxury-select py-1 px-3 text-light"
              style={{ fontSize: '0.82rem' }}
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="row g-4">
        {filteredRooms.map((room) => (
          <div key={room.id} className="col-12 col-md-6 col-xl-3">
            <div className="glass-card-interactive h-100 d-flex flex-column">
              {/* Room Image Container */}
              <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-100 h-100 object-fit-cover"
                  style={{ transition: 'transform 0.5s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
                />
                {/* Status Overlay */}
                <div className="position-absolute top-0 start-0 m-3">
                  {getStatusBadge(room.status)}
                </div>
                {/* Rating Badge */}
                <div
                  className="position-absolute top-0 end-0 m-3 px-2 py-1 rounded-pill d-flex align-items-center gap-1 shadow"
                  style={{ background: 'rgba(11, 19, 43, 0.85)', backdropFilter: 'blur(4px)', border: '1px solid rgba(212,175,55,0.4)' }}
                >
                  <Star size={12} className="text-warning fill-warning" />
                  <span className="small text-white fw-bold" style={{ fontSize: '0.74rem' }}>
                    {room.rating}
                  </span>
                </div>
                {/* Room Number Ribbon */}
                <div
                  className="position-absolute bottom-0 start-0 m-2 px-2 py-1 rounded font-cinzel fw-bold"
                  style={{
                    background: 'rgba(0, 0, 0, 0.75)',
                    color: '#F3E5AB',
                    fontSize: '0.76rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  SUITE #{room.roomNumber}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3 d-flex flex-column flex-grow-1">
                <div className="small text-warning fw-semibold text-uppercase tracking-wider mb-1" style={{ fontSize: '0.72rem' }}>
                  {room.type} • Floor {room.floor}
                </div>
                <h5 className="font-cinzel text-white fw-bold mb-2 text-truncate" title={room.title}>
                  {room.title}
                </h5>

                {/* Specs specs pills */}
                <div className="d-flex align-items-center gap-3 text-muted small mb-3">
                  <span className="d-flex align-items-center gap-1" title="Bed Type">
                    <Bed size={14} className="text-warning" />
                    <span>{room.bedType}</span>
                  </span>
                  <span className="d-flex align-items-center gap-1" title="Guests Capacity">
                    <Users size={14} className="text-warning" />
                    <span>{room.capacity} Guests</span>
                  </span>
                  <span className="d-flex align-items-center gap-1" title="Floor Area">
                    <Maximize2 size={13} className="text-warning" />
                    <span>{room.sizeSqFt} sq ft</span>
                  </span>
                </div>

                {/* Amenities Tags */}
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {room.amenities.slice(0, 3).map((amenity, idx) => (
                    <span
                      key={idx}
                      className="badge bg-secondary bg-opacity-25 text-light fw-normal border border-secondary border-opacity-25"
                      style={{ fontSize: '0.68rem' }}
                    >
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="badge bg-secondary bg-opacity-10 text-muted" style={{ fontSize: '0.68rem' }}>
                      +{room.amenities.length - 3} more
                    </span>
                  )}
                </div>

                <div className="mt-auto pt-3 border-top border-secondary border-opacity-10 d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted small" style={{ fontSize: '0.72rem' }}>Per Night</span>
                    <div className="text-gold-gradient fw-bold fs-4 font-cinzel lh-1">
                      ${room.pricePerNight}
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    {/* Instant Book Button */}
                    <button
                      onClick={() => onBookRoom(room)}
                      disabled={room.status !== 'Available'}
                      className={`btn btn-sm ${
                        room.status === 'Available' ? 'btn-gold' : 'btn-outline-secondary opacity-50'
                      }`}
                      style={{ fontSize: '0.8rem' }}
                    >
                      {room.status === 'Available' ? 'Reserve Suite' : room.status}
                    </button>

                    {/* Staff status switcher toggle */}
                    {isStaff && (
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-glass px-2"
                          type="button"
                          data-bs-toggle="dropdown"
                          title="Staff Status Override"
                        >
                          <Shield size={14} />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow" style={{ background: '#0D1527' }}>
                          <li><h6 className="dropdown-header small text-warning">SET ROOM STATUS</h6></li>
                          {['Available', 'Occupied', 'Cleaning', 'Reserved'].map((st) => (
                            <li key={st}>
                              <button
                                className="dropdown-item small"
                                onClick={() => onUpdateRoomStatus(room.id, st)}
                              >
                                Mark {st}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
