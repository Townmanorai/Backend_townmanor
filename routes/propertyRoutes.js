// routes/propertyRoutes.js
import express from 'express';
import { 
  getPropertyDetails, 
  getAdminProperties,
  getRentalProperties,
  getAdminPropertiesByCity,
  getRentalPropertiesByCity,       
  getOwnerPropertiesByCity         
} from '../controllers/propertyController.js';

const router = express.Router();

router.get('/admin', getAdminProperties);
router.get('/adminbycity', getAdminPropertiesByCity);
router.get('/rentalproperties', getRentalProperties);
router.get('/ownerproperties', getRentalProperties);  
// Add new routes for your functions:
router.get('/rentalpropertiesbycity', getRentalPropertiesByCity);
router.get('/ownerpropertiesbycity', getOwnerPropertiesByCity);

router.get('/:property_name', getPropertyDetails);

export default router;
