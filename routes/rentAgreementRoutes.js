// Import necessary modules


import express from 'express';
import {
  getRentAgreementById,
  createRentAgreement,
  updateRentAgreement,
  deleteRentAgreement,
  updateTenantVerification,
  updateLandlordVerification
} from '../controllers/rentAgreementController.js';

const router = express.Router();

router.get('/:id', getRentAgreementById);
router.post('/', createRentAgreement);
router.put('/:id', updateRentAgreement);
router.delete('/:id', deleteRentAgreement);
router.patch('/:id/verify-tenant', updateTenantVerification);
router.put('/:id/verify-landlord', updateLandlordVerification);

export default router;