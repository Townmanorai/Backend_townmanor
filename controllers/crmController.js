const db = require('../config/database');

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const { title, description, assignee } = req.body;
        const query = 'INSERT INTO crm_tasks (title, description, assignee) VALUES (?, ?, ?)';
        const [result] = await db.execute(query, [title, description, assignee]);
        res.status(201).json({ id: result.insertId, message: 'Task created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const query = 'SELECT * FROM crm_tasks ORDER BY created_at DESC';
        const [tasks] = await db.execute(query);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const query = 'UPDATE crm_tasks SET status = ? WHERE id = ?';
        await db.execute(query, [status, id]);
        res.status(200).json({ message: 'Task status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 