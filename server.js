const session = require('express-session');
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');
// const { sess } = require('./models/session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 5501;

const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};
// Use the session middleware
app.use(session(sess));

const cors = require('cors');
app.use(cors());



// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// const userRoutes = require('./controllers/api/userRoutes.js');
// const viewRoutes = require('./controllers/views');
// app.use('/', viewRoutes);

// app.use('/api/users', userRoutes); // adjusted route mounting

// sequelize
//   .authenticate()
//   .then(() => console.log('Database connected.'))
//   .catch((err) => console.error('Unable to connect to the database:', err));

  //connects to viewRoutes and apiRoutes in controllers which dictate handlebars and api calls
app.use(require("./controllers"))
// force false in production
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
