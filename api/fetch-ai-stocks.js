/*ai.js - Function to get weather recommendations from OpenAi's GPT-4.0 model
Ty Steinbach
Written:   02-07-2025
Revised:   02-08-2025
*/

export default async function handler(req, res) {
  //Setting const/var for weather data to use in query 

  const TEMP_KEY = process.env.AI_KEY; // Securely stored on Vercel
  //Object of AI request body
  const requestBody = {
    model: "gpt-4",
    messages: [{ 
      role: "user",
      content: `Can you provide me with some of the top companies with stocks?` 
    }],
    temperature: 0.7 // Ensures stable responses
  };
  

  try {
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