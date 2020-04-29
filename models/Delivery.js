const mongoose = require('mongoose');

const MachineSchema = new mongoose.Schema({
    package: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    package_type: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    schedule: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    sender: {
        id: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    receiver: {
        id: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    notes: {
        type: String
    },
    document: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now //no required needed
    }
});

module.exports = mongoose.model('Machine', MachineSchema);