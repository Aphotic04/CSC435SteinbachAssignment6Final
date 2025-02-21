/*ai.js - Function to get weather recommendations from OpenAi's GPT-4.0 model
Ty Steinbach
Written:   02-07-2025
Revised:   02-08-2025
*/


export default async function handler(req, res) {
  //Setting const/var for weather data to use in query 

  const API_KEY = process.env.AI_KEY; // Securely stored on Vercel
  //Object of AI request body
  const requestBody = {
    model: "gpt-4", //AI model
    //Message to give to model
    messages: [{ 
      role: "user", //Role of who/what is providing the message
      //Message content
      content: `Provide 10 of todays hottest stocks. Respond with only the values and in JSON format of [{"ticker":"TCKR"}]` 
    }]
  };

  try {
    //Fetch data from API using POST
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
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
    res.status(200).json(data.choices[0].message.content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}