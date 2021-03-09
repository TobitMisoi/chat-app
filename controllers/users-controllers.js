const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { AvatarGenerator } = require('random-avatar-generator');

const generator = new AvatarGenerator();

const User = require('../models/user');
const { createToken } = require('../utils/token');


// Findng user with similar email in the database
const findUserWithEmail = async email => {
    // assigning user
    let user;
    try {
        user = await User.findOne({ email });
    } catch (err) {
        console.log('[ERROR][E]')
        return next(new Error('[ERROR][USERS] could not find user with email ', +err))
    }
    return user;
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    if(email === "") {
        res.json({
            message: 'Field required'
        })
    }
    if(password === "") {
        res.json({
            message: 'Field required'
        })
    }

    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({
            message: 'Access denied, incorrect Email.',
            access: false
        });
        return next;
    }

    // Finding user with the entered email
    const user = await findUserWithEmail(email);
    if (!user) {
        res.json({
            message: 'Access denied, incorrect Email',
            access: false
        });
        return next;
    }

    // Decrypting password and checking if valid
    const decryptedPassword = await bcrypt.compare(password, user.password);
    if (!decryptedPassword) {
        res.json({
            message: 'Access denied, incorrect password',
            access: false
        });
        return next;
    }

    // Creating a token
    let token = await createToken(user.id)

    // Else will send response
    res.json({
        message: '[USER][LOGIN] Access granted',
        access: true,
        user: { id: user.id, username: user.username, image: user.image, token }
    });
}

const signup = async (req, res, next) => {
    const { email, password, username } = req.body;

    const defaultImage = generator.generateRandomAvatar();

    console.log('gkcg');
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        res.json({
            message: 'Access denied, invalid Entries',
            access: false
        })
        return next;
    }

    // Check if user with this email already exists in the database
    const existingUser = await findUserWithEmail(email);
    if (existingUser) {
        res.json({
            message: 'Access denied, email already used',
            access: false
        })
        return next;
    }

    // Encrypting password
    const hashedPass = await bcrypt.hash(password, 8);

    // Creating new user
    const newUser = new User({
        email,
        username,
        password: hashedPass,
        image: defaultImage
    });
    try {
        await newUser.save();

    } catch (err) {
        return next(new Error('[ERROR][USERS] Could not save user in the DB: ' + err));
    }

    // Create token
    let token = createToken(newUser.id);

    // Send response
    res.json({
        message: '[USER][SIGNUP] Access Granted',
        access: true,
        user: {
            id: newUser.id,
            username: newUser.username,
            image: newUser.image,
            token
        }
    });
};

exports.login = login;
exports.signup = signup;