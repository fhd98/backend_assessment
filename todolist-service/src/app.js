const express = require("express");
const { publishEvent } = require("./producer");

const app = express();
app.use(express.json());

let tasks = [];

app.post("/tasks", async (req, res) => {
  const task = { id: tasks.length + 1, ...req.body };
  tasks.push(task);
  await publishEvent("TASK_CREATED", task);
  
  res.status(201).json(task);
});

app.put('/tasks/:id', async (req, res) => {
    console.log('hereee');
    
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return res.status(404).json({ message: 'Task not found' });

    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    await publishEvent('TASK_UPDATED', tasks[taskIndex]);
    res.json(tasks[taskIndex]);
});

app.delete('/tasks/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return res.status(404).json({ message: 'Task not found' });

    const deletedTask = tasks.splice(taskIndex, 1)[0];
    await publishEvent('TASK_DELETED', deletedTask);
    res.json(deletedTask);
});


app.listen(3001, () => console.log("TodoList Service running on port 3001"));
