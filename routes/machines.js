const express = require('express');
const router = express.Router();
const cors = require('cors');
const { getMachines, addMachine, deleteMachine } = require('../controllers/machines');

router
    .route('/')
    .get(cors(), getMachines)
    .post(cors(), addMachine);

router
    .route('/:id')
    .delete(deleteMachine);

module.exports = router;