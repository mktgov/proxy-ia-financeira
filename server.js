// 🔮 Proxy IA Financeira — Versão Final GPT Ativo
// Autor: A / A
// Função: intermediar o Google Sheets e a API da OpenAI

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Teste básico
app.get("/", (req, res) => {
  res.send("🚀 Proxy IA Financeira está online e pronto para análises!");
});

// ✅ Endpoint principal
app.post("/analisar", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ erro: "Campo 'prompt' é obrigatório." });
    }

    // 🔐 A chave da OpenAI é lida das variáveis de ambiente do Render
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res
        .status(500)
        .json({ erro: "OPENAI_API_KEY não configurada no servidor." });
    }

    // ⚙️ Envio do prompt à OpenAI
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
              "Você é um consultor financeiro humano, empático e estratégico. Sua missão é gerar relatórios curtos, claros e inteligentes com base em planilhas mensais de gastos.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.75,
        max_tokens: 750,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Erro da OpenAI:", data.error);
      return res.status(500).json({ erro: data.error.message });
    }

    const respostaIA = data.choices?.[0]?.message?.content?.trim();
    if (!respostaIA) {
      return res
        .status(500)
        .json({ erro: "A IA não retornou resposta válida." });
    }

    // ✅ Retorna o texto limpo
    res.json({ resposta: respostaIA });
  } catch (erro) {
    console.error("Erro interno:", erro);
    res.status(500).json({ erro: "Erro interno no servidor." });
  }
});

// ✅ Porta padrão Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`⚡ Proxy IA Financeira rodando na porta ${PORT}`)
);
