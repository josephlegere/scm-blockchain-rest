const User = require('../models/User');
const _ = require('lodash');
const { registerValidation } = require('../utils/validation');

//  @desc   Add user
//  @route  POST /api/v1/users
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

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const savedUser = await user.save();

        return res.status(201).json({
            success: true,
            data: savedUser
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