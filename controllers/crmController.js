import db from '../config/db.js';

// Create a new task
export const createTask = (req, res) => {
  const { title, description, status, assignee, priority, dueDate } = req.body;

  db.query(
    `INSERT INTO crm_tasks (title, description, status, assignee, priority, due_date) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, status, assignee, priority, dueDate],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error creating task', details: err });
      }
      res.status(201).json({ message: 'Task created successfully', id: results.insertId });
    }
  );
};

// Get all tasks
export const getAllTasks = (req, res) => {
  db.query(
    'SELECT * FROM crm_tasks WHERE status != "deleted" ORDER BY created_at DESC',
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching tasks', details: err });
      }
      res.status(200).json(results);
    }
  );
};

// Get task by ID
export const getTaskById = (req, res) => {
  const { id } = req.params;

  db.query(
    'SELECT * FROM crm_tasks WHERE id = ? AND status != "deleted"',
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching task', details: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(200).json(results[0]);
    }
  );
};

// Update task
export const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, status, assignee, priority, dueDate } = req.body;

  db.query(
    `UPDATE crm_tasks 
     SET title = ?, description = ?, status = ?, assignee = ?, priority = ?, due_date = ?
     WHERE id = ?`,
    [title, description, status, assignee, priority, dueDate, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error updating task', details: err });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(200).json({ message: 'Task updated successfully' });
    }
  );
};

// Delete task (soft delete)
export const deleteTask = (req, res) => {
  const { id } = req.params;

  db.query(
    'UPDATE crm_tasks SET status = "deleted" WHERE id = ?',
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error deleting task', details: err });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(200).json({ message: 'Task deleted successfully' });
    }
  );
}; 