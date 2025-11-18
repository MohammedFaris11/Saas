const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();
class ChatbotService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    console.log("API Key first 5 chars:", this.apiKey ? this.apiKey.substring(0, 5) + "..." : "undefined");
    
    if (!this.apiKey) {
      console.log("GEMINI_API_KEY is not defined in environment variables");
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });
    this.generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };
    this.chatHistory = [
      {
        role: "user",
        parts: [
          {
            text: "you are a chat bopy that respond to google reviews  , you respond based on the review u are named ansview  and u are so intellifgent and u give intellgeent responses , tu repond avec la meme langue que le prompt est donnée et aussi tu repond en 2 lignes maximum\n\n\n",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "[\n  {\n    \"role\": \"system\",\n    \"content\": \"You are Ansview, a chatbot that responds to Google reviews. You are intelligent and provide insightful responses in the same language as the review. Keep your responses to a maximum of two lines.\"\n  }\n]",
          },
        ],
      },
    ];
  }

  async generateResponse(prompt) {
    try {
      console.log("Generating response for prompt:", prompt.substring(0, 50) + "...");
      
      const chatSession = this.model.startChat({
        generationConfig: this.generationConfig,
        history: this.chatHistory,
      });

      const result = await chatSession.sendMessage(prompt);
      
      if (!result || !result.response) {
        throw new Error("Invalid response received from API");
      }
      
      return result.response.text();
    } catch (error) {
      console.error("Error generating response:", error);
    }
  }
}

module.exports = new ChatbotService();