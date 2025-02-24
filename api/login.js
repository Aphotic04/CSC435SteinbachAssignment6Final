import jwt from "jsonwebtoken";
import cookie from "cookie";
import bcrypt from "bcryptjs";
import validator from "validator";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit to 5 attempts
    message: { error: "Too many login attempts. Try again later." }
});

export default async function handler(req, res) {
    loginLimiter(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        try {
            if (!req.body || !req.body.username || !req.body.password) {
                return res.status(400).json({ error: "Missing username or password" });
            }

            const { username, password } = req.body;

            if (!validator.isAlphanumeric(username) || username.length > 50) {
                return res.status(400).json({ error: "Invalid username format" });
            }

            if (password.length < 8 || password.length > 100) {
                return res.status(400).json({ error: "Password must be between 8-100 characters" });
            }

            const users = [
                { username: process.env.USERNAME, password: process.env.PASSWORD }
            ];

            const user = users.find((u) => u.username === username);
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            if (!process.env.JWT_SECRET) {
                console.error("JWT_SECRET is not set");
                return res.status(500).json({ error: "Server configuration error" });
            }

            const token = jwt.sign(
                { username, iat: Math.floor(Date.now() / 1000), aud: "myapp.com" },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.setHeader(
                "Set-Cookie",
                cookie.serialize("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 3600,
                    path: "/"
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
