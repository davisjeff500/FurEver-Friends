const fs = require('fs').promises;
const router = require('express').Router();
const withAuth = require('../utils/auth');

// Helper function to read dog data from JSON file
async function getDogData() {
  const dogDataJson = await fs.readFile('dogData.json', 'utf8');
  return JSON.parse(dogDataJson);
}

// Helper function to find a dog by id from JSON data
async function findDogById(id) {
  const dogs = await getDogData();
  return dogs.find(dog => dog.id.toString() === id);
}


router.get('/', async (req, res) => {
  try {
    // Get all dogs and JOIN with user data
    const dogsData = await Dog.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const dogs = dogsData.map((dog) => dog.get({ plain: true }));

    //filter dogs array for conditions when needed
    //dogs = dogs.filter(dog => dog.age > 9)
    // Pass serialized data and session flag into template
    console.log(req.session);
    res.render('homepage.handlebars', {
      dogs,
      session: req.session,
    });

    console.log('Rendered homepage');
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dog data' });
  }
});

router.get('/alldogs', async (req, res) => {
  try {
    // Get all dogs and JOIN with user data
    const dogsData = await Dog.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const dogs = dogsData.map((dog) => dog.get({ plain: true }));
    console.log(dogs);

    // Pass serialized data and session flag into template
    res.render('allDogs.handlebars', {
      dogs, //variable we use on handlebars
      session: req.session,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dog data' });
  }
});

router.get('/youngDogs', async (req, res) => {
  try {
    // Get all dogs and JOIN with user data
    const dogsData = await Dog.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    let dogs;
    dogs = dogsData.map((dog) => dog.get({ plain: true }));

    //takes previous dogs array and filters out dogs older than age 9
    const youngDogs = dogs.filter((dog) => dog.age < 9);
    console.log(youngDogs);

    // Pass serialized data and session flag into template
    res.render('youngDogs.handlebars', {
      youngDogs, //variable we use on handlebars
      session: req.session,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load young dogs data' });
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
  try {
    if (!req.session.logged_in) {
      res.redirect('/login');
      return;
    }
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Dog }],
    });

    const user = userData.get({ plain: true });
    /// if ( userData.hasKids === true) {
    // user = userData.dogs.filter(dog => dog.kidFirendy !== true) // filters out non kid friendly dogs from dog array
    //}
    res.render('profile.handlebars', {
      user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/temporary', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Dog }],
    });

    const user = userData.get({ plain: true });
    /// if ( userData.hasKids === true) {
    // user = userData.dogs.filter(dog => dog.kidFirendy !== true) // filters out non kid friendly dogs from dog array
    //}
    if (user.seniorDog === false) {
      res.redirect('/youngDogs');
      return;
    } else {
      res.redirect('/alldogs');
      return;
    }

    res.render('profile', {
      ...user,
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
    res.render('yourInfo'); 
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
