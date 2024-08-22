const { check } = require('express-validator');

exports.planRegisterValidator = [
    check('name', 'The Name is required.').not().isEmpty(),
    check('price', 'The Price is required.').not().isEmpty(),
    check('duration', 'The Duration is required.').not().isEmpty(),
    check('maxUser', 'The Max User is required.').not().isEmpty(),
    check('maxAdvocates', 'The Max Advocates is required.').not().isEmpty(),
    check('storageLimit', 'The Storage Limit is required.').not().isEmpty(),
  //  check('chatgptEnabled', 'The ChatGPT Enabled is required.').not().isEmpty(),
    check('trialEnabled', 'The Trial Enabled is required.').not().isEmpty(),
    check('description', 'The Description is required.').not().isEmpty(),

];
