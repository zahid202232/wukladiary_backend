const { check, body } = require('express-validator');

// Case Registration Validator
exports.caseValidator = [
  // Validate Tribunal
  check('tribunal')
    .isIn(['localbar', 'highcourt', 'supremecourt'])
    .withMessage('Tribunal must be one of the following: localbar, highcourt, supremecourt'),

  // Validate High Court (conditionally required)
  body('highcourt').custom((value, { req }) => {
    if (req.body.tribunal === 'highcourt' && !value) {
      throw new Error('High Court is required.');
    }
    return true;
  }),

  // Validate Local Bar (conditionally required)
  body('localbar').custom((value, { req }) => {
    if (req.body.tribunal === 'localbar' && !value) {
      throw new Error('Local Bar Case Number or Diary Number is required.');
    }
    return true;
  }),

  // Validate Supreme Court (conditionally required)
  body('supremecourt').custom((value, { req }) => {
    if (req.body.tribunal === 'supremecourt' && !value) {
      throw new Error('Supreme Court Case Number or Diary Number is required.');
    }
    return true;
  }),

  // Validate Case Type (conditionally required)
  body('casetype').custom((value, { req }) => {
    if ((req.body.localbar === 'Case Number' || req.body.supremecourt === 'Case Number') && !value) {
      throw new Error('Case Type is required.');
    }
    return true;
  }),

  // Validate Diary Number (conditionally required)
  body('diarynumber').custom((value, { req }) => {
    if ((req.body.localbar === 'Diary Number' || req.body.supremecourt === 'Diary Number') && !value) {
      throw new Error('Diary Number is required.');
    }
    return true;
  }),

  // Validate Case Number
  check('casenumber')
    .notEmpty().withMessage('Case Number is required.')
    .isString().withMessage('Case Number must be a string.'),

  // Validate Year
  check('year')
    .notEmpty().withMessage('Year is required.')
    .isString().withMessage('Year must be a string.'),

  // Validate Title
  check('title')
    .notEmpty().withMessage('Title is required.')
    .isString().withMessage('Title must be a string.'),

  //     // Validate Title
  // check('bench')
  // .notEmpty().withMessage('bench is required.')
  // .isString().withMessage('bench must be a string.'),

  // Validate Date of Filing
  check('dateoffiling')
    .notEmpty().withMessage('Date of Filing is required.')
    .isDate().withMessage('Date of Filing must be a valid date.'),

  // Validate Judge Name
  check('judgename')
    .notEmpty().withMessage('Judge Name is required.')
    .isString().withMessage('Judge Name must be a string.'),

  // Validate Court Room No
  check('courtroomno')
    .notEmpty().withMessage('Court Room No is required.')
    .isString().withMessage('Court Room No must be a string.'),

  // Validate Description
  check('description')
    .notEmpty().withMessage('Description is required.')
    .isString().withMessage('Description must be a string.'),

  // Validate Documents (optional)
  check('documents')
    .optional()
    .isArray().withMessage('Documents should be an array of objects.')
    .custom((value) => {
      if (value.some(doc => !doc.name || typeof doc.name !== 'string')) {
        throw new Error('Each document must have a valid name.');
      }
      return true;
    }),

  // Validate Options (optional)
  check('options')
    .optional()
    .isArray().withMessage('Options should be an array of objects.')
    .custom((value) => {
      if (value.some(opt => !opt.value || typeof opt.value !== 'string')) {
        throw new Error('Each option must have a valid value.');
      }
      return true;
    }),

  // Validate Rows (optional)
  check('rows')
    .optional()
    .isArray().withMessage('Rows should be an array of objects.')
    .custom((value) => {
      if (value.some(row => !row.name || typeof row.name !== 'string')) {
        throw new Error('Each row must have a valid name.');
      }
      return true;
    }),
];
