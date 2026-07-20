import { body } from 'express-validator';

export const createOrderValidator = [
  body('customerName')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[+]?[\d\s\-().]{7,20}$/)
    .withMessage('Invalid phone number format'),

  body('productName')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Product name must be between 1 and 200 characters'),

  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a non-negative number'),

  body('paymentStatus')
    .optional()
    .isIn(['PAID', 'UNPAID'])
    .withMessage('Payment status must be PAID or UNPAID'),
];

export const updateOrderValidator = [
  body('customerName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[\d\s\-().]{7,20}$/)
    .withMessage('Invalid phone number format'),

  body('productName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Product name must be between 1 and 200 characters'),

  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a non-negative number'),

  body('paymentStatus')
    .optional()
    .isIn(['PAID', 'UNPAID'])
    .withMessage('Payment status must be PAID or UNPAID'),

  body('status')
    .optional()
    .isIn(['PLACED', 'PROCESSING', 'READY_TO_SHIP'])
    .withMessage('Status must be PLACED, PROCESSING, or READY_TO_SHIP'),
];
