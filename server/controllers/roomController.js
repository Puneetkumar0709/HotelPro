import { initialRooms } from '../data/seedData.js';

let roomsStore = [...initialRooms];

export const getAllRooms = async (req, res) => {
  try {
    const { status, category, minPrice, maxPrice, search } = req.query;

    let filtered = [...roomsStore];

    if (status && status !== 'All') {
      filtered = filtered.filter((r) => r.status.toLowerCase() === status.toLowerCase());
    }

    if (category && category !== 'All') {
      filtered = filtered.filter((r) => r.category.toLowerCase() === category.toLowerCase());
    }

    if (minPrice) {
      filtered = filtered.filter((r) => r.pricePerNight >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((r) => r.pricePerNight <= Number(maxPrice));
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.roomNumber.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = roomsStore.find((r) => r.id === req.params.id || r.roomNumber === req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    return res.status(200).json({ success: true, data: room });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRoomStatus = async (req, res) => {
  try {
    const { status, housekeeperAssigned } = req.body;
    const roomIndex = roomsStore.findIndex((r) => r.id === req.params.id || r.roomNumber === req.params.id);

    if (roomIndex === -1) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (status) roomsStore[roomIndex].status = status;
    if (housekeeperAssigned) roomsStore[roomIndex].housekeeperAssigned = housekeeperAssigned;

    return res.status(200).json({
      success: true,
      message: `Room ${roomsStore[roomIndex].roomNumber} updated to ${status}`,
      data: roomsStore[roomIndex],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const newRoom = {
      id: `room-${Date.now()}`,
      ...req.body,
    };
    roomsStore.unshift(newRoom);
    return res.status(201).json({ success: true, data: newRoom });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoomsStore = () => roomsStore;
