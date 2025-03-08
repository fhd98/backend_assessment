const express = require("express");
const { publishEvent } = require("./producer");

const app = express();
app.use(express.json());

let tasks = [];

app.post('/tasks', async (req, res) => {
    const task = req.body;

    if (!task || typeof task !== 'object' || Object.keys(task).length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Invalid task data provided.',
        });
    }

    tasks.push(task);

    try {
        await publishEvent('TASK_CREATED', task);
        res.status(201).json({
            success: true,
            message: 'Task successfully created.',
            data: task,
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create task. Please try again.',
        });
    }
});


app.put('/tasks/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const taskData = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid task ID.' });
    }

    if (!taskData || typeof taskData !== 'object' || Object.keys(taskData).length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Invalid task data provided.',
        });
    }

    try {
        await publishEvent('TASK_UPDATED', { key: id, value: taskData });
        res.status(200).json({
            success: true,
            message: `Task ${id} processed for updating.`,
            data: taskData,
        });
    } catch (error) {
        console.error(`Error updating task ${id}:`, error);
        res.status(500).json({
            success: false,
            error: 'Failed to update task. Please try again.',
        });
    }
});





app.delete('/tasks/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }

    try {
        await publishEvent('TASK_DELETED', id);
        res.status(200).json({
            success: true,
            message: `Task ${id} has been processed for deleting.`,
        });
    } catch (error) {
        console.error(`Error deleting task ${id}:`, error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete task. Please try again.',
        });
    }
});

app.listen(3001, () => console.log("TodoList Service running on port 3001"));
