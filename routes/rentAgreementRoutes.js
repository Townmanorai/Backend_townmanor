// Import necessary modules


import express from 'express';
import {
  getRentAgreementById,
  createRentAgreement,
  updateRentAgreement,
  deleteRentAgreement
} from '../controllers/rentAgreementController.js';

const router = express.Router();

router.get('/:id', getRentAgreementById);
router.post('/', createRentAgreement);
router.put('/:id', updateRentAgreement);
router.delete('/:id', deleteRentAgreement);

export default router;