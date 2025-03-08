const express = require("express");
const { db } = require("./database");
const {startConsumer} = require("./consumer"); // Import the Kafka consumer

const app = express();
app.use(express.json());

app.get('/notifications', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = 10; // Maximum 10 records per page
    const offset = (page - 1) * limit;

    try {
        const notifications = await db
            .selectFrom('notifications')
            .selectAll()
            .limit(limit)
            .offset(offset)
            .execute();

        const totalRecords = await db
            .selectFrom('notifications')
            .select(({ fn }) => fn.count('id').as('count')) // Corrected count query
            .execute();

        const total = parseInt(totalRecords[0].count);

        res.json({
            success: true,
            data: notifications,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
            },
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch notifications. Please try again.',
        });
    }
});


startConsumer().catch(console.error);


app.listen(3002, () => console.log("Notification Service running on port 3002"));
