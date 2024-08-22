const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  autoCode: {
    type: String,
    required: true,
    unique: true, // Ensure code is unique
  },
  discount: {
    type: Number,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
  used: {
    type: Number,
    default: 0, // Default to 0 if not specified
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time
  },
});

const Coupon = mongoose.model('CouponSchema', couponSchema);

module.exports = Coupon;
