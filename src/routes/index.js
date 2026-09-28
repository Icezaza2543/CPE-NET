/**
 * Legacy Web & API Router
 *
 * @module routes/index
 * @description Original lab endpoints kept for backward compatibility. They share validation and
 * storage with API v1 but keep the legacy `{ error, message, result }` response shape.
 * New clients should use `/api/v1/students`.
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const studentRepository = require('../repositories/studentRepository');
const { validateStudentPayload } = require('../middlewares/validator');

/**
 * Send an error in the legacy response shape, keeping the status code attached by lower layers.
 *
 * @param {import('express').Response} res
 * @param {Error & { statusCode?: number }} error
 */
const sendLegacyError = (res, error) => {
  const statusCode = error.statusCode || 500;
  if (statusCode >= 500) console.error(`[Legacy Route Error] ${error.stack || error.message}`);
  res.status(statusCode).json({ error: true, message: error.message });
};

router.get('/welcome', (req, res) => {
  res.json({
    error: false,
    message: 'Welcome to Database Project API',
  });
});

router.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/form.html'));
});

// Create a new student (C in CRUD)
router.post('/form', async (req, res) => {
  try {
    const studentData = validateStudentPayload(req.body, { isUpdate: false });
    const newStudent = await studentRepository.create(studentData);

    res.status(201).json({
      error: false,
      message: 'Student added to database successfully',
      result: newStudent
    });
  } catch (error) {
    sendLegacyError(res, error);
  }
});

// Retrieve all students (R in CRUD)
router.get('/students', async (req, res) => {
  try {
    const students = await studentRepository.findAll();
    res.status(200).json({
      error: false,
      count: students.length,
      result: students
    });
  } catch (error) {
    sendLegacyError(res, error);
  }
});

// Retrieve a specific student by ID
router.get('/student/:student_id', async (req, res) => {
  try {
    const result = await studentRepository.findById(req.params.student_id);
    if (!result) {
      return res.status(404).json({ error: true, message: 'Student not found in database' });
    }
    res.json({ error: false, result });
  } catch (error) {
    sendLegacyError(res, error);
  }
});

// Lab endpoints for observing HTTP status codes
router.get('/release', (req, res) => {
  res.status(400).send("Database error simulation");
});

router.get('/ok', (req, res) => {
  res.status(200).json({ status: true, result: 'Database connection successful!' });
});

module.exports = router;
