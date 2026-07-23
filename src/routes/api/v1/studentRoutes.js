/**
 * Student API v1 Router
 * 
 * @module routes/api/v1/studentRoutes
 * @description RESTful routes for student resource management.
 */

const express = require('express');
const router = express.Router();
const studentController = require('../../../controllers/studentController');
const { validateStudentInput } = require('../../../middlewares/validator');

// GET /api/v1/students - Retrieve all students (with optional ?query= & ?department=)
router.get('/', studentController.getStudents);

// GET /api/v1/students/:id - Retrieve specific student
router.get('/:id', studentController.getStudentById);

// POST /api/v1/students - Create new student
router.post('/', validateStudentInput, studentController.createStudent);

// PUT /api/v1/students/:id - Update student record
router.put('/:id', validateStudentInput, studentController.updateStudent);

// DELETE /api/v1/students/:id - Delete student record
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
