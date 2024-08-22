const { check } = require('express-validator');

exports.booksRegisterValidator = [
    check('name', 'The Name is required.').not().isEmpty(),
    check('description', 'The Decription is required.').not().isEmpty(),
  //  check('file', 'The file is required.').not().isEmpty(),
    //check('autoCode', 'The Auto Code is required.').not().isEmpty(),
];
