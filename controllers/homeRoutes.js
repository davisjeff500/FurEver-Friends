const router = require('express').Router();
const { Dog, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
try {
    // Get all dogs and JOIN with user data
    const dogsData = await Project.findAll({
    include: [
        {
        model: User,
        attributes: ['name'],
        },
    ],
    });

    // Serialize data so the template can read it
    const dogs = dogsData.map((project) => Dog.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage.handlebars', { 
    dogs, 
    logged_in: req.session.logged_in 
    });
} catch (err) {
    res.status(500).json(err);
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
    logged_in: req.session.logged_in
    });
} catch (err) {
    res.status(500).json(err);
}
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
    attributes: { exclude: ['password'] },
    include: [{ model: Project }],
    });
    let user;
    //const user = userData.get({ plain: true });
    /// if ( userData.hasKids === true) {
     // user = userData.dogs.filter(dog => dog.kidFirendy !== true) // filters out non kid friendly dogs from dog array
    //}


    res.render('profile', {
    ...user,
    logged_in: true
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

module.exports = router;