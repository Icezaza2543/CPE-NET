/**
 * Student Business Logic Service Layer
 * 
 * @module services/studentService
 * @description Encapsulates business logic rules, data orchestration, and aggregate metrics calculation.
 */

const studentRepository = require('../repositories/studentRepository');

class StudentService {
  /**
   * Fetch students with search filters and statistics overview
   * 
   * @param {Object} filter - Filter options (query, department)
   * @returns {Promise<{ students: Array, meta: Object }>}
   */
  async getStudents(filter) {
    const students = await studentRepository.findAll(filter);
    const allStudents = await studentRepository.findAll();

    // Calculate aggregated statistics
    const stats = {
      totalCount: allStudents.length,
      cpeCount: allStudents.filter(s => (s.department || '').toUpperCase() === 'CPE').length,
      departmentBreakdown: allStudents.reduce((acc, curr) => {
        const dept = (curr.department || 'OTHER').toUpperCase();
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {})
    };

    return {
      students,
      meta: {
        count: students.length,
        stats
      }
    };
  }

  /**
   * Retrieve single student details by ID
   * 
   * @param {string} studentId 
   * @returns {Promise<Object>}
   */
  async getStudentById(studentId) {
    const student = await studentRepository.findById(studentId);
    if (!student) {
      const error = new Error(`Student with ID '${studentId}' does not exist.`);
      error.statusCode = 404;
      error.code = 'STUDENT_NOT_FOUND';
      throw error;
    }
    return student;
  }

  /**
   * Register a new student
   * 
   * @param {Object} studentData 
   * @returns {Promise<Object>} Created student
   */
  async registerStudent(studentData) {
    return await studentRepository.create(studentData);
  }

  /**
   * Update student details
   * 
   * @param {string} studentId 
   * @param {Object} updateData 
   * @returns {Promise<Object>} Updated student record
   */
  async updateStudent(studentId, updateData) {
    return await studentRepository.update(studentId, updateData);
  }

  /**
   * Remove a student by ID
   * 
   * @param {string} studentId 
   * @returns {Promise<{ student_id: string }>}
   */
  async removeStudent(studentId) {
    await studentRepository.delete(studentId);
    return { student_id: studentId };
  }
}

module.exports = new StudentService();
