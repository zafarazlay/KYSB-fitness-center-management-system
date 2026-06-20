/**
 * Input Validation Middleware
 * Validates request data using Joi
 */
import Joi from 'joi';
import { sendError } from '../utils/response.js';

/**
 * Validate Request Data
 * @param {Object} schema - Joi validation schema
 * @param {String} source - Where to validate (body, query, params)
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });

      return sendError(res, 400, 'Validation failed', errors);
    }

    req[source] = value;
    next();
  };
};
