// src/utils/utility.js
const axios = require('axios');

// Mock In-Memory Database for the Database Course Project
let studentsDb = [
  {
    student_id: '62363172',
    firstname: 'Terasit',
    lastname: 'Juntarasombut',
    gender: 'male',
    department: 'CPE',
    createdAt: new Date().toISOString()
  }
];

/**
 * Find a student by their ID in the mock database
 * @param {string} student_id 
 * @returns {object|null} Student object or null if not found
 */
exports.findStudentById = async (student_id) => {
  try {
    const student = studentsDb.find(s => s.student_id === student_id);
    return student || null;
  } catch (err) {
    console.error('Error finding student:', err.message);
    throw new Error('Database connection failed');
  }
};

/**
 * Add a new student to the mock database
 * @param {object} studentData 
 * @returns {object} The newly created student
 */
exports.addStudent = async (studentData) => {
  try {
    const newStudent = {
      ...studentData,
      createdAt: new Date().toISOString()
    };
    studentsDb.push(newStudent);
    return newStudent;
  } catch (err) {
    console.error('Error adding student:', err.message);
    throw new Error('Failed to insert record into database');
  }
};

/**
 * Retrieve all students from the mock database
 * @returns {Array} List of all students
 */
exports.getAllStudents = async () => {
  return studentsDb;
};

exports.fakeStudentInfo = (student_id) => {
  return studentsDb[0] || null;
};
