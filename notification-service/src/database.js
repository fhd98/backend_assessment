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


const insertNotification = async (eventType, task) => {
  await db.insertInto("notifications").values({
    event_type: eventType,
    task_data: task,
  }).execute();
};

async function updateNotification(taskId, task) {
    await db
      .updateTable('notifications')
      .set({
        task_data: JSON.stringify(task),
        updated_at: new Date().toISOString(),
        event_type: "TASK_UPDATED"
      })
      .where('id', '=', taskId)
      .execute();
  }

  async function deleteNotification(taskId) {
    await db
      .deleteFrom('notifications')
      .where('id', '=', taskId)
      .execute();
  }
  

module.exports = { db, insertNotification, updateNotification, deleteNotification };
