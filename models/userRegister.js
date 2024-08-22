const mongoose = require('mongoose');

const userRegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    default: 0 // 0 -> Normal User, 1 -> Admin, 2 -> Sub-admin, 3 -> Editor
  },
  permissions:[{
    permission_name: String,
    permission_value: [Number]
  }]
});

module.exports = mongoose.model('UserRegister', userRegisterSchema);