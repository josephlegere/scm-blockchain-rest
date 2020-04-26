const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');
const { getMachines, addMachine, deleteMachine, downloadMachine, viewMachine } = require('../controllers/machines');

router
    .route('/')
    .get(verify, getMachines)
    .post(verify, addMachine);

router
    .route('/:id')
    .delete(deleteMachine);

router
    .route('/download/:id/:file')
    .get(downloadMachine);

router
    .route('/view/:id/:file')
    .get(viewMachine);

module.exports = router;