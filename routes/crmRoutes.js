import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getAnalyticsOverview,
  getAssigneeStats,
  getTaskHistory,
  updateTaskPriority,
  updateTaskProgress,
  assignTester,
  createWorkLog,
  getWorkLogs,
  exportWorkLogs
} from '../controllers/crmController.js';

const router = express.Router();

// Create a new task
router.post('/tasks', createTask);

// Get all tasks
router.get('/tasks', getAllTasks);

// Get analytics
router.get('/analytics/overview', getAnalyticsOverview);
router.get('/analytics/assignee-stats', getAssigneeStats);

// Get a single task by ID
router.get('/tasks/:id', getTaskById);

// Update a task
router.put('/tasks/:id', updateTask);

// Update task status
router.put('/tasks/:id/status', updateTaskStatus);

// Update task priority
router.put('/tasks/:id/priority', updateTaskPriority);

// Update task progress
router.put('/tasks/:id/progress', updateTaskProgress);

// Assign tester
router.put('/tasks/:id/assign-tester', assignTester);

// Get task history
router.get('/tasks/:id/history', getTaskHistory);

// Work logs
router.post('/work-logs', createWorkLog);
router.get('/work-logs', getWorkLogs);
router.get('/work-logs/export', exportWorkLogs);

// Delete a task (soft delete)
router.delete('/tasks/:id', deleteTask);

export default router; 