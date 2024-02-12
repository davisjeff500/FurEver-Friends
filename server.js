require('dotenv').config();

const Sequelize = require('sequelize');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const cors = require('cors');
const routes = require('./controllers');


const sequelize = require('./config/connection.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hbs = exphbs({
  extname: '.handlebars', // extension name
  defaultLayout: 'main', // default layout
  layoutsDir: path.join(__dirname, 'views/layouts'), //layouts directory
  partialsDir: path.join(__dirname, 'views/partials'), // partials directory
});

// Register `hbs.engine` with the Express app
app.engine('handlebars', hbs);
app.set('view engine', 'handlebars');

// Log every request
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  res.locals.session = req.session; // Add session data to all templates
  next();
});

// Set up CORS
app.use(
  cors({
    origin: 'http://127.0.0.1:5502', // need to change link
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Serve static files from the 'public' directory - changed this because the java wasnt loading
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  if (req.path.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }
  next();
});

// Update your session configuration
app.use(session({
  secret: process.env.SESSION_SECRET, // Set a session secret in your .env file
  store: new SequelizeStore({
    db: sequelize,
  }),
  resave: false,
  saveUninitialized: false, 
  cookie: {
    secure: false === 'production', 
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(routes); 

const PORT = process.env.PORT || 5502;
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected.');
    return sequelize.sync({ force: false });
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
  })
  .catch((err) => console.error('Unable to connect to the database:', err));