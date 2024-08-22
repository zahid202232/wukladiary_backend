const { check } = require('express-validator');

// Client Registration Validator
exports.clientValidator = [
  // Validate Name
  check('name')
    .notEmpty().withMessage('Name is required.')
    .isString().withMessage('Name must be a string.'),

  // Validate Email
  check('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Email must be a valid email address.'),

  // Validate Password
  check('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),

  // Validate Phone
  check('phone')
    .notEmpty().withMessage('Phone number is required.')
    .isMobilePhone().withMessage('Phone number must be a valid mobile number.'),
];

