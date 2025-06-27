import express from 'express';
import { getBookingById, createBooking } from '../controllers/bookingsController.js';

const router = express.Router();

// Route to create a new booking
router.post('/', createBooking);
// Route to get booking by ID
router.get('/:id', getBookingById);

export default router;
