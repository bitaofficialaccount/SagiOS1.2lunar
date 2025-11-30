import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // AI Chat route
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      // Build messages array with conversation history
      const messages: any[] = [
        {
          role: "system",
          content: "You are Sagi, a helpful voice-activated AI assistant for a smart display OS. You are friendly, concise, and helpful. Keep responses brief and conversational. If someone asks you to open an app like 'browser', 'mail', 'weather', or 'photos', acknowledge that you'll help them. Answer questions directly and naturally.",
        },
      ];

      // Add recent conversation history for context
      if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        conversationHistory.slice(-8).forEach((msg: string) => {
          const [role, ...content] = msg.split(": ");
          if (role === "user" || role === "assistant") {
            messages.push({
              role: role === "user" ? "user" : "assistant",
              content: content.join(": "),
            });
          }
        });
      }

      // Add current message
      messages.push({
        role: "user",
        content: message,
      });

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 150,
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content || "I'm not sure how to respond to that.";

      res.json({ response });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // Browser proxy route
  app.get("/api/proxy", async (req, res) => {
    try {
      const { url } = req.query;
      
      if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "URL is required" });
      }

      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          "DNT": "1",
          "Connection": "keep-alive",
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "iframe",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none"
        }
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: `Failed to fetch: ${response.statusText}` });
      }

      const contentType = response.headers.get("content-type");
      const buffer = await response.arrayBuffer();

      res.set("Content-Type", contentType || "text/html");
      res.set("X-Content-Type-Options", "nosniff");
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ error: "Failed to fetch URL" });
    }
  });

  return httpServer;
}
