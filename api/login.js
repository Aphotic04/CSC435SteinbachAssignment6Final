import jwt from "jsonwebtoken";
import cookie from "cookie";
import bcrypt from "bcryptjs";
import validator from "validator";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Custom function to extract client IP (since req.ip is unavailable in Vercel)
const getClientIp = (req) => {
    return (
        req.headers["x-forwarded-for"]?.split(",")[0] || // Use first IP in case of multiple proxies
        req.connection?.remoteAddress || 
        req.socket?.remoteAddress || 
        "unknown"
    );
};

// Rate limiter with custom IP extraction
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit to 5 login attempts
    keyGenerator: (req) => getClientIp(req), // Custom function to get IP
    message: { error: "Too many login attempts. Try again later." }
});

/**
 * Handles attempted logins in a serverless environment.
 * @param {Object} req - The incoming request object.
 * @param {Object} res - The outgoing response object.
 * @returns {Object} - JSON response indicating success or failure.
 */
export default async function handler(req, res) {
    loginLimiter(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        try {
            // Validate request body
            if (!req.body || !req.body.username || !req.body.password) {
                return res.status(400).json({ error: "Missing username or password" });
            }

            const { username, password } = req.body;

            // Validate username format (only alphanumeric and max 50 chars)
            if (!validator.isAlphanumeric(username) || username.length > 50) {
                return res.status(400).json({ error: "Invalid username format" });
            }

            // Validate password length (8-100 characters)
            if (password.length < 8 || password.length > 100) {
                return res.status(400).json({ error: "Password must be between 8-100 characters" });
            }

            // Mocked user authentication (replace with database lookup)
            const users = [{ username: process.env.USERNAME, password: process.env.PASSWORD }];
            const user = users.find((u) => u.username === username);

            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // Compare provided password with stored (hashed) password
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // Ensure JWT_SECRET is set
            if (!process.env.JWT_SECRET) {
                console.error("JWT_SECRET is not set");
                return res.status(500).json({ error: "Server configuration error" });
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    username,
                    iat: Math.floor(Date.now() / 1000), // Issued at timestamp
                    aud: "myapp.com" // Audience claim
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" } // Token expiration
            );

            // Set secure cookie with JWT
            res.setHeader(
                "Set-Cookie",
                cookie.serialize("token", token, {
                    httpOnly: true, // Protects against XSS
                    secure: process.env.NODE_ENV === "production", // Enforce HTTPS in production
                    sameSite: "strict", // Protect against CSRF
                    maxAge: 3600, // 1 hour expiration
                    path: "/" // Available to all routes
                })
            );

            return res.status(200).json({ message: "Login successful", username });

        } catch (error) {
            console.error("Server error:", error);

            return res.status(500).json({
                error: "Internal server error",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    });
}
