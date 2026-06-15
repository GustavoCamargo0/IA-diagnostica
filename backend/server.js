import express from "express";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/perguntar", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res
      .status(400)
      .json({
        error: 'O campo "prompt" é obrigatório no corpo da requisição.',
      });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
    });

    return res.json({
      sucesso: true,
      resposta: response.text,
    });
  } catch (error) {
    console.error("Erro ao se comunicar com o Gemini:", error);
    return res.status(500).json({
      error: "Erro interno ao processar a requisição com a IA.",
    });
  }
});

app.post("/diagnosticar", async (req, res) => {
  const { equipamento, sintomas } = req.body;

  if (!equipamento || !sintomas) {
    return res.status(400).json({
      error: "equipamento e sintomas são obrigatórios",
    });
  }

  const prompt = `
Você é um Engenheiro de Manutenção Sênior Industrial.

Equipamento: ${equipamento}
Sintomas: ${sintomas}

Siga rigorosamente:
- Segurança primeiro (LOTO quando necessário)
- Diagnóstico visual antes de qualquer intervenção
- Hipóteses por probabilidade
- Sem invenções técnicas

Responda como se fosse um Engenheiro de Manutenção Sênior.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text || "";

    return res.json({
      sucesso: true,
      resposta: text,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao processar diagnóstico",
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
