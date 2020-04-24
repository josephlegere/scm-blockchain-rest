const User = require('../models/User');
const _ = require('lodash');

//  @desc   Add user
//  @route  POST /api/v1/users
//  @access Public
exports.registerUser = async (req, res) => {
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