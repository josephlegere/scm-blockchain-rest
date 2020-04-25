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
            type: mongoose.Types.ObjectId,
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
    design: {
        design_item: {
            type: String
        }
    },
    parts: {
        type: Array
    },
    delivery: {
        schedule: {
            type: String
        }
    },
    createdAt: {
        type: Date,
        default: Date.now //no required needed
    }
});

module.exports = mongoose.model('Machine', MachineSchema);