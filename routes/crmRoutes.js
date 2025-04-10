import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getAnalyticsOverview,
  getAssigneeStats
} from '../controllers/crmController.js';

const router = express.Router();

// Create a new task
router.post('/tasks', createTask);

// Get all tasks
router.get('/tasks', getAllTasks);

// Add to crmRoutes.js
router.get('/analytics/overview', getAnalyticsOverview);
router.get('/analytics/assignee-stats', getAssigneeStats);

// Get a single task by ID
router.get('/tasks/:id', getTaskById);

// Update a task
router.put('/tasks/:id', updateTask);

// Update task status
router.put('/tasks/:id/status', updateTaskStatus);

// Delete a task (soft delete)
router.delete('/tasks/:id', deleteTask);



export default router; 