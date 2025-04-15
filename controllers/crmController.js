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
  const validStatuses = ['todo', 'doing', 'testing', 'completed'];
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

// Update task status with history tracking
export const updateTaskStatus = (req, res) => {
  const { id } = req.params;
  const { status, changed_by } = req.body;

  console.log('Updating task status:', { id, status, changed_by });

  if (!status || !changed_by) {
    return res.status(400).json({
      error: 'Missing required fields',
      details: 'Status and changed_by are required'
    });
  }

  // Validate status against the correct enum values
  const validStatuses = ['todo', 'in_progress', 'completed', 'testing'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status',
      details: `Status must be one of: ${validStatuses.join(', ')}`
    });
  }

  // Start a transaction
  db.beginTransaction(err => {
    if (err) {
      console.error('Transaction error:', err);
      return res.status(500).json({
        error: 'Error starting transaction',
        details: err.message
      });
    }

    // Update task status
    db.query(
      'UPDATE crm_tasks SET status = ? WHERE id = ?',
      [status, id],
      (err, results) => {
        if (err) {
          return db.rollback(() => {
            console.error('Database error:', err);
            res.status(500).json({
              error: 'Error updating task status',
              details: err.message
            });
          });
        }

        if (results.affectedRows === 0) {
          return db.rollback(() => {
            res.status(404).json({
              error: 'Task not found',
              details: `No task found with id ${id}`
            });
          });
        }

        // Record status change in history
        db.query(
          'INSERT INTO task_history (task_id, status, changed_by) VALUES (?, ?, ?)',
          [id, status, changed_by],
          (err, historyResults) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error recording history:', err);
                res.status(500).json({
                  error: 'Error recording task history',
                  details: err.message
                });
              });
            }

            // Commit transaction
            db.commit(err => {
              if (err) {
                return db.rollback(() => {
                  console.error('Commit error:', err);
                  res.status(500).json({
                    error: 'Error committing transaction',
                    details: err.message
                  });
                });
              }

              res.status(200).json({
                message: 'Task status updated successfully',
                taskId: id,
                newStatus: status
              });
            });
          }
        );
      }
    );
  });
};

// Get task history
export const getTaskHistory = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT th.*, t.title as task_title
    FROM task_history th
    JOIN crm_tasks t ON th.task_id = t.id
    WHERE th.task_id = ?
    ORDER BY th.changed_at DESC
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching task history:', err);
      return res.status(500).json({
        error: 'Error fetching task history',
        details: err.message
      });
    }

    res.status(200).json(results);
  });
};

// Update task priority
export const updateTaskPriority = (req, res) => {
  const { id } = req.params;
  const { priority } = req.body;

  if (!priority) {
    return res.status(400).json({
      error: 'Missing required field',
      details: 'Priority is required'
    });
  }

  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({
      error: 'Invalid priority',
      details: `Priority must be one of: ${validPriorities.join(', ')}`
    });
  }

  db.query(
    'UPDATE crm_tasks SET priority = ? WHERE id = ?',
    [priority, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          error: 'Error updating task priority',
          details: err.message
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          error: 'Task not found'
        });
      }

      res.status(200).json({
        message: 'Task priority updated successfully',
        taskId: id,
        newPriority: priority
      });
    }
  );
};

// Update task progress
export const updateTaskProgress = (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;

  if (typeof progress !== 'number' || progress < 0 || progress > 100) {
    return res.status(400).json({
      error: 'Invalid progress value',
      details: 'Progress must be a number between 0 and 100'
    });
  }

  db.query(
    'UPDATE crm_tasks SET progress = ? WHERE id = ?',
    [progress, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          error: 'Error updating task progress',
          details: err.message
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          error: 'Task not found'
        });
      }

      res.status(200).json({
        message: 'Task progress updated successfully',
        taskId: id,
        newProgress: progress
      });
    }
  );
};

