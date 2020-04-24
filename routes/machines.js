const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');
const { getMachines, addMachine, deleteMachine } = require('../controllers/machines');

router
    .route('/')
    .get(verify, getMachines)
    .post(addMachine);

router
    .route('/:id')
    .delete(deleteMachine);

module.exports = router;