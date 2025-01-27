// routes/propertyRoutes.js
import express from 'express';
import { getPropertyDetails, getAdminProperties,getRentalProperties,getAdminPropertiesByCity } from '../controllers/propertyController.js';

const router = express.Router();

// Route to fetch all properties listed by admin
router.get('/admin', getAdminProperties);

// Route to fetch all properties listed by admin filter by city
router.get('/adminbycity', getAdminPropertiesByCity);

// Route to fetch all properties which is rental
router.get('/rentalproperties', getRentalProperties);

// Route to fetch all properties listed by owner
router.get('/ownerproperties', getRentalProperties);

// Route to fetch property details and associated agents/owners
router.get('/:property_name', getPropertyDetails);

export default router;

