const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');
const { getMachines, addMachine, deleteMachine, downloadMachine } = require('../controllers/machines');

router
    .route('/')
    .get(verify, getMachines)
    .post(verify, addMachine);

router
    .route('/:id')
    .delete(deleteMachine);

router
    .route('/download/:id')
    .get(downloadMachine);

module.exports = router;