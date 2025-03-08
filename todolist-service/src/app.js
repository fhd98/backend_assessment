const express = require("express");
const { publishEvent } = require("./producer");

const app = express();
app.use(express.json());

let tasks = [];

app.post("/tasks", async (req, res) => {
  const task = req.body ;
  tasks.push(task);
  await publishEvent("TASK_CREATED", task);
  
  res.status(201).json(task);
});

app.put('/tasks/:id', async (req, res) => {

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }

    await publishEvent('TASK_UPDATED', { key: id, value: req.body });
    res.json(req.body);
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
            message: `Task ${id} has been successfully deleted.`,
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
