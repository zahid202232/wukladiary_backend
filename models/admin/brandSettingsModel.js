const mongoose = require('mongoose');

const brandSettingSchema = new mongoose.Schema({
  titleText: {
    type: String,
    required: true,
  },
  footerText: {
    type: String,
    required: true,
  },
  defaultLanguage: {
    type: String,
    enum: ['English', 'Urdu', 'Hindi', 'Punjabi', 'Persion'], // Add more languages as needed
    default: 'English',
  },
  enableSignUpPage: {
    type: Boolean,
    default: false,
  },
  emailVerification: {
    type: Boolean,
    default: false,
  },
  enableLandingPage: {
    type: Boolean,
    default: false,
  },
  transparentLayout: {
    type: Boolean,
    default: false,
  },
  darkLayout: {
    type: Boolean,
    default: false,
  },
  logoDark: {
    type: String,
    required: true, // Assume it's a URL or a path to the stored image
  },
  logoLight: {
    type: String,
    required: true, // Assume it's a URL or a path to the stored image
  },
  favicon: {
    type: String,
    required: true, // Assume it's a URL or a path to the stored image
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('BrandSetting', brandSettingSchema);
