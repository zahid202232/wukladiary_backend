const mongoose = require('mongoose');

const feeReceivedSchema = new mongoose.Schema({
  particulars: {
    type: String,
    required: true
  },
  color: {
    type: String,
    enum: ['red', 'green', 'blue'], // Based on caseOptions
    required: true
  },
  fee: {
    type: Number,
    required: true,
    min: 0
  },
  paymentmethod: {
    type: String,
    enum: ['Bank Transfer', 'Cash', 'Cheque', 'Online Payment'], // Based on PayOptions
    required: true
  },
  clientname: {
    type: String,
    enum: ['Waqas', 'Zahid Hussain', 'Kashee'], // Based on ClientsPick
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  note: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const FeeReceived = mongoose.model('FeeReceived', feeReceivedSchema);

module.exports = FeeReceived;
