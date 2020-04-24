const Machine = require('../models/Machine');
const { createXML } = require('../utils/xmlhandler');
const _ = require('lodash');

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

        let _record = _.cloneDeep(req.body);
        let _document = { machine: {} };
        let filename = `${Date.now()}_machine`;
        let filesource = `uploads/${_record.customer.id}/`;
        let _temp = _.cloneDeep(_record);

        _document.machine = Object.assign(_document.machine, _temp);
        delete _document.machine.customer.id;

        let _document_info = await createXML(_document, filename, filesource);

        _record.document = _document_info;
        //console.log(_record)

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