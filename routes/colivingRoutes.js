import express from 'express';
import multer from 'multer';
import {
  getAllColiving,
  getColivingById,
  createColiving,
  updateColiving,
  deleteColiving
} from '../controllers/colivingController.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Remove '/coliving' from these routes since the base path is set in index.js
router.get('/', getAllColiving);
router.get('/:id', getColivingById);
router.post('/', upload.array('images', 5), createColiving);
router.put('/:id', upload.array('images', 5), updateColiving);
router.delete('/:id', deleteColiving);

export default router;