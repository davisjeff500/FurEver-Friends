const fs = require('fs').promises;
const router = require('express').Router();
const withAuth = require('../utils/auth');
const { Dog, User } = require('../models');
const { Op, json } = require('sequelize');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'seeds', 'dogData.json');


router.get('/', async (req, res) => {
  try {
    console.log(req.session);
    res.render('homepage.handlebars', {
      session: req.session,
    });

    console.log('Rendered homepage');
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dog data' });
  }
});


// Route handles rendering dogs based on user's preferences


router.get('/dogs', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    const dogs = JSON.parse(data);
    res.render('dogs', { dogs }); 
  } catch (err) {
    console.error('Error loading dog data:', err);
    res.status(500).send({ error: 'Failed to load dog data' });
  }
});

//FROM EARLIER EVANS SECTION FILTERING BY AGE-----
router.get('/dogs', async (req, res) => {
  try {
    const allowSenior = req.session?.allowSenior;

    // Read the dog data from the JSON file
    const data = await fs.readFile(dataPath, 'utf8');
    let dogs = JSON.parse(data);

    // filter senior dogs if need be
    if (req.session.logged_in && !allowSenior) {
      dogs = dogs.filter(dog => dog.age < 9);
    }

    // Render the page with the dogs information
    res.render('dogs', { 
      dogs, 
      session: req.session
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send({ error: 'Failed to load dog data' });
  }
});

router.get('/dog/:id', async (req, res) => {
  try {
    const dogData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const dog = dogData.get({ plain: true });

    res.render('dog.handlebars', {
      ...dog,
      session: req.session,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
//if user is not logged in they are directed to login page
router.get('/profile', withAuth, async (req, res) => {
  console.log(req.session);
  try {
    if (!req.session.logged_in) {
      res.redirect('/login');
      return;
    }
    // Find the logged in user based on the session ID
  const userData = await User.findByPk(req.session.user_id, {
    attributes: { exclude: ['password'] },
   
  });
  if (!userData) {
    // user data is not found sends error
    res.status(404).json({ message: "User not found" });
    return;
  }

    const user = userData.get({ plain: true });
    res.render('profile.handlebars', {
      user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

// Added route for "Get Started" page to render the form
router.get('/getStarted', async (req, res) => {
  try {
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    }

    res.render('yourInfo');
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
