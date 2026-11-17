import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;

        if (!uri || uri.includes("<username>") || uri.includes("<password>")) {
            console.warn("\n⚠️  WARNING: MONGODB_URI in your .env file is either missing or contains placeholder values (<username>/<password>).");
            console.warn("👉 Please set up your MongoDB Atlas cluster connection string in 'Backend/.env' to save data to the database.");
            console.warn("👉 Continuing without active MongoDB connection...\n");
            return;
        }

        // Format URI with DB_NAME if needed
        const connectionString = uri.endsWith("/") ? `${uri}${DB_NAME}` : `${uri}/${DB_NAME}`;

        const connectionInstance = await mongoose.connect(connectionString);
        console.log(`\n✅ MongoDB connected successfully! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("\n❌ MONGODB connection FAILED: ", error.message);
        // Do not crash immediately so user can see instructional logs
    }
};

export default connectDB;
