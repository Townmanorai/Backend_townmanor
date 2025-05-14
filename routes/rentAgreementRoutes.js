import express from 'express';
import {
  getAllRentAgreements,
  getRentAgreementById,
  createRentAgreement,
  updateRentAgreement,
  deleteRentAgreement
} from '../controllers/rentAgreementController.js';

const router = express.Router();

// Define routes
router.get('/', getAllRentAgreements);
router.get('/:id', getRentAgreementById);
router.post('/', createRentAgreement);
router.put('/:id', updateRentAgreement);
router.delete('/:id', deleteRentAgreement);

export default router;