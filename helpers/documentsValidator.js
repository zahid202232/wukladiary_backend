const { check } = require('express-validator');

exports.documentsRegisterValidator = [
    check('name', 'The Name is required.').not().isEmpty(),
    check('description', 'The Decription is required.').not().isEmpty(),
];
