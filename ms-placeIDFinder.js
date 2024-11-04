import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
app.use(express.json());

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

app.post('/getPlaceID', (req, res) => {
    try {
      let textQuery = req.body;
  
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://places.googleapis.com/v1/places:searchText',
        headers: { 
          'X-Goog-Api-Key': process.env.MAPS_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.formattedAddress,places.displayName.text', 
          'Content-Type': 'application/json'
        },
        data: textQuery
      };
  
      axios.request(config)
        .then((response) => {
          res.json(response.data); 
        })
        .catch((error) => {
          console.error("Error en la solicitud de axios:", error);
          res.status(500).json({ error: 'ID FINDER, ALGO ANDA MAL 😢' });
        });
    } catch (error) {
      console.error("Error en el servidor:", error);
      res.status(500).json({ error: 'ID FINDER, ALGO ANDA MAL 😢' });
    }
  });

app.listen(process.env.PORT2, () => {
  console.log(`Servidor PlaceID Finder en http://localhost:${process.env.PORT2}`);
});


