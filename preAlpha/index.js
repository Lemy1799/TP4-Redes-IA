/* 
  ATENCION, ESTE CODIGO FUE DESCARTADO,
  SOLO ES EL FRONT QUE NO LLEGUÉ A IMPLEMENTAR
*/

import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Sirve archivos estáticos, como CSS
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Place Searches</title>

        <script>
          const process = { env: {} };
          process.env.GOOGLE_MAPS_API_KEY =
            "AIzaSyCWoj88W-MAhkgJqWQSk9Dngt1u8uQeCcQ";
        </script>

        <link rel="stylesheet" type="text/css" href="./style.css" />
        <script type="module" src="./index.js"></script>
      </head>

      <body>
        <div id="map"></div>

        <script
          src="https://maps.googleapis.com/maps/api/js?key=${process.env.process.env.MAPS_API_KEY}&callback=initMap&libraries=places&v=weekly"
          defer
        ></script>
      </body>
    </html>
  `);
});

app.listen(PORTFRONT, () => {
  console.log(`Servidor en http://localhost:${PORTFRONT}`);
});