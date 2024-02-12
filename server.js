require('dotenv').config();

// const mysql = require('mysql'); commented out
const Sequelize = require('sequelize');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const cors = require('cors');
const routes = require('./controllers');

const sequelize = require('./config/connection.js');
// const { sess } = require('./models/session'); commented out

const app = express();

// app.use(session(sess)); commented out

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hbs = exphbs({
  helpers: helpers,
  extname: '.handlebars',
  defaultLayout: 'main', // default layout
  layoutsDir: path.join(__dirname, 'views/layouts'), // layouts directory
  partialsDir: path.join(__dirname, 'views/partials'), // partials directory for navbar
});

// Register `hbs.engine` with the Express app
app.engine('handlebars', hbs);
app.set('view engine', 'handlebars');

// Log every request
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});

// Set up CORS
app.use(
  cors({
    origin: 'http://127.0.0.1:5502', // need to put the link of the actual heroku app here
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Serve static files from the 'public' directory (for images and CSS)
app.use(
  express.static('public', {
    setHeaders: (res, path) => {
      if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    },
  })
);

// Update session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Set a session secret in your .env file - this needs to be done and match a password you set in the Heroku website @Jeff
    store: new SequelizeStore({
      db: sequelize,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(routes);

// Please use the homeRoutes.js file to render handlebars views. This file should only be used to set up the server and middleware.
// Duplicating that code here will cause issues with the app.
// I will leave this here in case someone needs this code, but it should not be active in this file, and should be removed if it is not needed.


// Define a route for the root path to render the 'homepage' view
// app.get('/', (req, res) => {
//   res.render('homepage', { title: 'Fur-Ever Friends' });
// });

// Include your routes
// const userRoutes = require('./controllers/api/userRoutes');
// app.use('/api/users', userRoutes);

// const viewRoutes = require('./controllers/views');

// Define routes
// app.use('/', viewRoutes);

const PORT = process.env.PORT || 3001;
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected.');
    // force: false is a safer option to avoid losing data
    return sequelize.sync({ force: false });
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
  })
  .catch((err) => console.error('Unable to connect to the database:', err));




// Set up Handlebars.js engine with custom helpers - commented all this out but kept it in case we need it later

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));


// // Allow POST method for /api/users endpoint
// app.use(
//   '/api/users',
//   (req, res, next) => {
//     if (req.method == 'POST' || req.method == 'OPTIONS') {
//       next(); // Allow POST and OPTIONS requests
//     } else {
//       res.status(405).send('Method Not Allowed'); // Reject other methods
//     }
//   },
//   userRoutes
// );

// app.use('/', viewRoutes);

// sequelize
//   .authenticate()
//   .then(() => console.log('Database connected.'))
//   .catch((err) => console.error('Unable to connect to the database:', err));

// // force false in production
// sequelize.sync({ force: process.env.NODE_ENV !== 'production' }).then(() => {
//   app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
// });
