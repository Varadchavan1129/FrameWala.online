// validateMiddleware.js
// Express-validator validation results check helper

import { validationResult } from 'express-validator';
import { sendError } from '../utils/responseHelper.js';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorObject = {};
    errors.array().forEach((err) => {
      errorObject[err.path] = err.msg;
    });
    return res.status(400).json(sendError('Validation failed', errorObject));
  }
  next();
};
