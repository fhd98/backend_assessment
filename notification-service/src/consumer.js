const { Kafka } = require("kafkajs");
const { insertNotification } = require("./database");
require("dotenv").config();

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "notifications-group" });

const startConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "task-events", fromBeginning: true });

    console.log("🚀 Kafka Consumer started and listening for events...");

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const eventType = message.key ? message.key.toString() : "unknown";
          const task = JSON.parse(message.value.toString());

          await insertNotification(eventType, task);
          console.log(`✅ New notification: ${eventType} - Task ID: ${task.id}`);
        } catch (error) {
          console.error("❌ Error processing message:", error);
        }
      },
    });
  } catch (error) {
    console.error("❌ Error starting Kafka consumer:", error);
  }
};

// ✅ Export function so it can be called in `app.js`
module.exports = startConsumer;
