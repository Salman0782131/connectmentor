const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();   // 🔥 THIS LINE MUST EXIST

app.use(cors());
app.use(express.json());

/* TEST ROUTE */
app.get('/', (req, res) => {
  res.send('Backend Running 🚀');
});

/* CHAT ROUTE */
app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    // 🔥 Validate input
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ reply: "Invalid messages format" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "MentorConnect"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: messages
      })
    });

    const data = await response.json();

    // 🔥 DEBUG (IMPORTANT)
    console.log("OPENROUTER RESPONSE:", data);

    // 🔥 Handle API errors
    if (data.error) {
      return res.status(500).json({
        reply: data.error.message || "API Error"
      });
    }

    res.json({
      reply: data?.choices?.[0]?.message?.content || "No response"
    });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.status(500).json({ reply: "Server error" });
  }
});

/* START SERVER */
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});