import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const app = express();
app.use(express.json());

app.post('/getPlaceReviews', async (req, res) => {
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