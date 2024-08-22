const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for documents
const documentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

// Define the schema for options
const optionSchema = new Schema({
  value: {
    type: String,
    required: true,
  },
});

// Define the schema for rows
const rowSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

// Define the main schema for a case
const caseSchema = new Schema({
  firmId: {
    type: Schema.Types.ObjectId, // Reference to the Firm model
    required: true,
  },
  tribunal: {
    type: String,
    enum: ['localbar', 'highcourt', 'supremecourt'],
    required: true,
  },
  highcourt: {
    type: String,
    required: function () {
      return this.tribunal === 'highcourt';
    },
  },
  localbar: {
    type: String,
    required: function () {
      return this.tribunal === 'localbar';
    },
  },
  supremecourt: {
    type: String,
    required: function () {
      return this.tribunal === 'supremecourt';
    },
  },
  casetype: {
    type: String,
    required: function () {
      return this.localbar === 'Case Number' || this.supremecourt === 'Case Number';
    },
  },
  diarynumber: {
    type: String,
    required: function () {
      return this.localbar === 'Diary Number' || this.supremecourt === 'Diary Number';
    },
  },
  bench: {
    type: String,
    required: function () {
      return this.highcourt === 'lahore highcourt';
    },
  },
  casenumber: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  dateoffiling: {
    type: Date,
    required: true,
  },
  judgename: {
    type: String,
    required: true,
  },
  courtroomno: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  underacts: {
    type: String,
    required: true,
  },
  undersection: {
    type: String,
    required: true,
  },
  firpolicestation: {
    type: String,
    required: true,
  },
  firno: {
    type: String,
    required: true,
  },
  firyear: {
    type: String,
    required: true,
  },
  stage: {
    type: String,
    required: true,
  },
  yourparty: {
    type: String,
    required: true,
  },
  oppositeparty: {
    type: String,
    required: true,
  },
  advocate: {
    type: String,
    required: true,
  },
  oppositpartyadvocate: {
    type: String,
    required: true,
  },
  options: [optionSchema],
  rows: [rowSchema],
  documents: [documentSchema],
}, {
  timestamps: true,
});

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;
