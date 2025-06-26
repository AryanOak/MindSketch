const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const HF_API = process.env.HF_API_KEY;
const HF_URL = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev';

app.post('/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      HF_URL,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API}`,
          Accept: 'image/png',
        },
        responseType: 'arraybuffer',
      }
    );

    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    res.json({ image: `data:image/png;base64,${base64}` });

  } catch (err) {
    console.error('Error generating image:', err.response?.status, err.response?.data?.toString());
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
