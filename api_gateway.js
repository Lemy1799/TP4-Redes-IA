import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
app.use(express.json());

//Endpoint generacion de token
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    if (username === 'Lemy' && password === 'e170999l') {
      // Si las credenciales son correctas, genera el token
      const payload = { username };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Expiración de 1 hora
  
      res.json({ token });
    } else {
      // Si las credenciales no son válidas, devuelve un error
      res.status(403).json({ error: 'Credenciales inválidas' });
    }
  });

// Middleware JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.sendStatus(403);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

// Ruta para ms-placeIDFinder
app.post('/api/getPlaceID', authenticateJWT, async (req, res) => {
  try {
    const response = await axios.post(`http://localhost:${process.env.PORT2}/getPlaceID`, req.body, {
        headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error en el servicio PlaceID Finder:", error.message);
    res.status(500).json({ error: 'Error en el servicio PlaceID Finder' });
  }
});

// Ruta para ms-getReviewsByID
app.post('/api/getPlaceReviews', authenticateJWT, async (req, res) => {
  try {
    const response = await axios.post(`http://localhost:${process.env.PORT3}/getPlaceReviews`, req.body, {
        headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error en el servicio Get Reviews By ID:", error.message);
    res.status(500).json({ error: 'Error en el servicio Get Reviews By ID' });
  }
});

// Ruta para ms-queryToGemini
app.post('/api/queryAI', authenticateJWT, async (req, res) => {
  try {
    const response = await axios.post(`http://localhost:${process.env.PORT}/queryAI`, req.body, {
        headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error en el servicio Query to Gemini:", error.message);
    res.status(500).json({ error: 'Error en el servicio Query to Gemini' });
  }
});

app.listen(process.env.PORT4, () => {
  console.log(`API Gateway corriendo en http://localhost:${process.env.PORT4}`);
});