import express from 'express';
import { getBookingById, createBooking, updateBookingFields, getBookingDatesByRoomId, getBookingsByUsername } from '../controllers/bookingsController.js';

const router = express.Router();

// Route to create a new booking
router.post('/', createBooking);
// Route to get booking dates and status by room_id (should be above :id route)
router.get('/roomdata/:room_id', getBookingDatesByRoomId);
// Route to get booking by ID
router.get('/:id', getBookingById);
// Route to update profile_picture, payment_receipt, and status
router.patch('/:id', updateBookingFields);

// API to get bookings by username
router.get('/username/:username', getBookingsByUsername);

export default router;
