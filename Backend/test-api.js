/**
 * Automated API Test Script for Intro to Backend Tutorial
 * Tests all authentication and CRUD endpoints against running server.
 * Run with: node test-api.js
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:8000";

const colors = {
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    reset: "\x1b[0m",
    bold: "\x1b[1m"
};

function logPass(message) {
    console.log(`${colors.green}✔ PASS:${colors.reset} ${message}`);
}

function logFail(message, error) {
    console.log(`${colors.red}✖ FAIL:${colors.reset} ${message}`);
    if (error) console.error(error);
}

function logSection(title) {
    console.log(`\n${colors.bold}${colors.cyan}--- ${title} ---${colors.reset}`);
}

async function runTests() {
    console.log(`\n${colors.bold}🧪 Starting API Test Suite against: ${BASE_URL}${colors.reset}\n`);

    let passed = 0;
    let failed = 0;
    let createdPostId = null;
    const testUsername = `user_${Date.now()}`;
    const testEmail = `${testUsername}@example.com`;
    const testPassword = "Password123!";

    // 1. Health Check
    logSection("1. System Health Check");
    try {
        const res = await fetch(`${BASE_URL}/`);
        const data = await res.json();
        if (res.status === 200 && data.success) {
            logPass(`GET / responded with 200 OK (${data.message})`);
            passed++;
        } else {
            logFail(`GET / returned unexpected response: ${JSON.stringify(data)}`);
            failed++;
        }
    } catch (err) {
        logFail(`Could not reach server at ${BASE_URL}. Is the server running?`, err.message);
        failed++;
        console.log(`\n${colors.yellow}⚠️  Please start the server first using: npm run dev${colors.reset}\n`);
        return;
    }

    // 2. User Authentication: Register
    logSection("2. User Authentication - Register");
    try {
        const res = await fetch(`${BASE_URL}/api/v1/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: testUsername,
                email: testEmail,
                password: testPassword
            })
        });
        const data = await res.json();
        if (res.status === 201 && data.success && data.user) {
            logPass(`POST /api/v1/users/register - User created: ${data.user.username}`);
            passed++;
        } else {
            logFail(`POST /api/v1/users/register failed: ${JSON.stringify(data)}`);
            failed++;
        }
    } catch (err) {
        logFail("Register test error", err.message);
        failed++;
    }

    // 3. User Authentication: Login
    logSection("3. User Authentication - Login");
    try {
        const res = await fetch(`${BASE_URL}/api/v1/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword
            })
        });
        const data = await res.json();
        if (res.status === 200 && data.success && data.user) {
            logPass(`POST /api/v1/users/login - Successfully logged in as ${data.user.email}`);
            passed++;
        } else {
            logFail(`POST /api/v1/users/login failed: ${JSON.stringify(data)}`);
            failed++;
        }
    } catch (err) {
        logFail("Login test error", err.message);
        failed++;
    }

    // 4. Post CRUD - Create (C)
    logSection("4. Post CRUD - Create (C)");
    try {
        const res = await fetch(`${BASE_URL}/api/v1/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: "Test Automated Post",
                content: "Testing CRUD operations using automated test script.",
                author: testUsername
            })
        });
        const data = await res.json();
        if (res.status === 201 && data.success && data.post) {
            createdPostId = data.post._id;
            logPass(`POST /api/v1/posts - Post created with ID: ${createdPostId}`);
            passed++;
        } else {
            logFail(`POST /api/v1/posts failed: ${JSON.stringify(data)}`);
            failed++;
        }
    } catch (err) {
        logFail("Create post test error", err.message);
        failed++;
    }

    // 5. Post CRUD - Read All (R)
    logSection("5. Post CRUD - Read All (R)");
    try {
        const res = await fetch(`${BASE_URL}/api/v1/posts`);
        const data = await res.json();
        if (res.status === 200 && data.success && Array.isArray(data.posts)) {
            logPass(`GET /api/v1/posts - Retrieved ${data.posts.length} post(s)`);
            passed++;
        } else {
            logFail(`GET /api/v1/posts failed: ${JSON.stringify(data)}`);
            failed++;
        }
    } catch (err) {
        logFail("Get all posts test error", err.message);
        failed++;
    }

    // 6. Post CRUD - Read Single by ID (R)
    logSection("6. Post CRUD - Read Single (R)");
    if (createdPostId) {
        try {
            const res = await fetch(`${BASE_URL}/api/v1/posts/${createdPostId}`);
            const data = await res.json();
            if (res.status === 200 && data.success && data.post) {
                logPass(`GET /api/v1/posts/${createdPostId} - Retrieved title: "${data.post.title}"`);
                passed++;
            } else {
                logFail(`GET /api/v1/posts/${createdPostId} failed: ${JSON.stringify(data)}`);
                failed++;
            }
        } catch (err) {
            logFail("Get post by ID test error", err.message);
            failed++;
        }
    } else {
        logFail("Skipping read single test (no createdPostId)");
        failed++;
    }

    // 7. Post CRUD - Update by ID (U)
    logSection("7. Post CRUD - Update (U)");
    if (createdPostId) {
        try {
            const res = await fetch(`${BASE_URL}/api/v1/posts/${createdPostId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "Test Automated Post - UPDATED",
                    content: "Updated post content via test script."
                })
            });
            const data = await res.json();
            if (res.status === 200 && data.success && data.post && data.post.title.includes("UPDATED")) {
                logPass(`PUT /api/v1/posts/${createdPostId} - Post updated successfully`);
                passed++;
            } else {
                logFail(`PUT /api/v1/posts/${createdPostId} failed: ${JSON.stringify(data)}`);
                failed++;
            }
        } catch (err) {
            logFail("Update post test error", err.message);
            failed++;
        }
    } else {
        logFail("Skipping update test (no createdPostId)");
        failed++;
    }

    // 8. Post CRUD - Delete by ID (D)
    logSection("8. Post CRUD - Delete (D)");
    if (createdPostId) {
        try {
            const res = await fetch(`${BASE_URL}/api/v1/posts/${createdPostId}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (res.status === 200 && data.success) {
                logPass(`DELETE /api/v1/posts/${createdPostId} - Post deleted successfully`);
                passed++;
            } else {
                logFail(`DELETE /api/v1/posts/${createdPostId} failed: ${JSON.stringify(data)}`);
                failed++;
            }
        } catch (err) {
            logFail("Delete post test error", err.message);
            failed++;
        }
    } else {
        logFail("Skipping delete test (no createdPostId)");
        failed++;
    }

    // 9. User Authentication - Logout
    logSection("9. User Authentication - Logout");
    try {
        const res = await fetch(`${BASE_URL}/api/v1/users/logout`, {
            method: "POST"
        });
        const data = await res.json();
        if (res.status === 200 && data.success) {
            logPass(`POST /api/v1/users/logout - User logged out successfully`);
            passed++;
        } else {
            logFail(`POST /api/v1/users/logout failed: ${JSON.stringify(data)}`);
            failed++;
        }
    } catch (err) {
        logFail("Logout test error", err.message);
        failed++;
    }

    // Summary
    console.log(`\n==============================================`);
    console.log(`${colors.bold}Test Results Summary:${colors.reset}`);
    console.log(`  Passed: ${colors.green}${passed}${colors.reset}`);
    console.log(`  Failed: ${colors.red}${failed}${colors.reset}`);
    console.log(`  Total:  ${passed + failed}`);
    console.log(`==============================================\n`);

    if (failed === 0) {
        console.log(`${colors.green}${colors.bold}🎉 All tests passed successfully! Your backend is ready for evaluation!${colors.reset}\n`);
    } else {
        console.log(`${colors.yellow}⚠️ Some tests failed. Please check the logs above.${colors.reset}\n`);
    }
}

runTests();
