const { check, body } = require('express-validator');

// Employee Registration Validator
exports.registerEmployeeValidator = [
  // Validate Name
  check('name', 'Name is required.').notEmpty(),

  // Validate Email Address
  check('email', 'Email Address is required.')
    .notEmpty()
    .isEmail().withMessage('Invalid email format.'),

  // Validate Username
  check('userName', 'Username is required.').notEmpty(),

  // Validate Phone Number
  check('phone', 'Phone Number is required.')
    .notEmpty()
    .isMobilePhone().withMessage('Invalid phone number.'),

  // Validate Role
  check('role', 'Role is required.')
    .notEmpty(),
  // Validate Password (if provided)
  check('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),

  // Validate Password Visibility (optional, default is false)
  check('isPasswordVisible')
    .optional()
    .isBoolean().withMessage('Invalid value for password visibility.'),
];