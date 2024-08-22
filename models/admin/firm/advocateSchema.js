const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdvocateSchema = new Schema({
  firmIdByLocal: {
    type: Schema.Types.ObjectId, // Reference to the Firm model
    required: true,
  },
  advName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  image: {
    type: String, // Assuming you store the image URL or path as a string
    required: false
  },
  lawex: {
    type: String,
    required: true
  },
  firmid: {
    type: String,
    required: true
  },
  bank: {
    type: String,
    required: true
  },
  address1Office: {
    type: String,
    required: true
  },
  address2Office: {
    type: String,
    required: false
  },
  zipcodeOffice: {
    type: String,
    required: true
  },
  address1Chamber: {
    type: String,
    required: true
  },
  address2Chamber: {
    type: String,
    required: false
  },
  zipcodeChamber: {
    type: String,
    required: true
  },
  countryOffice: {
    type: String,
    required: true
  },
  stateOffice: {
    type: String,
    required: true
  },
  cityOffice: {
    type: String,
    required: true
  },
  countryChamber: {
    type: String,
    required: true
  },
  stateChamber: {
    type: String,
    required: true
  },
  cityChamber: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Advocate', AdvocateSchema);
