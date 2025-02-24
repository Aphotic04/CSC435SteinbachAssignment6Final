import jwt from "jsonwebtoken";
import cookie from "cookie";
import dotenv from "dotenv";

dotenv.config();

/**
 * Handles fetching company description serverlessly.
 * @param {Object} req - The request info.
 * @param {Object} res - The response info.
 * @returns {Object} - Either an error or the fetched data.
 * @throws {Error} - Thrown for any sort of issues with the authentication or API fetch.
 */
export default async function handler(req, res) {
  //Ensures only GET is allowed
  if (req.method !== "GET") {
    return res.status(405).end();
  } 

  //Extract token from cookies
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token;

  const TEMP_KEY = process.env.AI_KEY; // Securely stored on Vercel

  //Decode query
  const aiContent = decodeURIComponent(req.query.content);

  //Object of AI request body
  const requestBody = {
    model: "gpt-4",
    messages: [{ 
      role: "user",
      content: aiContent
    }],
    temperature: 0.7 // Ensures stable responses
  };
  

  try {
    //Try verifying JWT secret. Return error if there is none.
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      //Log error
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    
    //Fetch data from API using POST
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TEMP_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    //If response is not ok, throw error
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    //Await response and put in constant
    const data = await response.json();

    //Return response in res
    res.status(200).json({ result: data.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}