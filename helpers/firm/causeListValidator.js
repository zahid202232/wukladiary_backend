const { check, body } = require('express-validator');

exports.registerCauseValidator = [
  // Validate tribunal
  check('tribunal', 'Tribunal selection is required.').not().isEmpty()
    .isIn(['highcourt', 'localbar', 'supremecourt']).withMessage('Invalid tribunal selection.'),

  // Validate HighCourt only if tribunal is 'highcourt'
  body('HighCourt').custom((value, { req }) => {
    if (req.body.tribunal === 'highcourt' && !value) {
      throw new Error('High Court selection is required when "highcourt" is selected.');
    }
    if (req.body.tribunal === 'highcourt' && value && ![
      'lahore highcourt', 'sindh highcourt', 'peshawar highcourt', 'balochistan highcourt', 'islamabad highcourt'
    ].includes(value)) {
      throw new Error('Invalid High Court selection.');
    }
    return true;
  }),

  // Validate circuit only if HighCourt is 'lahore highcourt'
  body('circuit').custom((value, { req }) => {
    if (req.body.HighCourt === 'lahore highcourt' && !value) {
      throw new Error('Circuit/Division selection is required when "lahore highcourt" is selected.');
    }
    if (req.body.HighCourt === 'lahore highcourt' && value && ![
      'arifwala court', 'kasur court', 'okara court'
    ].includes(value)) {
      throw new Error('Invalid Circuit/Division selection.');
    }
    return true;
  }),

  // Validate causelist
  check('causelist', 'Causelist Criteria is required.').not().isEmpty()
    .isIn(['Advocate Name', 'Keyword', 'Party Name', 'Judge Name']).withMessage('Invalid causelist selection.'),

  // Validate causeDetail
  body('causeDetail').custom((value, { req }) => {
    if (req.body.causelist && !value) {
      throw new Error('Cause Detail is required when causelist is provided.');
    }
    return true;
  }),
];
