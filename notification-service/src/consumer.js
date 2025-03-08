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
console.log('taskkk',task);

      switch (eventType) {
        case "TASK_CREATED":
          await insertNotification(eventType, task);
          console.log(`Task created: ${task.id}`);
          break;

        case "TASK_UPDATED":            
            await updateNotification(parseInt(task.key), task.value);
            console.log(`Task updated: ${task.key.toString()}`);
            break;

        case "TASK_DELETED":
          await deleteNotification(parseInt(task));
          console.log(`Task deleted: ${task}`);
          break;

        default:
          console.warn(`Unknown event type: ${eventType}`);
      }
    },
  });
};

startConsumer().catch(console.error);
module.exports = { startConsumer };

