export default async function handler(req, res) {
  try {
    const apiKey = process.env.API_KEY; // Securely stored on Vercel

    // Get the ticker from query parameters, defaulting to 'A' if not provided
    const ticker = req.query.ticker || 'A';

    const response = await fetch(`https://api.polygon.io/v3/reference/tickers?search=${ticker}&active=true&limit=5&apiKey=${apiKey}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}