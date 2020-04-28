const mongoose = require('mongoose');

const DesignSchema = new mongoose.Schema({
    machine: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    functionality: {
        type: String,
        required: true
    },
    appearance: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    materials: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    document: {
        type: String,
        required: true
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

module.exports = mongoose.model('Design', DesignSchema);