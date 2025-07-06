const { body, validationResult } = require('express-validator');

exports.validateTransaction = [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('date').isISO8601().toDate().withMessage('Date must be a valid date'),
  body('description').isLength({ min: 1 }).withMessage('Description is required'),
  body('category').optional().isString().withMessage('Category must be a string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];