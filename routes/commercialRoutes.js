import express from 'express';
import { getCommercialDetails, getCommercialDetailById,getCommercialDetailsByCity, createCommercialDetail, updateCommercialDetail, deleteCommercialDetail } from '../controllers/commercialDetailsController.js';
import { getCommercialUnits, getCommercialUnitById, createCommercialUnit, updateCommercialUnit, deleteCommercialUnit,getCommercialUnitByComPropId } from '../controllers/commercialUnitsController.js';

const router = express.Router();

// Routes for commercial_details
router.get('/commercial-details', getCommercialDetails);
router.get('/commercial-details/:id', getCommercialDetailById);
router.get('/commercial-details/city/:city', getCommercialDetailsByCity);
router.post('/commercial-details', createCommercialDetail);
router.put('/commercial-details/:id', updateCommercialDetail);
router.delete('/commercial-details/:id', deleteCommercialDetail);

// Routes for commercial_units
router.get('/commercial-units', getCommercialUnits);
router.get('/commercial-units/:id', getCommercialUnitById);
router.get('/commercial-units/com_prop_id/:com_prop_id', getCommercialUnitByComPropId);
router.post('/commercial-units', createCommercialUnit);
router.put('/commercial-units/:id', updateCommercialUnit);
router.delete('/commercial-units/:id', deleteCommercialUnit);

export default router;
