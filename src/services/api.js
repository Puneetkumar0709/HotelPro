import { initialRooms, initialBookings, initialPayments, initialGuests } from '../../server/data/seedData.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Local storage keys for hybrid persistence fallback
const STORAGE_KEYS = {
  ROOMS: 'hotelpro_rooms',
  BOOKINGS: 'hotelpro_bookings',
  PAYMENTS: 'hotelpro_payments',
  GUESTS: 'hotelpro_guests',
  TOKEN: 'hotelpro_jwt_token',
  USER: 'hotelpro_current_user',
};

// Initialize localStorage fallback if empty
export const initLocalFallback = () => {
  if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(initialRooms));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(initialBookings));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(initialPayments));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GUESTS)) {
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(initialGuests));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify({
        id: 'user-admin',
        name: 'Sarah Montgomery (General Manager)',
        email: 'admin@hotelpro.com',
        role: 'admin',
        department: 'Executive Management',
      })
    );
  }
  if (!localStorage.getItem(STORAGE_KEYS.TOKEN)) {
    // Standard mock JWT token
    localStorage.setItem(
      STORAGE_KEYS.TOKEN,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItYWRtaW4iLCJuYW1lIjoiU2FyYWggTW9udGdvbWVyeSIsImVtYWlsIjoiYWRtaW5AaG90ZWxwcm8uY29tIiwicm9sZSI6ImFkbWluIiwiZGVwYXJ0bWVudCI6IkV4ZWN1dGl2ZSBNYW5hZ2VtZW50IiwiaWF0IjoxNzg0OTI4MDAwLCJleHAiOjE3ODU1MzI4MDB9.s7c8Qf_HotelProAdminVerificationKeySignature'
    );
  }
};

const getHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Rooms
  async getRooms(params = {}) {
    initLocalFallback();
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/rooms?${query}`, {
        headers: getHeaders(),
        signal: AbortSignal.timeout(1800),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Graceful fallback to client storage
    }
    let rooms = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS) || '[]');
    if (params.category && params.category !== 'All') {
      rooms = rooms.filter((r) => r.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.status && params.status !== 'All') {
      rooms = rooms.filter((r) => r.status.toLowerCase() === params.status.toLowerCase());
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      rooms = rooms.filter(
        (r) =>
          r.roomNumber.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q)
      );
    }
    return rooms;
  },

  async updateRoomStatus(id, status, housekeeperAssigned) {
    initLocalFallback();
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status, housekeeperAssigned }),
        signal: AbortSignal.timeout(1800),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Local fallback
    }
    const rooms = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS) || '[]');
    const index = rooms.findIndex((r) => r.id === id || r.roomNumber === id);
    if (index !== -1) {
      if (status) rooms[index].status = status;
      if (housekeeperAssigned) rooms[index].housekeeperAssigned = housekeeperAssigned;
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
      return rooms[index];
    }
    return null;
  },

  // Bookings
  async getBookings(params = {}) {
    initLocalFallback();
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/bookings?${query}`, {
        headers: getHeaders(),
        signal: AbortSignal.timeout(1800),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    if (params.status && params.status !== 'All') {
      list = list.filter((b) => b.bookingStatus.toLowerCase() === params.status.toLowerCase());
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (b) =>
          b.guestName.toLowerCase().includes(q) ||
          b.bookingReference.toLowerCase().includes(q) ||
          b.roomNumber.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async createBooking(bookingData) {
    initLocalFallback();
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(bookingData),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch {
      // Fallback
    }
    const ref = `HP-BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: `bk-${Date.now()}`,
      bookingReference: ref,
      ...bookingData,
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString(),
    };

    const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    bookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    // Update room status
    const rooms = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS) || '[]');
    const rIdx = rooms.findIndex((r) => r.roomNumber === bookingData.roomNumber || r.id === bookingData.roomId);
    if (rIdx !== -1) {
      rooms[rIdx].status = 'Occupied';
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    }

    // Record payment
    const payment = {
      id: `tx-${Date.now()}`,
      transactionId: `TXN-${Math.floor(10000 + Math.random() * 90000)}-HP`,
      bookingReference: ref,
      guestName: bookingData.guestName,
      amount: bookingData.totalAmount,
      currency: 'USD',
      method: bookingData.paymentMethod || 'Credit Card',
      status: 'Success',
      receiptNumber: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      cardLast4: '4242',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    const payments = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]');
    payments.unshift(payment);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));

    return { success: true, data: newBooking, payment };
  },

  async updateBookingStatus(id, status) {
    initLocalFallback();
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
        signal: AbortSignal.timeout(1800),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    const booking = bookings.find((b) => b.id === id || b.bookingReference === id);
    if (booking) {
      booking.bookingStatus = status;
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

      // Sync room status
      const rooms = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS) || '[]');
      const rIdx = rooms.findIndex((r) => r.roomNumber === booking.roomNumber);
      if (rIdx !== -1) {
        if (status === 'Checked In') rooms[rIdx].status = 'Occupied';
        if (status === 'Checked Out') rooms[rIdx].status = 'Cleaning';
        if (status === 'Cancelled') rooms[rIdx].status = 'Available';
        localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
      }
      return booking;
    }
    return null;
  },

  // Payments
  async getPayments(params = {}) {
    initLocalFallback();
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/payments?${query}`, {
        headers: getHeaders(),
        signal: AbortSignal.timeout(1800),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    let payments = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]');
    if (params.search) {
      const q = params.search.toLowerCase();
      payments = payments.filter(
        (p) =>
          p.transactionId.toLowerCase().includes(q) ||
          p.bookingReference.toLowerCase().includes(q) ||
          p.guestName.toLowerCase().includes(q)
      );
    }
    return payments;
  },

  // Guests
  async getGuests() {
    initLocalFallback();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.GUESTS) || '[]');
  },

  // Stats
  async getStats() {
    initLocalFallback();
    try {
      const res = await fetch(`${API_BASE_URL}/stats`, {
        headers: getHeaders(),
        signal: AbortSignal.timeout(1800),
      });
      if (res.ok) {
        const json = await res.json();
        return json.stats;
      }
    } catch {
      // Fallback
    }
    const rooms = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS) || '[]');
    const payments = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]');
    const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');

    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter((r) => r.status === 'Occupied').length;
    const availableRooms = rooms.filter((r) => r.status === 'Available').length;
    const cleaningRooms = rooms.filter((r) => r.status === 'Cleaning').length;
    const reservedRooms = rooms.filter((r) => r.status === 'Reserved').length;
    const totalRevenue = payments
      .filter((p) => p.status === 'Success')
      .reduce((sum, p) => sum + Number(p.amount), 0);
    const activeBookings = bookings.filter((b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked In').length;

    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      cleaningRooms,
      reservedRooms,
      occupancyRate: Math.round((occupiedRooms / (totalRooms || 1)) * 100),
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      activeBookings,
      avgRating: 4.88,
      staffOnDuty: 14,
      checkInsToday: 3,
      checkOutsToday: 2,
    };
  },

  // Auth
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(1800),
      });
      if (res.ok) {
        const json = await res.json();
        localStorage.setItem(STORAGE_KEYS.TOKEN, json.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(json.user));
        return json;
      }
    } catch {
      // Fallback
    }
    // Demo accounts
    let role = 'guest';
    let name = 'Guest Traveler';
    if (email.includes('admin')) {
      role = 'admin';
      name = 'Sarah Montgomery (General Manager)';
    } else if (email.includes('frontdesk')) {
      role = 'receptionist';
      name = 'Liam Gallagher (Front Desk Supervisor)';
    }

    const user = {
      id: `user-${role}`,
      name,
      email,
      role,
      department: role === 'admin' ? 'Executive Management' : 'Guest Relations',
    };

    const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
      JSON.stringify({ ...user, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 604800 })
    )}.HotelProSignatureVerification`;

    localStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return { success: true, token: mockToken, user };
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
};
