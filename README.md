## Setup Instructions

Start Docker Services

Run the following command to start Kafka and Zookeeper containers:

docker-compose up -d

Verify that both Kafka and Zookeeper are running:

docker ps

## Start Node.js Services

You'll need to run both the TodoList and Notification services.

Start TodoList Service:

cd todolist-service
npm install
npm run dev

Start Notification Service:

cd ../notification-service
npm install
npm run dev

## API Endpoints

TodoList Service

POST /tasks - Create a new task

PUT /tasks/:id - Update an existing task

DELETE /tasks/:id - Delete a task

Notification Service

GET /notifications?page=<number> - Get paginated notifications (10 per page by default)

## Additional Notes

A Postman collection for all 4 APIs is included.

The .env file contains the NeonDB connection details and is not included in .gitignore for convenience.

PostgreSQL is used for database operations, with no in-memory storage.