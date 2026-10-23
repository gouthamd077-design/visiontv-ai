import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/ask", async (req, res) => {
  try {
    const question = req.body.question;

    if (!question) {
      return res.status(400).json({ error: "Please enter a question." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are VisionTV AI, a friendly smart-TV assistant.
Help users discover movies, explain shows, and recommend content.
Keep answers short and conversational.

User: ${question}`,
    });

    res.json({ answer: response.text });
  } catch (error) {
    console.error("Gemini error:", error.message);
    res.status(500).json({
      error: "AI request failed. Check your API key, model access, and billing requirements.",
    });
  }
});

app.listen(3001, () => {
  console.log("VisionTV AI backend running at http://localhost:3001");
});