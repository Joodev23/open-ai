const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = "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";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const tone = req.body.tone || "default";

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  const cekPembuat = /siapa.+(pembuat|buat|creator|developer|programmer|pengembang)|kamu.+dibuat/i;
  if (cekPembuat.test(userMessage)) {
    return res.json({ reply: "JoseAI dibuat dan dikembangkan oleh Joocode Official." });
  }

  const tonePrompt = {
    default: "Jawab pintar, sopan, seperti ChatGPT. Bisa bantu semua hal: menjelaskan topik umum, bantu bikin kode, skrip, ide, pelajaran, dll.",
    coding: "Fokus ke pemrograman. Bantu buat, debug, dan jelasin kode HTML, CSS, JS, Python, PHP, dsb."
  };

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: `Kamu adalah JoseAI, AI assistant cerdas buatan Joocode Official. Kamu sangat pintar dan fleksibel seperti ChatGPT. Bisa bantu dalam banyak hal: menjelaskan konsep, bantu bikin HTML, CSS, JavaScript, Python, PHP, nulis artikel, bantu soal sekolah, debugging, Dan usahakan menjawab dengan bahasa yang asik dan sopan, juga menggunakan bahasa indonesia, dll. ${tonePrompt[tone] || tonePrompt.default}`
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    let aiReply = "[!] Gagal mendapatkan respon dari AI.";
    if (data && data.choices && data.choices.length > 0) {
      aiReply = data.choices[0].message.content;
    }

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("❌ Error saat panggil API:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memproses permintaan." });
  }
});

app.get("/", (req, res) => {
  res.send("✅ JoseAI Backend Aktif (v3) - Powered by Joocode Official");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`JoseAI Berjalan Pada http://localhost:${PORT}`);
});
