const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');
const cors = require('cors');
const { getParts, addParts, viewParts, updateParts } = require('../controllers/parts');

router
    .route('/')
    .get(verify, getParts)
    .post(verify, addParts)
    .put(verify, updateParts);

router
    .route('/view/:_id')
    .get(viewParts);

module.exports = router;