import axios from "axios";
// const apiKey =  process.env.apiKey;
const apiKey =  process.env.apiKey;


const getGeminiResponse  = async (message) =>{
    try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      
      {
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
      },
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.log(error.response?.status);
  console.log(error.response?.data);
  }
}

export default getGeminiResponse;

