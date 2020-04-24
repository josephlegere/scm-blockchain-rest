const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { registerValidation, loginValidation } = require('../utils/validation');

//  @desc   Add user
//  @route  POST /api/v1/users/register
//  @access Public
exports.registerUser = async (req, res) => {

    //  VALIDATE THE DATA BEFORE REGISTERING A USER
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            error: error.details[0].message
        });
    }

    //Checking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        return res.status(400).json({
            success: false,
            error: 'Email already exists!'
        });
    }

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    try {
        const savedUser = await user.save();

        return res.status(201).json({
            success: true,
            data: ({ user: user._id })
        });
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);

            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        else {
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }
}

//  @desc   Login user
//  @route  POST /api/v1/users/login
//  @access Public
exports.loginUser = async (req, res) => {

    //  VALIDATE THE CREDENTIALS BEFORE LOGGING IN A USER
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            error: error.details[0].message
        });
    }

    //Checking if the user is registered
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({
            success: false,
            error: 'Email doesn\'t exist!'
        });
    }

    //Check if Password is Correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
        return res.status(400).json({
            success: false,
            error: 'Invalid Password!'
        });
    }

    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
}