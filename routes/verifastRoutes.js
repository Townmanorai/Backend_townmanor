import express from 'express';
import {
  getAllAdminProperties,
  getAllAdminPropertiesById,
  getAdminPropertyByPropertyName,
  getAllOwnerProperties,
  getAllOwnerPropertiesById,
  getOwnerPropertyByPropertyName,
  getAllCommericalPropertiesDetails,
  getAllCommericalPropertiesDetailsById,
  getCommercialDetailsByProjectName,
  getAllCommericalPropertiesUnits,
  getAllCommericalPropertiesUnitsById,
  getCommercialUnitByName,

} from '../controllers/verifastController.js';

const router = express.Router();

// Routes for verifast
router.get('/admin-properties', getAllAdminProperties); 
router.get('/admin-properties/:id', getAllAdminPropertiesById); 
router.get('/admin-properties/property/:property_name', getAdminPropertyByPropertyName);
router.get('/owner-properties', getAllOwnerProperties); 
router.get('/owner-properties/:id', getAllOwnerPropertiesById); 
router.get('/owner-properties/property/:property_name', getOwnerPropertyByPropertyName);
router.get('/commercial-properties/commercial-details', getAllCommericalPropertiesDetails); 
router.get('/commercial-properties/commercial-details/:id', getAllCommericalPropertiesDetailsById);
router.get('/commercial-properties/commercial-details/project/:project_name', getCommercialDetailsByProjectName); 
router.get('/commercial-properties/commercial-units', getAllCommericalPropertiesUnits); 
router.get('/commercial-properties/commercial-units/:id', getAllCommericalPropertiesUnitsById); 
router.get('/commercial-properties/commercial-units/unit/:name', getCommercialUnitByName);


export default router;
