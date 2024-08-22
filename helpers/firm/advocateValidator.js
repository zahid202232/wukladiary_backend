const { check, body } = require('express-validator');

// Function to validate uploaded files
const validateFile = (req) => {
  if (!req.file) {
    throw new Error('Image is required.');
  }
  return true;
};

exports.registerAdvocateValidator = [
  // Validate Firm/Advocate Name
  check('advName', 'Firm/Advocate Name is required.').notEmpty(),
  //check('firmId', 'firmId is required.').notEmpty(),

  // Validate Email Address
  check('email', 'Email Address is required.').notEmpty()
    .isEmail().withMessage('Invalid email format.'),

  // Validate Password
  check('password', 'Password is required.').notEmpty()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),

  // Validate Phone Number
  check('phone', 'Phone Number is required.').notEmpty()
    .isMobilePhone().withMessage('Invalid phone number.'),

  // Validate Age
  check('age', 'Age is required.').notEmpty()
    .isInt({ min: 0 }).withMessage('Age must be a positive integer.'),

  // Validate Image (if using form-data)
  body('image').custom((value, { req }) => validateFile(req)),

  // Validate Law Experience
  check('lawex', 'Law Experience is required.').notEmpty(),

  // Validate Firm ID
  check('firmid', 'Firm ID is required.').notEmpty(),

  // Validate Bank Details
  check('bank', 'Bank Details are required.').notEmpty(),

  // Validate Office Address
  check('address1Office', 'Address Line 1 for Office is required.').notEmpty(),
  check('zipcodeOffice', 'Zip/Postal Code for Office is required.').notEmpty()
    .isPostalCode('any').withMessage('Invalid postal code.'),

  // Validate Chamber Address
  check('address1Chamber', 'Address Line 1 for Chamber is required.').notEmpty(),
  check('zipcodeChamber', 'Zip/Postal Code for Chamber is required.').notEmpty()
    .isPostalCode('any').withMessage('Invalid postal code.'),

  // Validate Countries, States, and Cities for Office
  check('countryOffice', 'Country for Office is required.').notEmpty(),
  check('stateOffice', 'State for Office is required.').notEmpty(),
  check('cityOffice', 'City for Office is required.').notEmpty(),

  // Validate Countries, States, and Cities for Chamber
  check('countryChamber', 'Country for Chamber is required.').notEmpty(),
  check('stateChamber', 'State for Chamber is required.').notEmpty(),
  check('cityChamber', 'City for Chamber is required.').notEmpty(),
];
