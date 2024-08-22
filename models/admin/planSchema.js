const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    enum: ['life time', 'per month', 'per year'],
    required: true,
  },
  maxUser: {
    type: Number,
    required: true,
    default: -1, // Use -1 for unlimited users
  },
  maxAdvocates: {
    type: Number,
    required: true,
    default: -1, // Use -1 for unlimited advocates
  },
  storageLimit: {
    type: Number,
    required: true,
  },
  chatgptEnabled: {
    type: Boolean,
    default: false,
  },
  trialEnabled: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('PlanSchema', planSchema);
