const mongoose = require('mongoose');

const firmSchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    role: {
        type: Number,
        default: 2
    },
    dueDate: {
        type: Date,
        default: null
    },
    mobileNumber: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    zipCode: {
        type: String,
        required: false
    },
    landmark: {
        type: String,
        required: false
    },
    about: {
        type: String,
        required: false
    },
    company_logo: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('FirmModel', firmSchema);
