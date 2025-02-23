export default async function handler(req, res) {
  try {
    const apiKey = process.env.API_KEY; // Securely stored on Vercel

    // Get the ticker from query parameters, defaulting to 'A' if not provided
    const ticker = req.query.ticker;
    const today = req.query.today;
    const yesterday = req.query.yesterday;

    const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/minute/${yesterday}/${today}?adjusted=true&sort=asc&apiKey=${apiKey}`);

    //If response is not ok, throw error
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}