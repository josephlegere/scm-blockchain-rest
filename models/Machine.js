const mongoose = require('mongoose');

const MachineSchema = new mongoose.Schema({
    machine_item: {
        type: String,
        trim: true,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    notes: {
        type: String
    },
    customer: {
        id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        }
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
    createdAt: {
        type: Date,
        default: Date.now //no required needed
    }
});

module.exports = mongoose.model('Machine', MachineSchema);