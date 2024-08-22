const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  books: {
    type: String,
    required: true,
  },
  firmId: {
    type: mongoose.Types.ObjectId, // Reference to the Firm model
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  relatedcase: {
    type: String,
    required: true,
  },
  assignedDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ['Urgent', 'high', 'Medium', 'Low'],
    required: true,
  },
  comadvmem: [{
    type: String, // Changed from mongoose.Schema.Types.ObjectId to String
    required: true,
  }],
  description: {
    type: String,
    required: true,
  },
  advocates: [{ // Added advocates field
    type: String,
    required: false,
  }],
  file: {
    type: String, // Assuming file is stored as a URL or path
    default: null,
  }
}, {
  timestamps: true, // Optional: adds createdAt and updatedAt fields
});

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;