import jwt from "jsonwebtoken";
import cookie from "cookie";
import bcrypt from "bcryptjs";
import validator from "validator";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config(); //Config dotenv

//Sets a limit to rate of login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit to 5 attempts
    message: { error: "Too many login attempts. Try again later." }
});

/**
 * Handles attempted logins serverlessly.
 * @param {Object} req - The request info.
 * @param {Object} res - The response info.
 * @returns {Object} - Either an error or a success message and the username.
 * @throws {Error} - Thrown for any sort of issues with the login.
 */
export default async function handler(req, res) {
    // Apply rate-limiting middleware (prevents brute-force attacks)
    loginLimiter(req, res, async () => {
        // Ensure only POST requests are allowed
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        try {
            // Validate request body (check if username & password exist)
            if (!req.body || !req.body.username || !req.body.password) {
                return res.status(400).json({ error: "Missing username or password" });
            }

            const { username, password } = req.body;

            // Validate username: must be alphanumeric and not exceed 50 characters
            if (!validator.isAlphanumeric(username) || username.length > 50) {
                return res.status(400).json({ error: "Invalid username format" });
            }

            // Validate password length (enforce strong password policy)
            if (password.length < 8 || password.length > 100) {
                return res.status(400).json({ error: "Password must be between 8-100 characters" });
            }

            // Simulated user database (should be replaced with a real DB lookup)
            const users = [
                { username: process.env.USERNAME, password: process.env.PASSWORD }
            ];

            // Find user in the list (case-sensitive match)
            const user = users.find((u) => u.username === username);
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // Compare provided password with stored (hashed) password
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // Ensure JWT_SECRET is set in the environment variables
            if (!process.env.JWT_SECRET) {
                console.error("JWT_SECRET is not set");
                return res.status(500).json({ error: "Server configuration error" });
            }

            // Generate JWT token with claims
            const token = jwt.sign(
                {
                    username, 
                    iat: Math.floor(Date.now() / 1000), // Issued at timestamp
                    aud: "myapp.com" // Audience claim (can be used for validation)
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" } // Token expiry (1 hour)
            );

            // Set secure cookie containing JWT token
            res.setHeader(
                "Set-Cookie",
                cookie.serialize("token", token, {
                    httpOnly: true, // Prevents JavaScript access (protection against XSS)
                    secure: process.env.NODE_ENV === "production", // Enforce HTTPS in production
                    sameSite: "strict", // Mitigates CSRF attacks
                    maxAge: 3600, // 1 hour expiration
                    path: "/" // Available to all routes
                })
            );

            // Respond with success message and username
            return res.status(200).json({ message: "Login successful", username });

        } catch (error) {
            console.error("Server error:", error);

            // In development, return error details for debugging
            return res.status(500).json({
                error: "Internal server error",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    });
}
