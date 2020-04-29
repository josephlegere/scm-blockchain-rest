const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');
const { getDesigns, addDesign, viewDesign, updateDesigns } = require('../controllers/designs');

router
    .route('/')
    .get(verify, getDesigns)
    .post(verify, addDesign)
    .put(verify, updateDesigns);

router
    .route('/view/:_id')
    .get(viewDesign);

module.exports = router;