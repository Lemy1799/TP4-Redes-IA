import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
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

app.post('/getPlaceReviews', authenticateJWT, async (req, res) => {
  const { placeId } = req.body;

  if (!placeId) {
    return res.status(400).json({ error: 'El campo placeId es requerido' });
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`, {
        params: {
          place_id: placeId,
          fields: 'reviews',
          language: 'es',
          key: process.env.MAPS_API_KEY
        }
      }
    );

    //LIMPIAMOS LA RESPUESTA
    const filteredReviews = (response.data.result.reviews || []).map(review => ({
        author_name: review.author_name,
        rating: review.rating,
        relative_time_description: review.relative_time_description,
        text: review.text
      }));
  
      res.json(filteredReviews);
  } catch (error) {
    console.error("Error al obtener las reseñas:", error);
    res.status(500).json({ error: 'Error al obtener las reseñas del lugar' });
  }
});

app.listen(process.env.PORT3, () => {
  console.log(`Servidor PlaceID Finder en http://localhost:${process.env.PORT3}`);
});