const express = require("express");
const router = express.Router();
const chatbotService = require("../services/chatbot-service");

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    
    const response = await chatbotService.generateResponse(prompt);
    
    return res.json({ response });
  } catch (error) {
    console.error("Error in chatbot route:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;