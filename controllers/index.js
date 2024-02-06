const express = require('express');
const axios = require('axios'); // for making HTTP requests
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/dogs', async (req, res) => {
  try {
    const response = await axios.get('https://thedogapi.com./breeds');
    const dogData = response.data;

    res.status(200).json(dogData);
  } catch (error) {
    console.error('Error fetching dog data:', error);
    res.status(500).send('Error fetching dog data');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
