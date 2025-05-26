// Import necessary modules


import express from 'express';
import {
  getRentAgreementById,
  createRentAgreement,
  updateRentAgreement,
  deleteRentAgreement,
  updateTenantVerification,
  updateLandlordVerification,
  getLastTenAgreements 
} from '../controllers/rentAgreementController.js';

const router = express.Router();
router.get('/recent', getLastTenAgreements);
router.post('/', createRentAgreement);



router.get('/:id', getRentAgreementById);
router.put('/:id', updateRentAgreement);
router.delete('/:id', deleteRentAgreement);
router.patch('/:id/verify-tenant', updateTenantVerification);
router.patch('/:id/verify-landlord', updateLandlordVerification);


export default router;