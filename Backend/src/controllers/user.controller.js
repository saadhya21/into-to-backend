import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

// @desc    Register a new user
// @route   POST /api/v1/users/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation - check required fields
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields (username, email, password) are required"
            });
        }

        // Check if user already exists with same email or username
        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email or username already exists"
            });
        }

        // Hash password with bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = await User.create({
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: hashedPassword
        });

        // Return response without exposing the password
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                createdAt: newUser.createdAt
            }
        });
    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during registration",
            error: error.message
        });
    }
};

// @desc    Login existing user
// @route   POST /api/v1/users/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Validation - need either email or username, and password
        const identifier = email || username;
        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: "Email/Username and password are required"
            });
        }

        // Find user by email or username
        const user = await User.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                { username: identifier.toLowerCase() }
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist"
            });
        }

        // Compare password with hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error in loginUser:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during login",
            error: error.message
        });
    }
};

// @desc    Logout user
// @route   POST /api/v1/users/logout
// @access  Public
export const logoutUser = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error("Error in logoutUser:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during logout",
            error: error.message
        });
    }
};
