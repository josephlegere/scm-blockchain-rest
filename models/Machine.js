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
        id: {
            type: mongoose.Types.ObjectId
        },
        status: {
            type: String
        },
        document: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now //no required needed
        }
    },
    parts: {
        id: {
            type: mongoose.Types.ObjectId
        },
        status: {
            type: String
        },
        items: {
            type: Array
        },
        document: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now //no required needed
        }
    },
    delivery: {
        schedule: {
            type: String
        },
        location: {
            type: String
        },
        status: {
            type: String
        }
    },
    createdAt: {
        type: Date,
        default: Date.now //no required needed
    }
});

module.exports = mongoose.model('Machine', MachineSchema);