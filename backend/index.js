const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/api/live-matches', async (req, res) => {
  try {
    const response = await axios.get('https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live', {
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'API fetch failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}`);
});
