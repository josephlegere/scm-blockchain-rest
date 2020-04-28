const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');
const cors = require('cors');
const { getDesigns, addDesign, viewDesign } = require('../controllers/designs');

router
    .route('/')
    .get(verify, getDesigns)
    .post(verify, addDesign, cors());

router
    .route('/view/:_id')
    .get(viewDesign);

module.exports = router;