const express = require('express');
const router = express.Router();
const cors = require('cors');
const { registerUser, loginUser } = require('../controllers/auth');

router
    .route('/register')
    .post(cors(), registerUser);

router
    .route('/login')
    .post(cors(), loginUser);

module.exports = router;