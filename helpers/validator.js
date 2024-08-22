const { check, body } = require('express-validator');

exports.registerValidator = [
    check('name', 'Name is Required.').not().isEmpty(),
    check('phone', 'Phone is Required.').not().isEmpty(),
    check('email', 'Please Enter a valid E-mail Address').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('password', 'Password is Required.').not().isEmpty(),
    body('confirmPassword', 'Confirm Password is Required.').not().isEmpty(),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
];
exports.loginValidator = [
    check('email', 'Please Enter a valid E-mail Address').isEmail().normalizeEmail({
        gmail_remove_dots:true
    }),
    check('password', 'Password is Required.').not().isEmpty(),

];