// Assign tester
export const assignTester = (req, res) => {
  const { id } = req.params;
  const { tester } = req.body;

  if (!tester) {
    return res.status(400).json({
      error: 'Missing required field',
      details: 'Tester name is required'
    });
  }

  db.query(
    'UPDATE crm_tasks SET tester = ? WHERE id = ?',
    [tester, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          error: 'Error assigning tester',
          details: err.message
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          error: 'Task not found'
        });
      }

      res.status(200).json({
        message: 'Tester assigned successfully',
        taskId: id,
        tester: tester
      });
    }
  );
};

// Create work log
export const createWorkLog = (req, res) => {
  const { user_id, work_date, task_description } = req.body;

  if (!user_id || !work_date || !task_description) {
    return res.status(400).json({
      error: 'Missing required fields',
      details: 'user_id, work_date, and task_description are required'
    });
  }

  db.query(
    'INSERT INTO crm_work_logs (user_id, work_date, task_description) VALUES (?, ?, ?)',
    [user_id, work_date, task_description],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          error: 'Error creating work log',
          details: err.message
        });
      }

      res.status(201).json({
        message: 'Work log created successfully',
        id: results.insertId
      });
    }
  );
};

// Get work logs
export const getWorkLogs = (req, res) => {
  const { user_id, start_date, end_date } = req.query;

  let query = 'SELECT * FROM crm_work_logs WHERE 1=1';
  const params = [];

  if (user_id) {
    query += ' AND user_id = ?';
    params.push(user_id);
  }

  if (start_date) {
    query += ' AND work_date >= ?';
    params.push(start_date);
  }

  if (end_date) {
    query += ' AND work_date <= ?';
    params.push(end_date);
  }

  query += ' ORDER BY work_date DESC, created_at DESC';

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: 'Error fetching work logs',
        details: err.message
      });
    }

    res.status(200).json(results);
  });
};

// Export work logs
export const exportWorkLogs = (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({
      error: 'Missing required fields',
      details: 'start_date and end_date are required'
    });
  }

  const query = `
    SELECT 
      wl.*,
      u.name as user_name
    FROM crm_work_logs wl
    LEFT JOIN users u ON wl.user_id = u.id
    WHERE work_date BETWEEN ? AND ?
    ORDER BY work_date DESC, user_id, created_at DESC
  `;

  db.query(query, [start_date, end_date], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: 'Error exporting work logs',
        details: err.message
      });
    }

    // Format data for Excel export
    const excelData = results.map(log => ({
      Date: log.work_date,
      User: log.user_name || log.user_id,
      'Task Description': log.task_description,
      'Created At': log.created_at
    }));

    res.status(200).json(excelData);
  });
};

// Get analytics overview
export const getAnalyticsOverview = (req, res) => {
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM crm_tasks) AS total_tasks,
      (SELECT COUNT(*) FROM crm_tasks WHERE status = 'todo') AS todo_count,
      (SELECT COUNT(*) FROM crm_tasks WHERE status = 'doing') AS doing_count,
      (SELECT COUNT(*) FROM crm_tasks WHERE status = 'completed') AS completed_count,
      (SELECT COUNT(*) FROM crm_tasks WHERE priority = 'high') AS high_priority_count,
      (SELECT COUNT(*) FROM crm_tasks WHERE priority = 'medium') AS medium_priority_count,
      (SELECT COUNT(*) FROM crm_tasks WHERE priority = 'low') AS low_priority_count
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error getting analytics overview:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results[0]);
  });
};

// Get assignee statistics
export const getAssigneeStats = (req, res) => {
  const query = `
    SELECT 
      assignee,
      COUNT(*) AS total_tasks,
      SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) AS todo_count,
      SUM(CASE WHEN status = 'doing' THEN 1 ELSE 0 END) AS doing_count,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_count,
      SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) AS high_priority_count,
      SUM(CASE WHEN priority = 'medium' THEN 1 ELSE 0 END) AS medium_priority_count,
      SUM(CASE WHEN priority = 'low' THEN 1 ELSE 0 END) AS low_priority_count
    FROM crm_tasks
    GROUP BY assignee
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error getting assignee stats:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};