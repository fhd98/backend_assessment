const { Kafka } = require("kafkajs");
const { insertNotification, updateNotification, deleteNotification } = require("./database");
require("dotenv").config();

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "notifications-group" });

const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "task-events", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const eventType = message.key.toString();
      const task = JSON.parse(message.value.toString());

      switch (eventType) {
        case "TASK_CREATED":
          await insertNotification(eventType, task);
          console.log(`Task created: ${task.id}`);
          break;

        case "TASK_UPDATED":
          await updateNotification(task.id, task);
          console.log(`Task updated: ${task.id}`);
          break;

        case "TASK_DELETED":
          await deleteNotification(task.id);
          console.log(`Task deleted: ${task.id}`);
          break;

        default:
          console.warn(`Unknown event type: ${eventType}`);
      }
    },
  });
};

startConsumer().catch(console.error);
module.exports = { startConsumer };

