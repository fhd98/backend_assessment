const express = require("express");
const { db } = require("./database");
const consumer = require("./consumer"); // Import the Kafka consumer

const app = express();
app.use(express.json());

app.get("/notifications", async (req, res) => {
  const notifications = await db.selectFrom("notifications").selectAll().execute();
  res.json(notifications);
});

consumer().catch(console.error);


app.listen(3002, () => console.log("Notification Service running on port 3002"));
