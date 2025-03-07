const express = require("express");
const { publishEvent } = require("./producer");

const app = express();
app.use(express.json());

let tasks = [];

app.post("/tasks", async (req, res) => {
  const task = { id: tasks.length + 1, ...req.body };
  tasks.push(task);
  await publishEvent("task_created", task);
  res.status(201).json(task);
});

app.listen(3001, () => console.log("TodoList Service running on port 3001"));
