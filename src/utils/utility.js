// src/utils/utility.js
const axios = require('axios');

const EXTERNAL_API = ""; // put url
const accessToken = ""; // put access token

const defaultStudent = {
  student_id: 62363172,
  name: 'Terasit Juntarasombut',
  age: 22,
  gender: 'male',
  department: 'CPE'
};

exports.findStudentById = async (student_id) => {
  if (!EXTERNAL_API) {
    // If no external API is configured, return mock data
    return defaultStudent;
  }

  try {
    const response = await axios.post(EXTERNAL_API, {
      message: `HTTP Request :${student_id} `,
      student_id: student_id
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    console.log('Sent:', {
      request: student_id,
      response: response.data
    });

    return response.data;
  } catch (err) {
    console.error('Error:', err.message);
    throw err;
  }
};

exports.fakeStudentInfo = (student_id) => {
  return defaultStudent;
};
