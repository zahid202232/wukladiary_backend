const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    phone : {
        type : String,
        required : true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 1 //0 -> Normal User, 1-> Admin, 2 -> Sub-admin, 3 -> Editor
    },

});
module.exports = mongoose.model('AdminModel', adminSchema);