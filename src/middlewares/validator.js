/**
 * Request Validation & Sanitization Middleware
 *
 * @module middlewares/validator
 * @description Validates incoming payload schemas, sanitizes string inputs, and ensures data integrity.
 */

const STUDENT_ID_REGEX = /^\d{8}$/;
const DEPARTMENT_REGEX = /^[A-Z]{2,10}$/;
const ALLOWED_GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'];
const MAX_NAME_LENGTH = 100;

/**
 * Build a validation error carrying HTTP status and error code for the error handler.
 *
 * @param {string} code - Machine-readable error code
 * @param {string} message - Human-readable description
 * @returns {Error}
 */
const validationError = (code, message) => {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = code;
  return error;
};

/**
 * Validate and normalize a student payload.
 *
 * @param {Object} body - Raw request body
 * @param {Object} options
 * @param {boolean} options.isUpdate - When true, all fields are optional (partial update)
 * @returns {Object} Normalized fields that were supplied
 * @throws {Error} 400 validation error on the first invalid field
 */
const validateStudentPayload = (body, { isUpdate }) => {
  const { student_id, firstname, lastname, gender, department } = body || {};
  const normalized = {};

  // student_id is the primary key: required on create, immutable on update
  if (!isUpdate) {
    if (typeof student_id !== 'string' || !student_id.trim()) {
      throw validationError('INVALID_STUDENT_ID', 'Student ID is required and must be a non-empty string.');
    }
    // Student ID format validation: 8 numeric digits (Standard Thai Student ID pattern e.g., 62363172)
    if (!STUDENT_ID_REGEX.test(student_id.trim())) {
      throw validationError('INVALID_STUDENT_ID_FORMAT', 'Student ID must be exactly 8 numeric digits (e.g. 62363172).');
    }
    normalized.student_id = student_id.trim();
  }

  const names = [
    ['firstname', firstname, 'MISSING_FIRSTNAME', 'First name'],
    ['lastname', lastname, 'MISSING_LASTNAME', 'Last name'],
  ];
  for (const [field, value, code, label] of names) {
    if (value === undefined && isUpdate) continue;
    if (typeof value !== 'string' || !value.trim()) {
      throw validationError(code, `${label} is required and must be a non-empty string.`);
    }
    if (value.trim().length > MAX_NAME_LENGTH) {
      throw validationError('NAME_TOO_LONG', `${label} must be at most ${MAX_NAME_LENGTH} characters.`);
    }
    normalized[field] = value.trim();
  }

  if (gender !== undefined && gender !== '') {
    const value = typeof gender === 'string' ? gender.trim().toLowerCase() : '';
    if (!ALLOWED_GENDERS.includes(value)) {
      throw validationError('INVALID_GENDER', `Gender must be one of: ${ALLOWED_GENDERS.join(', ')}.`);
    }
    normalized.gender = value;
  }

  if (department !== undefined && department !== '') {
    const value = typeof department === 'string' ? department.trim().toUpperCase() : '';
    if (!DEPARTMENT_REGEX.test(value)) {
      throw validationError('INVALID_DEPARTMENT', 'Department must be 2-10 letters (e.g. CPE, EE, ME).');
    }
    normalized.department = value;
  }

  return normalized;
};

/**
 * Express middleware validating payload for Student creation (POST) and modification (PUT).
 * Replaces req.body with the normalized payload so unknown fields never reach the repository.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const validateStudentInput = (req, res, next) => {
  try {
    req.body = validateStudentPayload(req.body, { isUpdate: req.method === 'PUT' });
    next();
  } catch (error) {
    res.status(error.statusCode || 400).json({
      success: false,
      error: {
        code: error.code,
        message: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  ALLOWED_GENDERS,
  validateStudentPayload,
  validateStudentInput
};
