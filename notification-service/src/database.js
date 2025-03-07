const { Kysely, PostgresDialect } = require("kysely");
const { Pool } = require("pg");
require("dotenv").config();

const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL, // NeonDB connection
    }),
  }),
});

const createTable = async () => {
  await db.schema
    .createTable("notifications")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("event_type", "text", (col) => col.notNull())
    .addColumn("task_data", "jsonb", (col) => col.notNull())
    .execute();
};

const insertNotification = async (eventType, task) => {
  await db.insertInto("notifications").values({
    event_type: eventType,
    task_data: task,
  }).execute();
};

module.exports = { db, createTable, insertNotification };
