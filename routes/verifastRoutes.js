import express from 'express';
import {
  getAllAdminProperties,
  getAllAdminPropertiesById,
  getAllOwnerProperties,
  getAllOwnerPropertiesById,
  getAllCommericalPropertiesDetails,
  getAllCommericalPropertiesDetailsById,
  getAllCommericalPropertiesUnits,
  getAllCommericalPropertiesUnitsById,

} from '../controllers/verifastController.js';

const router = express.Router();

// Routes for verifast
router.get('/admin-properties', getAllAdminProperties); 
router.get('/admin-properties/:id', getAllAdminPropertiesById); 
router.get('/owner-properties', getAllOwnerProperties); 
router.get('/owner-properties/:id', getAllOwnerPropertiesById); 
router.get('/commercial-properties/commercial-details', getAllCommericalPropertiesDetails); 
router.get('/commercial-properties/commercial-details/:id', getAllCommericalPropertiesDetailsById); 
router.get('/commercial-properties/commercial-units', getAllCommericalPropertiesUnits); 
router.get('/commercial-properties/commercial-units/:id', getAllCommericalPropertiesUnitsById); 

export default router;
