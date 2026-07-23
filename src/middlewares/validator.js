/**
 * Request Validation & Sanitization Middleware
 * 
 * @module middlewares/validator
 * @description Validates incoming payload schemas, sanitizes string inputs, and ensures data integrity.
 */

/**
 * Validates payload for Student creation and modification
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const validateStudentInput = (req, res, next) => {
  const { student_id, firstname, lastname, gender, department } = req.body;
  const isUpdate = req.method === 'PUT';

  // For POST creation, student_id, firstname, and lastname are strictly required
  if (!isUpdate) {
    if (!student_id || typeof student_id !== 'string' || !student_id.trim()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STUDENT_ID',
          message: 'Student ID is required and must be a non-empty string.'
        },
        timestamp: new Date().toISOString()
      });
    }

    // Student ID format validation: 8 numeric digits (Standard Thai Student ID pattern e.g., 62363172)
    const studentIdRegex = /^\d{8}$/;
    if (!studentIdRegex.test(student_id.trim())) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STUDENT_ID_FORMAT',
          message: 'Student ID must be exactly 8 numeric digits (e.g. 62363172).'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  if (!isUpdate && (!firstname || !firstname.trim())) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'MISSING_FIRSTNAME',
        message: 'First name is required.'
      },
      timestamp: new Date().toISOString()
    });
  }

  if (!isUpdate && (!lastname || !lastname.trim())) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'MISSING_LASTNAME',
        message: 'Last name is required.'
      },
      timestamp: new Date().toISOString()
    });
  }

  // Sanitize and attach normalized values to request body
  if (student_id) req.body.student_id = student_id.trim();
  if (firstname) req.body.firstname = firstname.trim();
  if (lastname) req.body.lastname = lastname.trim();
  if (gender) req.body.gender = gender.trim().toLowerCase();
  if (department) req.body.department = department.trim().toUpperCase();

  next();
};

module.exports = {
  validateStudentInput
};
