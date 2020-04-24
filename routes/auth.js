const express = require('express');
const router = express.Router();
const cors = require('cors');
const { registerUser } = require('../controllers/auth');

router
    .route('/register')
    .post(cors(), registerUser);

module.exports = router;