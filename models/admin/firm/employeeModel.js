const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  firmIdByLocal: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    // Password is not always required
  },
  isPasswordVisible: {
    type: Boolean,
    default: false,
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
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Employee', employeeSchema);
