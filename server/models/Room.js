import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Deluxe Suite', 'Executive Ocean View', 'Presidential Villa', 'Superior King', 'Penthouse', 'Family Suite'],
      required: true,
    },
    category: {
      type: String,
      enum: ['Standard', 'Deluxe', 'Executive', 'Luxury', 'Villa'],
      default: 'Deluxe',
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      default: 2,
    },
    bedType: {
      type: String,
      default: 'King Bed',
    },
    sizeSqFt: {
      type: Number,
      default: 450,
    },
    floor: {
      type: Number,
      default: 1,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    status: {
      type: String,
      enum: ['Available', 'Occupied', 'Cleaning', 'Reserved', 'Maintenance'],
      default: 'Available',
    },
    images: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: ['High-speed Wi-Fi', 'Smart 4K TV', 'Minibar', 'Ocean View', 'Climate Control'],
    },
    description: {
      type: String,
      default: '',
    },
    housekeeperAssigned: {
      type: String,
      default: 'Unassigned',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model('Room', roomSchema);
