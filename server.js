// 🔮 Proxy IA Financeira - Versão Final (Render + OpenAI)
// Autor: A / A
// Função: conectar Google Sheets ao modelo GPT via proxy seguro

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Rota básica para teste
app.get("/", (req, res) => {
  res.send("🚀 Proxy IA Financeira ativo e operacional!");
});

// ✅ Rota principal: recebe o prompt da planilha e chama a OpenAI
app.post("/analisar", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ erro: "Campo 'prompt' é obrigatório." });
    }

    // 🔐 Chave da OpenAI (defina no Render como variável de ambiente)
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    // ⚙️ Chamada à API da OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Você é um consultor financeiro pessoal carismático que cria relatórios curtos, humanos e úteis com base em planilhas mensais.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 700,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Erro da OpenAI:", data.error);
      return res.status(500).json({ erro: data.error.message });
    }

    const respostaIA = data.choices?.[0]?.message?.content?.trim();
    if (!respostaIA) {
      return res.status(500).json({ erro: "A IA não retornou resposta válida." });
    }

    res.json({ resposta: respostaIA });
  } catch (erro) {
    console.error("Erro interno no servidor:", erro);
    res.status(500).json({ erro: "Erro interno no servidor." });
  }
});

// ✅ Porta padrão Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`⚡ Proxy IA Financeira rodando publicamente na porta ${PORT}`);
});
