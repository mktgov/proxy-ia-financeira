// 🔮 Proxy IA Financeira — Versão Final GPT Ativo
// Autor: A / A
// Função: Intermediar o Google Sheets e a API da OpenAI (via Render)

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

    // 🔐 Captura segura da variável de ambiente
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const hasKey = !!OPENAI_API_KEY;
    console.log("🔑 OPENAI_API_KEY detectada:", hasKey);

    if (!hasKey) {
      return res.status(500).json({
        erro: "OPENAI_API_KEY não configurada no servidor Render.",
      });
    }

    // ⚙️ Envio do prompt à OpenAI
    console.log("🌐 Enviando requisição à OpenAI...");

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
              "Você é um consultor financeiro humano, empático e estratégico. Gere análises breves, claras e práticas com base em dados financeiros mensais.",
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

    // 🔎 Verifica resposta da API
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erro HTTP:", response.status, errorText);
      return res
        .status(response.status)
        .json({ erro: "Falha na requisição à API da OpenAI." });
    }

    const data = await response.json();
    console.log("🧾 Retorno da OpenAI:", JSON.stringify(data, null, 2));

    if (data.error) {
      console.error("❌ Erro da OpenAI:", data.error);
      return res.status(500).json({ erro: data.error.message });
    }

    const respostaIA = data.choices?.[0]?.message?.content?.trim();
    if (!respostaIA) {
      console.error("⚠️ Nenhuma resposta válida retornada pela IA.");
      return res.status(500).json({ erro: "A IA não retornou resposta válida." });
    }

    // ✅ Retorno final
    res.send(respostaIA);
  } catch (erro) {
    console.error("💥 Erro interno:", erro);
    res.status(500).json({ erro: "Erro interno no servidor." });
  }
});

// ✅ Porta padrão Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`⚡ Proxy IA Financeira rodando publicamente na porta ${PORT}`)
);
