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

//   uploadPropertyImages,
} from '../controllers/ownerPropertyController.js';

const router = express.Router();

// Routes
router.post('/', createProperty); // Create property
router.get('/', getAllProperty); // Create property
router.get('/filter', getAllPropertyByFilter); // filter property
router.get('/filter/sale', getSaleProperties); // filter property
router.get('/filter/rent', getRentProperties); // filter property
router.get('/:id', getPropertyById); // Get property by ID
router.put('/:id', updateProperty); // Update property
router.delete('/:id', deleteProperty); // Delete property

// router.post('/upload-images', uploadPropertyImages); // Upload images to S3

export default router;