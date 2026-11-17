import express from "express";
import cors from "cors";

// Routes import
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Mount routes (supporting both /api/v1 and /api for compatibility)
app.use("/api/v1/users", userRouter);
app.use("/api/users", userRouter);

app.use("/api/v1/posts", postRouter);
app.use("/api/posts", postRouter);

// Health check / welcome route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 Backend Server is running!",
        routes: {
            users: {
                register: "POST /api/v1/users/register (or /api/users/register)",
                login: "POST /api/v1/users/login (or /api/users/login)",
                logout: "POST /api/v1/users/logout (or /api/users/logout)"
            },
            posts: {
                create: "POST /api/v1/posts (or /api/posts)",
                getAll: "GET /api/v1/posts (or /api/posts)",
                getById: "GET /api/v1/posts/:id (or /api/posts/:id)",
                update: "PUT /api/v1/posts/:id (or /api/posts/:id)",
                delete: "DELETE /api/v1/posts/:id (or /api/posts/:id)"
            }
        }
    });
});

// 404 Not Found Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.originalUrl} not found on this server`
    });
});

export { app };
