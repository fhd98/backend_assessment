const { Kafka } = require("kafkajs");
require("dotenv").config();

const kafka = new Kafka({
  clientId: "todolist-service",
  brokers: [process.env.KAFKA_BROKER], // Example: "localhost:9092"
});

const producer = kafka.producer();

const publishEvent = async (eventType, task) => {
  await producer.connect();
  await producer.send({
    topic: "task-events",
    messages: [{ key: eventType, value: JSON.stringify(task) }],
  });
  await producer.disconnect();
};

module.exports = { publishEvent };
