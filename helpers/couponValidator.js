const { check } = require('express-validator');

exports.couponRegisterValidator = [
    check('name', 'The Name is required.').not().isEmpty(),
    check('discount', 'The Discount is required.').not().isEmpty(),
    check('limit', 'The limit is required.').not().isEmpty(),
    check('autoCode', 'The Auto Code is required.').not().isEmpty(),
];
