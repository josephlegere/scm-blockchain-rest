const Design = require('../models/Design');
const User = require('../models/User');
const Machine = require('../models/Machine');
const Parts = require('../models/MachineParts');
const Delivery = require('../models/Delivery');

const { createXML, readXML } = require('../utils/xmlhandler');
const { createJSON, readJSON } = require('../utils/jsonhandler');
const blockchain = require('../utils/blockchain');

const _ = require('lodash');
const Path = require('path');

//  @desc   Get all deliveries
//  @route  GET /api/v1/deliveries
//  @access Public
exports.getDeliveries = async (req, res, next) => {
}

//  @desc   Add a delivery
//  @route  POST /api/v1/deliveries
//  @access Public
exports.addDelivery = async (req, res, next) => {
    try {
        console.log(req.body)

        const delivery = req.body;
        const { _id, iat } = req.user;
        const manufacturer = await User.findOne({ _id: _id });
        const design = await Design.findOne({ machine: delivery.machine });

        let chain = await readJSON(Path.resolve(Path.dirname(__dirname), 'public/uploads/', `${design.manufacturer.id}/${design.document.split('.')[0]}.json`));
        let blockchain_container = chain.chain;
        if (blockchain_container.length !== 5) { //validate if chain is on track
            return res.status(400).json({
                success: false,
                error: 'This request has been denied!'
            });
        }

        let _record = _.cloneDeep(delivery);
        let _document = { delivery: {} };
        let filename = `${Date.now()}_delivery`;
        let filesource = `public/uploads/${manufacturer._id}/`;
        let _temp = {};// temp sorting of records
        let _document_info = {};// stores the returned info of xml file

        //building of xml file with the information
        _record.manufacturer = { name: manufacturer.name };
        _temp = _.cloneDeep(_record);
        _document.delivery = Object.assign(_document.delivery, _temp);
        _document_info = createXML(_document, filename, filesource);

        //additional information for the delivery
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

        const delivery_record = await Delivery.create(_record);
        //console.log(delivery_record)
        console.log('Delivery Requested!');

        // Then update the machine that delivery has been requested
        let machine_updated = await Machine.updateOne({ _id: delivery.machine }, { delivery: { id: delivery_record._id, status: 'pending' } });
        console.log('Machine record was updated!')

        return res.status(201).json({
            success: true,
            data: delivery_record
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

// @desc    View deliveries
// @route   VIEW /api/v1/deliveries/view/:id
// @access  Public
exports.viewDelivery = async (req, res, next) => {
    try {
        console.log(req.params)
        let { _id } = req.params;// Document ID
        const deliveries = await Delivery.findOne({ _id: _id });// Get Manufacturer id and Document Source from DB
        let id = deliveries.manufacturer.id, file = deliveries.document;

        let filedata = await readXML(Path.resolve(Path.dirname(__dirname), 'public/uploads/', `${id}/${file}`));
        let chain = await readJSON(Path.resolve(Path.dirname(__dirname), 'public/uploads/', `${id}/${file.split('.')[0]}.json`));
        chain = chain.chain;
        console.log(filedata)
        console.log(chain)

        //validate file before sending
        let chainCoin = await new blockchain();
        chainCoin.restructChain(chain);
        let resultBlock = chainCoin.blockIsValid(filedata);
        let resultChain = chainCoin.chainIsValid();

        // console.log(resultBlock)
        // console.log(resultChain)

        return res.status(200).json({
            success: (resultBlock && resultChain ? true : false),
            data: {
                chain: {
                    result: resultChain,
                    comment: (resultChain ? 'Chain is Valid.' : 'Chain has been tampered.')
                },
                document: {
                    result: resultBlock,
                    comment: (resultBlock ? 'Document is Valid.' : 'Document has been tampered.')
                },
                url: {
                    data: (resultBlock && resultChain ? `http://localhost:5000/public/uploads/${id}/${file}` : null),
                    comment: (resultBlock && resultChain ? 'Access Granted' : 'Unauthorized File, not accessible!')
                }
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}

// @desc    Update delivery
// @route   PUT /api/v1/deliverys
// @access  Public
exports.updateDelivery = async (req, res, next) => {
    try {
        const { id, machine, document, manufacturer, delivery } = req.body;
        console.log(req.body)
        const { _id, iat } = req.user;
        // const parts = await Parts.find();

        let chain = await readJSON(Path.resolve(Path.dirname(__dirname), 'public/uploads/', `${manufacturer.id}/${document.split('.')[0]}.json`));
        let blockchain_container = chain.chain;
        if (blockchain_container.length !== 4) { //validate if chain is on track
            return res.status(400).json({
                success: false,
                error: 'This request has been denied!'
            });
        }

        let _document = { invoice: {} };
        let filename = `${Date.now()}_parts_invoice`;
        let filesource = `public/uploads/${_id}/`;
        let _document_info = {};// stores the returned info of xml file

        //building of xml file with the information
        _document_info = createXML(_document, filename, filesource);

        //let parts_updated = await Parts.updateOne({ _id: id }, { invoice: { document: _document_info.source, createdAt: Date() } });
        let machine_updated = await Machine.updateOne({ _id: machine }, { parts: { id: id, status: 'accepted', document: _document_info.source, createdAt: Date() }, delivery: { schedule: delivery.schedule, location: delivery.location, status: 'pending' } });

        //secure data with blockchain
        console.log('Securing Data.....');
        let chainCoin = new blockchain();
        chainCoin.restructChain(blockchain_container);
        chainCoin.addBlock(_document_info.data);
        console.log(chainCoin);
        console.log('Storing Blockchain.....');
        _document_info = createJSON(chainCoin, filename, filesource);
        console.log('Data Secured!');

        return res.status(200).json({
            success: true,
            //count: parts.length,
            data: _document_info.source
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            error: err
        });
    }
}