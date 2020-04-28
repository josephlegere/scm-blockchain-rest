const mongoose = require('mongoose');

const MachinePartsSchema = new mongoose.Schema({
    machine: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    document: {
        name: {
            type: String
        },
        source: {
            type: String,
            required: true
        }
    },
    parts: {
        type: Array
    },
    delivery: {
        schedule: {
            type: String
        },
        location: {
            type: String
        }
    },
    manufacturer: {
        id: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now //no required needed
    }
});

module.exports = mongoose.model('MachineParts', MachinePartsSchema);