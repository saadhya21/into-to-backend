import express from "express";
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
} from "../controllers/post.controller.js";

const router = express.Router();

// CRUD routes for posts
router.post("/", createPost);          // Create a new post
router.get("/", getAllPosts);          // Read all posts
router.get("/:id", getPostById);       // Read a single post by ID
router.put("/:id", updatePost);        // Update a post by ID
router.delete("/:id", deletePost);     // Delete a post by ID

export default router;
