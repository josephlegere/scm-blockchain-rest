const express = require('express');
const router = express.Router();
const cors = require('cors');
const verify = require('./verifyToken');
const { getMachines, addMachine, deleteMachine } = require('../controllers/machines');

router
    .route('/')
    .get(cors(), verify, getMachines)
    .post(cors(), addMachine);

router
    .route('/:id')
    .delete(deleteMachine);

module.exports = router;