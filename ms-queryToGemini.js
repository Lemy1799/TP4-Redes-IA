import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const clave = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(clave);

app.use(express.json());

// Middleware JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(403); // Forbidden

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.use(authenticateJWT);

app.post("/queryAI", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const { consulta } = req.body;
    const AIconfig = "Analiza la siguiente reseña y en funcion de sus sentimientos, calificala como POSITIVO, NEGATIVO o NEUTRAL: "
    const AIconfig2 =". Además, haz un resumen de la reseña, que no tenga mas de tres oraciones, y que este redactada en forma de parrafo, sin saltos de lineas ni titulos."
    const prompt = AIconfig + consulta + AIconfig2;

    const result = await model.generateContent(prompt);
    const response = await result.response.candidates[0].content.parts[0].text;
    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "GEMINI, ALGO ANDA MAL 😢" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de CONSULTA-IA corriendo en http://localhost:${PORT}`);
});
