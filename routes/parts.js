const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');
const cors = require('cors');
const { getParts, addParts, viewParts } = require('../controllers/parts');

router
    .route('/')
    .get(verify, getParts)
    .post(verify, addParts);

router
    .route('/view/:_id')
    .get(viewParts);

module.exports = router;