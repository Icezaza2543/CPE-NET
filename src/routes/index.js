// src/routes/index.js
const express = require('express');
const router = express.Router();
const path = require('path');
const utility = require('../utils/utility');

router.get('/welcome', (req, res) => {
  res.json({
    error: false,
    message: 'Welcome NodeJS, Express',
  });
});

router.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/form.html'));
});

router.post('/form', (req, res) => {
  const result = {
    student_id: req.body.student_id,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    gender: req.body.gender
  };
  res.json(result);
});

router.get('/release', (req, res) => {
  res.status(400).send("error aria?");
});

router.get('/ok', (req, res) => {
  res.status(200).json({ status: true, result: ' successful!' });
});

router.get('/student/:student_id', async (req, res) => {
  try {
    // Attempting to find student by ID from utility function
    const result = await utility.findStudentById(req.params.student_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
