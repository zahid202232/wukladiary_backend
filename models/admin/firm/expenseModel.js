const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  case: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  particulars: {
    type: String,
    required: true,
  },
  moneySpent: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Bank Transfer', 'Cash', 'Cheque', 'Online Payment'],
  },
  advocateMember: {
    type: String, // You can also use `type: mongoose.Schema.Types.ObjectId` if it references another model
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Expense', expenseSchema);
