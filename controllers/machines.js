const Machine = require('../models/Machine');
const User = require('../models/User');

const { createXML } = require('../utils/xmlhandler');
const { createJSON } = require('../utils/jsonhandler');
const blockchain = require('../utils/blockchain');

const _ = require('lodash');
const Path = require('path');

//  @desc   Get all machines
//  @route  GET /api/v1/machines
//  @access Public
exports.getMachines = async (req, res, next) => {
    try {
        const machines = await Machine.find();

        return res.status(200).json({
            success: true,
            count: machines.length,
            data: machines
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}

//  @desc   Add machine
//  @route  POST /api/v1/machines
//  @access Public
exports.addMachine = async (req, res, next) => {

    try {
        const { machine_item, quantity } = req.body;
        const { _id, iat } = req.user;
        const customer = await User.findOne({ _id: _id });

        let _record = _.cloneDeep(req.body);
        let _document = { machine: {} };
        let filename = `${Date.now()}_machine`;
        let filesource = `public/uploads/${_id}/`;
        let _temp = {};// temp sotring of records
        let _document_info = {};// stores the returned info of xml file
        let blockchain_container = [];// <-- THIS INITIALIZE THE BLOCKCHAIN

        //building of xml file with the information
        _record.customer = { name: customer.name };
        _temp = _.cloneDeep(_record);
        _document.machine = Object.assign(_document.machine, _temp);
        _document_info = await createXML(_document, filename, filesource);

        //additional information for the machine(prototype) that is being built
        _record.document = { source: _document_info.source };
        _record.customer.id = _id;
        _record.design = {};
        _record.parts = [];
        _record.delivery = {};
        console.log(_record)

        //secure data with blockchain
        console.log('Securing Data.....');
        let chainCoin = await new blockchain();
        chainCoin.restructChain(blockchain_container);
        chainCoin.addBlock(_document_info.data);
        console.log(chainCoin);
        console.log('Storing Blockchain.....');
        _document_info = await createJSON(chainCoin, filename, filesource);
        console.log('Data Secured!');

        const machine = await Machine.create(_record);
        console.log('Machine Ordered!');

        return res.status(201).json({
            success: true,
            data: machine
        });
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            console.log(messages)

            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        else {
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            });
        }
    }
}

// @desc    Delete machine
// @route   DELETE /api/v1/machines/:id
// @access  Public
exports.deleteMachine = async (req, res, next) => {
    try {
        const machine = await Machine.findById(req.params.id);

        if (!machine) {
            return res.status(404).json({
                success: false,
                error: 'No machine found'
            });
        }

        let _machine = machine;
        await machine.remove();

        return res.status(200).json({
            success: true,
            data: _machine
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}

// @desc    Download machine
// @route   DOWNLOAD /api/v1/machines/download/:id
// @access  Public
exports.downloadMachine = async (req, res, next) => {
    console.log(req.params)
    const path = Path.resolve(Path.dirname(__dirname), 'public/uploads/', '1/1587664294406_machine.xml');
    const file = `${path}`;
    res.download(file); // Set disposition and send it.
}