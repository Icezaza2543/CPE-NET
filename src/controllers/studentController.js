/**
 * Student Controller
 * 
 * @module controllers/studentController
 * @description Translates HTTP request parameters to student service calls and formats API responses.
 */

const studentService = require('../services/studentService');

class StudentController {
  /**
   * Get list of all students with optional search/filter parameters
   * GET /api/v1/students
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   * @param {import('express').NextFunction} next 
   */
  async getStudents(req, res, next) {
    try {
      const { query, department } = req.query;
      const { students, meta } = await studentService.getStudents({ query, department });

      res.status(200).json({
        success: true,
        message: 'Students retrieved successfully.',
        meta,
        data: students,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a student by ID
   * GET /api/v1/students/:id
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   * @param {import('express').NextFunction} next 
   */
  async getStudentById(req, res, next) {
    try {
      const studentId = req.params.id;
      const student = await studentService.getStudentById(studentId);

      res.status(200).json({
        success: true,
        message: 'Student retrieved successfully.',
        data: student,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Register a new student
   * POST /api/v1/students
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   * @param {import('express').NextFunction} next 
   */
  async createStudent(req, res, next) {
    try {
      const newStudent = await studentService.registerStudent(req.body);

      res.status(201).json({
        success: true,
        message: 'Student registered successfully.',
        data: newStudent,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update student details
   * PUT /api/v1/students/:id
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   * @param {import('express').NextFunction} next 
   */
  async updateStudent(req, res, next) {
    try {
      const studentId = req.params.id;
      const updatedStudent = await studentService.updateStudent(studentId, req.body);

      res.status(200).json({
        success: true,
        message: 'Student record updated successfully.',
        data: updatedStudent,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a student
   * DELETE /api/v1/students/:id
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   * @param {import('express').NextFunction} next 
   */
  async deleteStudent(req, res, next) {
    try {
      const studentId = req.params.id;
      const result = await studentService.removeStudent(studentId);

      res.status(200).json({
        success: true,
        message: `Student ID '${studentId}' deleted successfully.`,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StudentController();
