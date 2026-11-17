# 🚀 Introduction to Backend Web Development

> **A Complete Step-by-Step Guide & Implementation of Node.js, Express, and MongoDB Backend Tutorial**  
> Based on the tutorial: [Intro to Backend Web Development – Node.js & Express Tutorial for Beginners](https://www.youtube.com/watch?v=KOutPbKc9UM)

---

## 📌 Table of Contents
1. [Overview](#-overview)
2. [Project Architecture & Technologies](#-project-architecture--technologies)
3. [Folder Structure](#-folder-structure)
4. [Step a: Setting Up the Node.js Project](#-step-a-setting-up-the-nodejs-project)
5. [Step b: Setting Up Online MongoDB Atlas Cluster](#-step-b-setting-up-online-mongodb-atlas-cluster)
6. [Step c: Database Models (Mongoose)](#-step-c-database-models-mongoose)
7. [Step d: Express APIs (Controllers & Routes for CRUD)](#-step-d-express-apis-controllers--routes-for-crud)
8. [Step e: Testing with Postman Desktop App](#-step-e-testing-with-postman-desktop-app)
9. [Step f: Pushing to GitHub & Submission](#-step-f-pushing-to-github--submission)
10. [Step g: Evaluation Checklist (Showing the Running App)](#-step-g-evaluation-checklist-showing-the-running-app)

---

## 📖 Overview

This repository contains the complete implementation of a RESTful backend application built using the modern **Model-Route-Controller (MRC)** architectural pattern. 

### What this project accomplishes:
- ✅ **Node.js & Express Setup:** Modern ES Modules (`import`/`export`), environment configuration with `dotenv`, CORS handling, and automatic server reloading with `nodemon`.
- ✅ **Cloud Database with MongoDB Atlas:** Secure, cloud-hosted MongoDB cluster connected via `mongoose`.
- ✅ **Database Models:** Mongoose schemas for **Users** (with validation and unique indexes) and **Posts** (with automatic timestamps).
- ✅ **User Authentication APIs:**
  - `POST /api/v1/users/register` (Password hashing using `bcrypt`)
  - `POST /api/v1/users/login` (Secure password comparison)
  - `POST /api/v1/users/logout`
- ✅ **Full CRUD APIs for Posts:**
  - **Create:** `POST /api/v1/posts`
  - **Read All:** `GET /api/v1/posts`
  - **Read Single:** `GET /api/v1/posts/:id`
  - **Update:** `PUT /api/v1/posts/:id`
  - **Delete:** `DELETE /api/v1/posts/:id`
- ✅ **Postman Testing:** Ready-to-import Postman Collection file for automated/manual API testing.

---

## 🛠 Project Architecture & Technologies

```
                  ┌──────────────────────────────────────────────┐
                  │                 Client App                   │
                  │       (Postman / Frontend / Browser)         │
                  └──────────────────────┬───────────────────────┘
                                         │ HTTP Request (JSON)
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │              Express Server                  │
                  │   - CORS Middleware                          │
                  │   - express.json() Body Parser               │
                  └──────────────────────┬───────────────────────┘
                                         │ Matches URL Route
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │               Routes Layer                   │
                  │  /routes/user.routes.js                      │
                  │  /routes/post.routes.js                      │
                  └──────────────────────┬───────────────────────┘
                                         │ Dispatches to Controller
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │             Controllers Layer                │
                  │  /controllers/user.controller.js             │
                  │  /controllers/post.controller.js             │
                  │  - Bcrypt Password Hashing                   │
                  │  - Request Validation & Business Logic       │
                  └──────────────────────┬───────────────────────┘
                                         │ Queries Data Model
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │               Models Layer                   │
                  │  /models/user.model.js                       │
                  │  /models/post.model.js                       │
                  └──────────────────────┬───────────────────────┘
                                         │ Mongoose ODM
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │            MongoDB Atlas Cloud               │
                  │               (Database)                     │
                  └──────────────────────────────────────────────┘
```

- **Runtime:** [Node.js](https://nodejs.org/) (v18+)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)
- **ODM:** [Mongoose](https://mongoosejs.com/)
- **Security:** [Bcrypt](https://www.npmjs.com/package/bcryptjs)
- **Environment Management:** [dotenv](https://www.npmjs.com/package/dotenv)
- **API Testing:** [Postman](https://www.postman.com/)

---

## 📂 Folder Structure

```text
into-to-backend/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── post.controller.js      # Business logic for Posts CRUD
│   │   │   └── user.controller.js      # Business logic for Registration & Login
│   │   ├── db/
│   │   │   └── database.js             # Mongoose connection logic to MongoDB Atlas
│   │   ├── models/
│   │   │   ├── post.model.js           # Post Mongoose Schema
│   │   │   └── user.model.js           # User Mongoose Schema
│   │   ├── routes/
│   │   │   ├── post.routes.js          # REST routes for posts
│   │   │   └── user.routes.js          # Auth routes for users
│   │   ├── app.js                      # Express configuration & middleware
│   │   ├── constants.js                # Database name & app constants
│   │   └── index.js                    # Server entry point & startup listener
│   ├── .env                            # Environment variables (PORT, MONGODB_URI)
│   ├── .env.sample                     # Template for environment variables
│   ├── .gitignore                      # Git ignore file for Backend
│   ├── intro-to-backend.postman_collection.json # Postman API test collection
│   └── package.json                    # Backend project dependencies and scripts
├── intro-to-backend.postman_collection.json     # Postman collection (root copy)
├── package.json                        # Root helper package.json
├── .gitignore                          # Root gitignore
└── README.md                           # Documentation and tutorial walkthrough
```

---

## 🚀 Step a: Setting Up the Node.js Project

### 1. Prerequisites
Make sure you have Node.js and Git installed:
```bash
node -v   # Should be v18 or higher
npm -v    # Should be v9 or higher
git --version
```

### 2. Initializing the Project
If setting up from scratch:
```bash
mkdir into-to-backend
cd into-to-backend
mkdir Backend
cd Backend
npm init -y
```

### 3. Enabling ES Modules
Open `Backend/package.json` and add:
```json
"type": "module"
```

### 4. Installing Dependencies
Install the required production and development dependencies:
```bash
npm install express mongoose dotenv cors bcryptjs
npm install -D nodemon
```

### 5. Configuring Scripts in `package.json`
Inside `Backend/package.json`:
```json
"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}
```

---

## ☁️ Step b: Setting Up Online MongoDB Atlas Cluster

Follow these steps to set up your free MongoDB database in the cloud:

1. **Create an Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. **Create a Free Cluster:**
   - Select the **M0 Free Tier** cluster (Shared).
   - Choose a cloud provider (AWS / Google Cloud) and region closest to you.
   - Click **Create Cluster**.
3. **Configure Database Access (User Credentials):**
   - In the left sidebar, click **Database Access** under *Security*.
   - Click **Add New Database User**.
   - Authentication Method: **Password**.
   - Set a username (e.g. `admin`) and a secure password (avoid special characters like `@` or `:` or URL-encode them).
   - Built-in Role: **Read and write to any database**.
   - Click **Add User**.
4. **Configure Network Access (IP Whitelist):**
   - In the left sidebar, click **Network Access** under *Security*.
   - Click **Add IP Address**.
   - Select **Allow Access From Anywhere** (`0.0.0.0/0`) for development.
   - Click **Confirm**.
5. **Get Your Connection String:**
   - In the left sidebar, click **Database** / **Clusters**.
   - Click the **Connect** button next to your cluster.
   - Select **Drivers** (Node.js).
   - Copy the connection string format:
     ```
     mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
     ```
6. **Add to `.env` File:**
   - In `Backend/.env`, update your `MONGODB_URI`:
     ```env
     PORT=8000
     MONGODB_URI=mongodb+srv://admin:yourPasswordHere@cluster0.xxxxx.mongodb.net
     CORS_ORIGIN=*
     ```

---

## 🗄️ Step c: Database Models (Mongoose)

### 1. User Model (`Backend/src/models/user.model.js`)
Defines the schema for registered users:
```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            lowercase: true,
            trim: true,
            minlength: 3
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6
        }
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
```

### 2. Post Model (`Backend/src/models/post.model.js`)
Defines the schema for blog/feed posts:
```javascript
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
            type: mongoose.Schema.Types.Mixed,
            default: "Anonymous"
        }
    },
    { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
```

---

## ⚡ Step d: Express APIs (Controllers & Routes for CRUD)

### API Endpoints Reference Table

| Module | HTTP Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **System** | `GET` | `/` | Health check & API directory |
| **User** | `POST` | `/api/v1/users/register` | Register new user with hashed password |
| **User** | `POST` | `/api/v1/users/login` | Login user by verifying password |
| **User** | `POST` | `/api/v1/users/logout` | Logout user |
| **Post** | `POST` | `/api/v1/posts` | **Create** a new post (**C** in CRUD) |
| **Post** | `GET` | `/api/v1/posts` | **Read** all posts (**R** in CRUD) |
| **Post** | `GET` | `/api/v1/posts/:id` | **Read** single post by ID (**R** in CRUD) |
| **Post** | `PUT` | `/api/v1/posts/:id` | **Update** post by ID (**U** in CRUD) |
| **Post** | `DELETE` | `/api/v1/posts/:id` | **Delete** post by ID (**D** in CRUD) |

*(Note: Routes also support `/api/users/...` and `/api/posts/...` for seamless compatibility).*

---

## 🧪 Step e: Testing with Postman Desktop App

A complete pre-configured Postman Collection is included in this repository:
📄 `intro-to-backend.postman_collection.json`

### How to Import and Test in Postman:
1. Open the **Postman Desktop App**.
2. Click the **Import** button in the top-left corner.
3. Drag & drop or select `intro-to-backend.postman_collection.json`.
4. You will see the collection named **"Intro to Backend Tutorial API"** with two folders:
   - **Users / Authentication**
   - **Posts (CRUD Operations)**

### Step-by-Step API Testing Guide:

#### 1. Test Server Health Check
- **Request:** `GET http://localhost:8000/`
- **Expected Status:** `200 OK`
- **Response:**
  ```json
  {
    "success": true,
    "message": "🚀 Backend Server is running!",
    "routes": { ... }
  }
  ```

#### 2. Register a User
- **Request:** `POST http://localhost:8000/api/v1/users/register`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "username": "saadhya",
    "email": "saadhya@example.com",
    "password": "mypassword123"
  }
  ```
- **Expected Status:** `201 Created`
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": {
      "id": "6739...",
      "username": "saadhya",
      "email": "saadhya@example.com",
      "createdAt": "2026-11-18T..."
    }
  }
  ```

#### 3. Login the User
- **Request:** `POST http://localhost:8000/api/v1/users/login`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "email": "saadhya@example.com",
    "password": "mypassword123"
  }
  ```
- **Expected Status:** `200 OK`
- **Response:**
  ```json
  {
    "success": true,
    "message": "User logged in successfully",
    "user": {
      "id": "6739...",
      "username": "saadhya",
      "email": "saadhya@example.com"
    }
  }
  ```

#### 4. Create a Post (Create in CRUD)
- **Request:** `POST http://localhost:8000/api/v1/posts`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "title": "My Journey into Backend Development",
    "content": "Building APIs with Express, Node, and MongoDB is fun!",
    "author": "saadhya"
  }
  ```
- **Expected Status:** `201 Created`
- **Copy the generated `_id` from the response** for the next steps!

#### 5. Get All Posts (Read in CRUD)
- **Request:** `GET http://localhost:8000/api/v1/posts`
- **Expected Status:** `200 OK`
- **Response:** Array containing all saved posts with `count`.

#### 6. Get Single Post by ID (Read in CRUD)
- **Request:** `GET http://localhost:8000/api/v1/posts/<COPIED_POST_ID>`
- **Expected Status:** `200 OK`
- **Response:** The single post object.

#### 7. Update a Post by ID (Update in CRUD)
- **Request:** `PUT http://localhost:8000/api/v1/posts/<COPIED_POST_ID>`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "title": "My Updated Journey into Backend Development",
    "content": "Updated content: CRUD APIs are now fully operational!"
  }
  ```
- **Expected Status:** `200 OK`
- **Response:** The updated post object.

#### 8. Delete a Post by ID (Delete in CRUD)
- **Request:** `DELETE http://localhost:8000/api/v1/posts/<COPIED_POST_ID>`
- **Expected Status:** `200 OK`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Post deleted successfully",
    "deletedPostId": "<COPIED_POST_ID>"
  }
  ```

---

## 📤 Step f: Pushing to GitHub & Submission

This project is connected to the GitHub repository:
👉 `https://github.com/saadhya21/into-to-backend.git`

To stage, commit, and push your changes to GitHub:

```bash
# 1. Check changed files
git status

# 2. Stage all files
git add .

# 3. Commit with a meaningful message
git commit -m "Complete Backend Tutorial: Node.js, Express, MongoDB Atlas, Models, Controllers, CRUD APIs, and Postman Collection"

# 4. Push to your main branch
git push origin main
```

Your public repository URL for submission:
🔗 **`https://github.com/saadhya21/into-to-backend`**

---

## 🎯 Step g: Evaluation Checklist (Showing the Running App)

When presenting this project for your 3rd evaluation, be prepared to demonstrate:

1. **Server Startup:**
   ```bash
   cd Backend
   npm run dev
   ```
   Show terminal output:
   ```
   ==================================================
   ⚙️  Server is running on port: 8000
   🌐 Local URL: http://localhost:8000
   📡 Health Check: http://localhost:8000/
   ==================================================
   ✅ MongoDB connected successfully!
   ```
2. **MongoDB Atlas Dashboard:**
   - Open your MongoDB Atlas browser tab.
   - Go to **Database** -> **Browse Collections**.
   - Show the `intro_to_backend` database with `users` and `posts` collections.
3. **Live API Calls in Postman:**
   - Execute **Register User** and show that the password is saved as a secure bcrypt hash in MongoDB Atlas (never plaintext!).
   - Execute **Login User** and demonstrate successful 200 OK response.
   - Execute **Create Post**, show the new document created in Atlas.
   - Execute **Get All Posts** and **Get Single Post by ID**.
   - Execute **Update Post** and show modified content.
   - Execute **Delete Post** and show document removed.
4. **Code Architecture Walkthrough:**
   - Explain how `app.js` sets up routes and middleware.
   - Show how `database.js` connects Mongoose to MongoDB.
   - Show how `models/` define the document schema.
   - Show how `controllers/` separate business logic from routing.
