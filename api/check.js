// This is your new backend function: api/check.js

export default async function handler(request, response) {
  // 1. Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Get the API key from environment variables (this is secure)
  const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
  const HUGGING_FACE_URL = "https://api-inference.huggingface.co/models/abdulmatinomotoso/English_Grammar_Checker";

  if (!HUGGING_FACE_API_KEY) {
     return response.status(500).json({ error: "API key is not configured." });
  }
  
  // 3. Get the text from the client's request
  const { inputs } = request.body;

  if (!inputs) {
    return response.status(400).json({ error: 'No text provided.' });
  }

  // 4. Make the "secret" call to Hugging Face
  try {
    const hfResponse = await fetch(
      HUGGING_FACE_URL,
      {
        headers: {
          "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: inputs }),
      }
    );

    if (!hfResponse.ok) {
      const errorBody = await hfResponse.json();
      // Forward the Hugging Face error (e.g., "model is loading")
      return response.status(hfResponse.status).json(errorBody);
    }

    const hfResult = await hfResponse.json();
    
    // 5. Send the result back to your client
    return response.status(200).json(hfResult);

  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'An internal server error occurred.' });
  }
}