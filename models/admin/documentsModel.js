const mongoose = require('mongoose');

const documentsSchema = new mongoose.Schema({
  firmId: {
    type: mongoose.Schema.Types.ObjectId,  // Just storing the ObjectId without referencing another model
    required: true,
    validate: {
      validator: mongoose.Types.ObjectId.isValid,
      message: 'Invalid firm ID'
    }
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  file: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the `updatedAt` field before saving the document
documentsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Document = mongoose.model('Document', documentsSchema);

module.exports = Document;
