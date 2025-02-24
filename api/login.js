import jwt from "jsonwebtoken";
import cookie from "cookie";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Mock user database (replace with a real DB)
const users = [{ username: "testuser", password: await bcrypt.hash("password123", 10) }];

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { username, password } = req.body;
        const user = users.find((u) => u.username === username);

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Make sure JWT_SECRET is set in your Vercel environment variables
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { 
            expiresIn: "1h" 
        });

        res.setHeader(
            "Set-Cookie", 
            cookie.serialize("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 3600, // 1 hour in seconds
                path: "/"
            })
        );

        return res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
