const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');
const cors = require('cors');
const { getDeliveries, addDelivery, viewDelivery, updateDelivery } = require('../controllers/delivery');

router
    .route('/')
    .get(verify, getDeliveries)
    .post(verify, addDelivery)
    .put(verify, updateDelivery);

router
    .route('/view/:_id')
    .get(viewDelivery);

module.exports = router;