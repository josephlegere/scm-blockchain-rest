const Design = require('../models/Design');
const User = require('../models/User');
const Machine = require('../models/Machine');

const { createXML, readXML } = require('../utils/xmlhandler');
const { createJSON, readJSON } = require('../utils/jsonhandler');
const blockchain = require('../utils/blockchain');

const _ = require('lodash');
const Path = require('path');

//  @desc   Get all designs
//  @route  GET /api/v1/designs
//  @access Public
exports.getDesigns = async (req, res, next) => {
}

//  @desc   Add design
//  @route  POST /api/v1/designs
//  @access Public
exports.addDesign = async (req, res, next) => {
    try {
        console.log(req.body)

        const design = req.body;
        const { _id, iat } = req.user;
        const manufacturer = await User.findOne({ _id: _id });
        const machine = await Machine.findOne({ _id: design.machine });

        let chain = await readJSON(Path.resolve(Path.dirname(__dirname), 'public/uploads/', `${machine.customer.id}/${machine.document.source.split('.')[0]}.json`));
        let blockchain_container = chain.chain;
        if (!blockchain_container.length === 1) { //validate if chain is on track
            return res.status(400).json({
                success: false,
                error: 'This request has been denied!'
            });
        }

        let _record = _.cloneDeep(design);
        let _document = { design: {} };
        let filename = `${Date.now()}_design`;
        let filesource = `public/uploads/${machine.customer.id}/`;
        let _temp = {};// temp sorting of records
        let _document_info = {};// stores the returned info of xml file

        //building of xml file with the information
        _record.manufacturer = { name: manufacturer.name };
        _temp = _.cloneDeep(_record);
        _document.design = Object.assign(_document.design, _temp);
        _document_info = createXML(_document, filename, filesource);

        //additional information for the design
        _record.document = _document_info.source;
        _record.manufacturer.id = _id;
        console.log(_record);

        //secure data with blockchain
        console.log('Securing Data.....');
        let chainCoin = await new blockchain();
        chainCoin.restructChain(blockchain_container);
        chainCoin.addBlock(_document_info.data);
        console.log(chainCoin);
        console.log('Storing Blockchain.....');
        _document_info = createJSON(chainCoin, filename, filesource);
        console.log('Data Secured!');

        const design_record = await Design.create(_record);
        console.log('Design Requested!');

        // Then update the machine that design has been requested
        let machine_updated = await Machine.updateOne({ _id: design.machine }, { design: { status: 'pending' }});
        console.log('Machine record was updated!')

        return res.status(201).json({
            success: true,
            data: design_record
        });
    } catch (err) {
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

// @desc    View design
// @route   VIEW /api/v1/designs/view/:id
// @access  Public
exports.viewDesign = async (req, res, next) => {
}