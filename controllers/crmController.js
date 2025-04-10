import db from '../config/db.js';

// Create a new task
export const createTask = (req, res) => {
  console.log('Received task creation request:', req.body);
  
  // Destructure including priority with a default
  const { title, description, assignee, status = 'todo', priority} = req.body;

  // Validate required fields
  if (!title || !description || !assignee) {
    console.error('Missing required fields:', { title, description, assignee });
    return res.status(400).json({ 
      error: 'Missing required fields',
      details: 'Title, description, and assignee are required',
      received: { title, description, assignee }
    });
  }

  // Validate status
  const validStatuses = ['todo', 'doing', 'completed'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status',
      details: `Status must be one of: ${validStatuses.join(', ')}`
    });
  }

  // Check database connection
  if (!db) {
    console.error('Database connection not available');
    return res.status(500).json({ 
      error: 'Database connection error',
      details: 'Database connection is not available'
    });
  }

  // Updated query to include priority
  const query = `INSERT INTO crm_tasks (title, description, assignee, status, priority) 
                 VALUES (?, ?, ?, ?, ?)`;
  const values = [title, description, assignee, status, priority];

  console.log('Executing query:', query);
  console.log('With values:', values);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Error creating task', 
        details: err.message,
        code: err.code,
        sql: err.sql
      });
    }
    
    console.log('Task created successfully:', results);
    res.status(201).json({ 
      message: 'Task created successfully', 
      id: results.insertId,
      task: { title, description, assignee, status, priority }
    });
  });
};

// Get all tasks
export const getAllTasks = (req, res) => {
  console.log('Fetching all tasks...');
  
  if (!db) {
    console.error('Database connection not available');
    return res.status(500).json({ 
      error: 'Database connection error',
      details: 'Database connection is not available'
    });
  }

  const query = 'SELECT * FROM crm_tasks ORDER BY created_at DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Error fetching tasks', 
        details: err.message,
        code: err.code,
        sql: err.sql
      });
    }

    // Format dates to ISO string
    const formattedResults = results.map(task => ({
      ...task,
      created_at: task.created_at ? new Date(task.created_at).toISOString() : null,
      updated_at: task.updated_at ? new Date(task.updated_at).toISOString() : null
    }));

    console.log(`Found ${formattedResults.length} tasks`);
    res.status(200).json(formattedResults);
  });
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

// Update task status
export const updateTaskStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log('Updating task status:', { id, status });

  if (!status) {
    return res.status(400).json({
      error: 'Missing required field',
      details: 'Status is required'
    });
  }

  // Validate status against the correct enum values
  const validStatuses = ['todo', 'doing', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status',
      details: `Status must be one of: ${validStatuses.join(', ')}`
    });
  }

  db.query(
    'UPDATE crm_tasks SET status = ? WHERE id = ?',
    [status, id],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          error: 'Error updating task status',
          details: err.message
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          error: 'Task not found',
          details: `No task found with id ${id}`
        });
      }

      res.status(200).json({
        message: 'Task status updated successfully',
        taskId: id,
        newStatus: status
      });
    }
  );
};


// Add to crmController.js
export const getAnalyticsOverview = (req, res) => {
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM crm_tasks) AS total_tasks,
      (SELECT COUNT(*) FROM crm_tasks WHERE status = 'todo') AS todo_tasks,
      (SELECT COUNT(*) FROM crm_tasks WHERE status = 'doing') AS doing_tasks,
      (SELECT COUNT(*) FROM crm_tasks WHERE status = 'completed') AS completed_tasks,
      (SELECT COUNT(*) FROM crm_tasks WHERE priority = 'high') AS high_priority,
      (SELECT COUNT(*) FROM crm_tasks WHERE priority = 'medium') AS medium_priority,
      (SELECT COUNT(*) FROM crm_tasks WHERE priority = 'low') AS low_priority
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};

export const getAssigneeStats = (req, res) => {
  const query = `
    SELECT 
      assignee,
      COUNT(*) AS total_tasks,
      SUM(status = 'todo') AS todo,
      SUM(status = 'doing') AS doing,
      SUM(status = 'completed') AS completed,
      SUM(priority = 'high') AS high_priority,
      SUM(priority = 'medium') AS medium_priority,
      SUM(priority = 'low') AS low_priority
    FROM crm_tasks
    GROUP BY assignee
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};