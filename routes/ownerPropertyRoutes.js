import express from 'express';
import {
  createProperty,
  getAllProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getAllPropertyByFilter,
  getSaleProperties,
  getRentProperties,
  getFilteredProperties,
  getFilteredPropertiesByName,

//   uploadPropertyImages,
} from '../controllers/ownerPropertyController.js';

const router = express.Router();

// Routes
router.post('/', createProperty); 
router.get('/', getAllProperty); 
router.get('/filter', getAllPropertyByFilter); 
router.get('/filter/sale', getSaleProperties); 
router.get('/filter/rent', getRentProperties); 
router.get('/filter/suggestion', getFilteredProperties); 
router.get('/filter/suggestion/name', getFilteredPropertiesByName);
router.get('/:id', getPropertyById); 
router.put('/:id', updateProperty); 
router.delete('/:id', deleteProperty); 

// router.post('/upload-images', uploadPropertyImages); // Upload images to S3

export default router;