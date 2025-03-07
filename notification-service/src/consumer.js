const { Kafka } = require("kafkajs");
const { insertNotification } = require("./database");
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
      await insertNotification(eventType, task);
      console.log(`New notification: ${eventType} - ${task.id}`);
    },
  });
};

startConsumer().catch(console.error);
