import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ Proxy IA Financeira ativo e operacional!");
});

app.post("/analisar", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ erro: "Campo 'prompt' é obrigatório." });
    }

    const respostaIA = `💡 Análise automática: com base no seu pedido — "${prompt}" — recomendo revisar seus gastos com lazer e alimentação fora de casa.`;
    res.json({ resposta: respostaIA });
  } catch (erro) {
    console.error("Erro interno:", erro);
    res.status(500).json({ erro: "Erro interno no servidor." });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Proxy IA Financeira rodando publicamente na porta ${PORT}`),
);
