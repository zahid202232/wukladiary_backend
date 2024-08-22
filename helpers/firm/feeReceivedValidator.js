const { check } = require('express-validator');

// Expense Registration Validator
exports.feeReceivedValidator = [
  // Validate Color (formerly Case)
  check('color', 'Case color is required.').notEmpty(),

  // Validate Date
  check('date', 'Date is required.')
    .notEmpty()
    .isISO8601().withMessage('Invalid date format. Use YYYY-MM-DD.'),

  // Validate Particulars
  check('particulars', 'Particulars are required.').notEmpty(),

  // Validate Fee Received (formerly Money Spent)
  check('fee', 'Fee is required.')
    .notEmpty()
    .isFloat({ min: 0 }).withMessage('Fee must be a positive number.'),

  // Validate Payment Method
  check('paymentmethod', 'Payment Method is required.')
    .notEmpty()
    .isIn(['Bank Transfer', 'Cash', 'Cheque', 'Online Payment']).withMessage('Invalid Payment Method.'),

  // Validate Client Name (formerly Advocate/Member)
  check('clientname', 'Client is required.').notEmpty(),

  // Validate Notes (optional)
  check('note')
    .isString().withMessage('Notes must be a string.'),
];
