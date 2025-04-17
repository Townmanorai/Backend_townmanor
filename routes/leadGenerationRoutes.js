import express from 'express';
import {
  getLeads,
  createLead
} from '../controllers/leadGenerationController.js';

const router = express.Router();

// GET  /crm/leads
router.get('/leads', getLeads);

// POST /crm/leads
router.post('/leads', createLead);

export default router;
