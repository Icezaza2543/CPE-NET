/**
 * Legacy Utility Wrapper
 * 
 * @module utils/utility
 * @description Provides backward compatibility wrappers delegating to the new Student Repository architecture.
 */

const studentRepository = require('../repositories/studentRepository');

/**
 * Find a student by ID (Legacy wrapper)
 * @param {string} student_id 
 * @returns {Promise<Object|null>}
 */
exports.findStudentById = async (student_id) => {
  try {
    return await studentRepository.findById(student_id);
  } catch (err) {
    console.error('Error finding student:', err.message);
    throw new Error('Database connection failed');
  }
};

/**
 * Add a student (Legacy wrapper)
 * @param {Object} studentData 
 * @returns {Promise<Object>}
 */
exports.addStudent = async (studentData) => {
  try {
    return await studentRepository.create(studentData);
  } catch (err) {
    console.error('Error adding student:', err.message);
    throw new Error(err.message || 'Failed to insert record into database');
  }
};

/**
 * Get all students (Legacy wrapper)
 * @returns {Promise<Array>}
 */
exports.getAllStudents = async () => {
  return await studentRepository.findAll();
};

/**
 * Get sample student info
 * @returns {Promise<Object|null>}
 */
exports.fakeStudentInfo = async () => {
  const students = await studentRepository.findAll();
  return students[0] || null;
};
