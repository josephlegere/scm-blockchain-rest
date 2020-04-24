const express = require('express');
const router = express.Router();
const cors = require('cors');
const { registerUser } = require('../controllers/auth');

router
    .post(cors(), registerUser);

module.exports = router;