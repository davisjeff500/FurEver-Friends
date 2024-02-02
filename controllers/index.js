const express = require('express');
const { Sequelize } = require('sequelize');

// Create an instance of Express
const app = express();
// Configure it to parse requests with JSON payloads.
app.use(express.json());

// Configure the Sequelize connection
const sequelize = new Sequelize('database_name', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Define your Dog model using Sequelize. In a separate file (e.g., models/dog.js), define the Dog model and export it:
// Backyard, Kids, ?

const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Dog = sequelize.define('Dog', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Dog;

// Create the necessary routes for your API. In a separate file (e.g., routes/dogs.js), define the routes and export them:

const express = require('express');
const Dog = require('../models/dog');

const router = express.Router();

// GET /dogs - Get all dogs
router.get('/', async (req, res) => {
  try {
    const dogs = await Dog.findAll();
    res.json(dogs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /dogs - Create a new dog
router.post('/', async (req, res) => {
  try {
    const { name, breed, age } = req.body;
    const dog = await Dog.create({ name, breed, age });
    res.status(201).json(dog);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

// In your index.js file, use the routes by requiring and mounting them:

const dogRoutes = require('./routes/dogs');

// Mount the dog routes
app.use('/dogs', dogRoutes);

// Start your server by running node index.js.

// Now you have a basic RESTful API for a dog shelter using Node.js and Express.js. You can test the API by making requests to http://localhost:3000/dogs. Remember to replace the database credentials in the Sequelize configuration wi
