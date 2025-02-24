import jwt from "jsonwebtoken";
import cookie from "cookie";
import bcrypt from "bcryptjs";

// For testing purposes, create a hashed password
const hashedPassword = bcrypt.hashSync("password123", 10);

const users = [
    { 
        username: "testuser", 
        password: hashedPassword
    }
];

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // Log incoming request
        console.log('Login attempt:', { 
            body: req.body,
            headers: req.headers
        });

        if (!req.body || !req.body.username || !req.body.password) {
            return res.status(400).json({ 
                error: "Missing username or password" 
            });
        }

        const { username, password } = req.body;
        const user = users.find((u) => u.username === username);

        if (!user) {
            return res.status(401).json({ 
                error: "Invalid credentials" 
            });
        }

        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            return res.status(401).json({ 
                error: "Invalid credentials" 
            });
        }

        // Verify JWT_SECRET exists
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set');
            return res.status(500).json({ 
                error: "Server configuration error" 
            });
        }

        const token = jwt.sign(
            { username }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        res.setHeader(
            "Set-Cookie", 
            cookie.serialize("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax", // Changed from strict for testing
                maxAge: 3600,
                path: "/"
            })
        );

        return res.status(200).json({ 
            message: "Login successful",
            username 
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ 
            error: "Internal server error",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}