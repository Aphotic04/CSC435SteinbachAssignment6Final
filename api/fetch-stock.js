import jwt from "jsonwebtoken";
import cookie from "cookie";
import dotenv from "dotenv";

dotenv.config();

/**
 * Handles fetching stock aggregates for requested timeframe serverlessly.
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
  
  try {
    //Try verifying JWT secret. Return error if there is none.
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      //Log error
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    const apiKey = process.env.API_KEY; //Securely stored on Vercel

    //Get query data
    const ticker = req.query.ticker; //Company ticker
    const today = req.query.today; //Start of timeframe
    const tomorrow = req.query.tomorrow; //End of timeframe

    //Fetch
    const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/minute/${today}/${tomorrow}?adjusted=true&sort=asc&apiKey=${apiKey}`);

    //If response is not ok, throw error
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    //Get data
    const data = await response.json();

    //Return data
    res.status(200).json(data);
  } catch (error) {
    //Log error
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}