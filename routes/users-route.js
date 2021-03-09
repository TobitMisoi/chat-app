const express = require('express');

const { body } = require('express-validator');
const controllers = require('../controllers/users-controllers');

const router = express.Router();

router.post('/login',
    body('email')
        .isEmail(),
    body('password')
        .isLength({ min: 6, max: 20 }),
    controllers.login
);

router.post('/signup', 
    body('email').isEmail(),
    body('password').isLength({
        min: 6,
        max: 20
    }),
    body('username').isLength({
        min: 3,
        max: 12
    }),
    controllers.signup
);


module.exports = router;