const express = require('express');
const router = express.Router();
const { User } = require('../../models');

// Route for handling the form submission
router.post('/get-started-form', async (req, res) => {
  console.log(`Form submitted: ${JSON.stringify(req.body)}`);

  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const allowSenior = req.body.allowSenior;

  try {
    const newUser = await User.create({
      name,
      username,
      email,
      password,
      allowSenior,
    });

    // router.post('/', async (req, res) => {
    //   try {
    //     const userData = await User.create(req.body);

    //     req.session.save(() => {
    //       req.session.user_id = userData.id;
    //       req.session.logged_in = true;

    //       res.status(200).json(userData);
    //     });
    //   } catch (err) {
    //     console.error(err.errors);
    //     console.error(err.message);
    //     console.error(err.stack);
    //     res.status(400).json(err);
    //   }
    // });

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;

      res.status(200).json(newUser);
    });

    //  validation error messages were causing it to crash so tried to clean that up
  } catch (err) {
    // if (err.name === 'SequelizeValidationError') {
    //   const validationErrors = err.errors.map((error) => error.message);
    //   res.status(400).json({ errors: validationErrors });
    // } else {
    console.error(err);
    res.status(500).json({ error: 'An internal server error occurred.' });
    // }
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    } else {
      console.log('valid user');
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    } else {
      console.log('valid password');
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res
        .status(200)
        .json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
