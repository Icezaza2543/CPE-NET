// src/routes/index.js
const express = require('express');
const router = express.Router();
const path = require('path');
const utility = require('../utils/utility');

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
    const { student_id, firstname, lastname, gender } = req.body;
    
    if (!student_id || !firstname || !lastname) {
      return res.status(400).json({ error: true, message: 'Missing required fields' });
    }

    const newStudent = await utility.addStudent({
      student_id,
      firstname,
      lastname,
      gender
    });

    res.status(201).json({
      error: false,
      message: 'Student added to database successfully',
      result: newStudent
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Retrieve all students (R in CRUD)
router.get('/students', async (req, res) => {
  try {
    const students = await utility.getAllStudents();
    res.status(200).json({
      error: false,
      count: students.length,
      result: students
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Retrieve a specific student by ID
router.get('/student/:student_id', async (req, res) => {
  try {
    const result = await utility.findStudentById(req.params.student_id);
    if (!result) {
      return res.status(404).json({ error: true, message: 'Student not found in database' });
    }
    res.json({ error: false, result });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

router.get('/release', (req, res) => {
  res.status(400).send("Database error simulation");
});

router.get('/ok', (req, res) => {
  res.status(200).json({ status: true, result: 'Database connection successful!' });
});

module.exports = router;
