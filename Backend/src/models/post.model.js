import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true
        },
        content: {
            type: String,
            required: [true, "Content is required"]
        },
        author: {
            type: mongoose.Schema.Types.Mixed, // Can be ObjectId referencing User or String username/name
            default: "Anonymous"
        }
    },
    {
        timestamps: true
    }
);

export const Post = mongoose.model("Post", postSchema);
