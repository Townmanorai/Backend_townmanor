import express from 'express';
import { getCommercialDetails, getCommercialDetailById, createCommercialDetail, updateCommercialDetail, deleteCommercialDetail } from '../controllers/commercialDetailsController.js';
import { getCommercialUnits, getCommercialUnitById, createCommercialUnit, updateCommercialUnit, deleteCommercialUnit } from '../controllers/commercialUnitsController.js';

const router = express.Router();

// Routes for commercial_details
router.get('/commercial-details', getCommercialDetails);
router.get('/commercial-details/:id', getCommercialDetailById);
router.post('/commercial-details', createCommercialDetail);
router.put('/commercial-details/:id', updateCommercialDetail);
router.delete('/commercial-details/:id', deleteCommercialDetail);

// Routes for commercial_units
router.get('/commercial-units', getCommercialUnits);
router.get('/commercial-units/:id', getCommercialUnitById);
router.post('/commercial-units', createCommercialUnit);
router.put('/commercial-units/:id', updateCommercialUnit);
router.delete('/commercial-units/:id', deleteCommercialUnit);

export default router;
