import jwt from "jsonwebtoken";
import cookie from "cookie";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// Mock user database (replace with a real DB)
const users = [{ username: "testuser", password: await bcrypt.hash("password123", 10) }];

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end(); // Method not allowed

    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.setHeader("Set-Cookie", cookie.serialize("token", token, {
        httpOnly: true,  // Protects from XSS
        secure: process.env.NODE_ENV === "production",  // HTTPS only in production
        sameSite: "Strict",  // CSRF protection
        path: "/"
    }));

    res.json({ message: "Login successful" });
}
