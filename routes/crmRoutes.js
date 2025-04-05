import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/crmController.js';

const router = express.Router();

// Create a new task
router.post('/tasks', createTask);

// Get all tasks
router.get('/tasks', getAllTasks);

// Get a single task by ID
router.get('/tasks/:id', getTaskById);

// Update a task
router.put('/tasks/:id', updateTask);

// Delete a task (soft delete)
router.delete('/tasks/:id', deleteTask);

export default router; 