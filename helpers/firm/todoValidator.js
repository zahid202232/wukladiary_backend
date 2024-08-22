const { body } = require('express-validator');

const todoValidator = [
    body('name')
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string'),

    body('relatedcase')
        .notEmpty().withMessage('Related Case is required')
        .isString().withMessage('Related Case must be a string'),

    body('assignedDate')
        .notEmpty().withMessage('Assigned Date is required')
        .isISO8601().withMessage('Assigned Date must be a valid date'),

    body('dueDate')
        .notEmpty().withMessage('Due Date is required')
        .isISO8601().withMessage('Due Date must be a valid date')
        .custom((value, { req }) => {
            const assignedDate = new Date(req.body.assignedDate);
            const dueDate = new Date(value);
            if (dueDate < assignedDate) {
                throw new Error('Due Date cannot be before Assigned Date');
            }
            return true;
        }),

    body('description')
        .notEmpty().withMessage('Description is required')
        .isString().withMessage('Description must be a string'),

    body('priority')
        .notEmpty().withMessage('Priority is required')
        .isIn(['Urgent', 'high', 'Medium', 'Low']).withMessage('Invalid Priority value'),

    body('comadvmem')
        .isArray().withMessage('Assign To must be an array of IDs')
        .notEmpty().withMessage('Assign To is required')
        .custom((value) => {
            if (!Array.isArray(value) || value.length === 0) {
                throw new Error('Assign To is required');
            }
            return true;
        }),

    body('file')
        .optional()
        .isString().withMessage('File must be a string (URL or path)')
];

module.exports = todoValidator;
