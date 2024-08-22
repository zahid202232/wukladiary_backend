const { check } = require('express-validator');

exports.brandSettingsValidator = [
  check('titleText', 'The Title Text is required.').not().isEmpty(),
  check('footerText', 'The Footer Text is required.').not().isEmpty(),
  check('defaultLanguage', 'The Default Language is required.')
    .not().isEmpty()
    .isIn(['English', 'Urdu', 'Hindi', 'Punjabi', 'Persion'])
    .withMessage('Invalid language selected.'),
  // check('logoDark', 'Logo Dark URL is required.').not().isEmpty().isURL().withMessage('Invalid URL format for Logo Dark.'),
  // check('logoLight', 'Logo Light URL is required.').not().isEmpty().isURL().withMessage('Invalid URL format for Logo Light.'),
  // check('favicon', 'Favicon URL is required.').not().isEmpty().isURL().withMessage('Invalid URL format for Favicon.'),
  check('enableSignUpPage', 'Invalid value for Enable Sign-Up Page.')
    .optional()
    .isBoolean(),
  check('emailVerification', 'Invalid value for Email Verification.')
    .optional()
    .isBoolean(),
  check('enableLandingPage', 'Invalid value for Enable Landing Page.')
    .optional()
    .isBoolean(),
  check('transparentLayout', 'Invalid value for Transparent Layout.')
    .optional()
    .isBoolean(),
  check('darkLayout', 'Invalid value for Dark Layout.')
    .optional()
    .isBoolean(),
];
