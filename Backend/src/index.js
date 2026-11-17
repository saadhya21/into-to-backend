import dotenv from "dotenv";
import connectDB from "./db/database.js";
import { app } from "./app.js";

// Load environment variables
dotenv.config({
    path: "./.env"
});

const PORT = process.env.PORT || 8000;

// Connect to MongoDB and start server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`\n==================================================`);
            console.log(`⚙️  Server is running on port: ${PORT}`);
            console.log(`🌐 Local URL: http://localhost:${PORT}`);
            console.log(`📡 Health Check: http://localhost:${PORT}/`);
            console.log(`==================================================\n`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
    });
