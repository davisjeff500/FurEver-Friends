const router = require('express').Router();
require('dotenv').config();
const cors = require('cors');

router.use(cors());

router.get('/:breed', (req, res) => {
  const reqData = req.params.breed;

  if (!reqData) {
    return res
      .status(400)
      .json({ ERROR: 'Please provide a dog breed for your query' });
  }

  // req should be formatted as follows:
  // {
  //     "breed": "french bulldog"
  // }

  // Check if the request data contains a space
  const hasSpace = reqData.includes(' ');

  // Initialize the breed variable
  let breed = reqData;

  // If the request data contains a space, replace it with %20
  if (hasSpace) {
    breed = reqData.split(' ').join('%20');
  }

  const url = `https://api.thedogapi.com/v1/breeds/search?q=${breed}`;

  // Fetch the data
  fetch(url, {
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.API_KEY,
      'Allow-Access-Control-Origin': '*',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Check if the data is empty
      if (!data.length) {
        return res.status(404).json({ ERROR: 'No results found' });
      }

      const dog = data[0];
      // Create a new object
      const dogData = {
        weight: dog.weight.imperial,
        height: dog.height.imperial,
        breed: dog.name,
        life_span: dog.life_span,
        temperament: dog.temperament,
        image: dog.image.url,
      };
      // Send the new object as a json response
      res.json(dogData);
    })
    .catch((error) => {
      // Handle any errors here
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

module.exports = router;
