const { check } = require('express-validator');

// Expense Registration Validator
exports.registerExpenseValidator = [
  // Validate Case
  check('case', 'Case is required.').notEmpty(),

  // Validate Date
  check('date', 'Date is required.')
    .notEmpty()
    .isISO8601().withMessage('Invalid date format. Use YYYY-MM-DD.'),

  // Validate Particulars
  check('particulars', 'Particulars are required.').notEmpty(),

  // Validate Money Spent
  check('moneySpent', 'Money Spent is required.')
    .notEmpty()
    .isFloat({ min: 0 }).withMessage('Money Spent must be a positive number.'),

  // Validate Payment Method
  check('paymentMethod', 'Payment Method is required.')
    .notEmpty()
    .isIn(['Bank Transfer', 'Cash', 'Cheque', 'Online Payment']).withMessage('Invalid Payment Method.'),

  // Validate Advocate/Member
  check('advocateMember', 'Advocate/Member is required.').notEmpty(),

  // Validate Notes (optional)
  check('notes')
    .optional()
    .isString().withMessage('Notes must be a string.'),
];
