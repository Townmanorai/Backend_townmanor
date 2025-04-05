const express = require('express');
const router = express.Router();
const crmController = require('../controllers/crmController');

// Create a new task
router.post('/tasks', crmController.createTask);

// Get all tasks
router.get('/tasks', crmController.getAllTasks);

// Update task status
router.put('/tasks/:id/status', crmController.updateTaskStatus);

module.exports = router; 