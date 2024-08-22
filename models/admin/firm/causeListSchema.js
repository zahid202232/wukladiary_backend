const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the cause
const causeSchema = new Schema({
  tribunal: {
    type: String,
    required: true,
    enum: ['highcourt', 'localbar', 'supremecourt'], // Enum for allowed values
  },
  HighCourt: {
    type: String,
    enum: [
      'lahore highcourt',
      'sindh highcourt',
      'peshawar highcourt',
      'balochistan highcourt',
      'islamabad highcourt'
    ],
    required: function() { return this.tribunal === 'highcourt'; }
  },
  circuit: {
    type: String,
    enum: [
      'arifwala court',
      'kasur court',
      'okara court'
    ],
    required: function() { return this.HighCourt === 'lahore highcourt'; }
  },
  causelist: {
    type: String,
    enum: [
      'Advocate Name',
      'Keyword',
      'Party Name',
      'Judge Name'
    ],
    required: true
  },
  causeDetail: {
    type: String,
    required: function() { return this.causelist !== ''; }
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Create the model from the schema
const Cause = mongoose.model('Cause', causeSchema);

module.exports = Cause;
