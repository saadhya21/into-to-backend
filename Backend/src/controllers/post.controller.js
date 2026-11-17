import mongoose from "mongoose";
import { Post } from "../models/post.model.js";

// @desc    Create a new post
// @route   POST /api/v1/posts
// @access  Public
export const createPost = async (req, res) => {
    try {
        const { title, content, description, author } = req.body;

        // Support both "content" and "description"
        const postContent = content || description;

        if (!title || !postContent) {
            return res.status(400).json({
                success: false,
                message: "Title and content (or description) are required"
            });
        }

        const newPost = await Post.create({
            title: title.trim(),
            content: postContent.trim(),
            author: author || "Anonymous"
        });

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: newPost
        });
    } catch (error) {
        console.error("Error in createPost:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating post",
            error: error.message
        });
    }
};

// @desc    Get all posts
// @route   GET /api/v1/posts
// @access  Public
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: posts.length,
            posts
        });
    } catch (error) {
        console.error("Error in getAllPosts:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching posts",
            error: error.message
        });
    }
};

// @desc    Get single post by ID
// @route   GET /api/v1/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Post ID format"
            });
        }

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        return res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        console.error("Error in getPostById:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching the post",
            error: error.message
        });
    }
};

// @desc    Update a post by ID
// @route   PUT /api/v1/posts/:id
// @access  Public
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, description, author } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Post ID format"
            });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title.trim();
        if (content !== undefined) updateData.content = content.trim();
        if (description !== undefined && content === undefined) updateData.content = description.trim();
        if (author !== undefined) updateData.author = author;

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post: updatedPost
        });
    } catch (error) {
        console.error("Error in updatePost:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating the post",
            error: error.message
        });
    }
};

// @desc    Delete a post by ID
// @route   DELETE /api/v1/posts/:id
// @access  Public
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Post ID format"
            });
        }

        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            deletedPostId: id
        });
    } catch (error) {
        console.error("Error in deletePost:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting the post",
            error: error.message
        });
    }
};
