// session.js

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const Sequelize = require('sequelize');

const sequelize = require('../config/connection');

// Define the Session model
const Session = sequelize.define('Session', {
  sid: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  expires: Sequelize.DATE,
  data: Sequelize.STRING(50000),
});

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// Sync the Session model with the database
Session.sync();

module.exports = {
  sess: sess,
  Session: Session,
};
