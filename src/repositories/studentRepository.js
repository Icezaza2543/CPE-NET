/**
 * Student Repository Layer (Data Access Object - DAO Pattern)
 * 
 * @module repositories/studentRepository
 * @description Encapsulates storage management and data manipulation queries for Student entities.
 * Implements thread-safe in-memory operations simulating database transactions.
 */

/**
 * @typedef {Object} Student
 * @property {string} student_id - Unique 8-digit Student Identifier
 * @property {string} firstname - Student First Name
 * @property {string} lastname - Student Last Name
 * @property {string} gender - Gender (male, female, other, prefer_not_to_say)
 * @property {string} department - Academic Department Code (e.g. CPE, EE, ME)
 * @property {string} createdAt - ISO Timestamp of record creation
 * @property {string} [updatedAt] - ISO Timestamp of last modification
 */

// In-Memory Data Store (Seeded with initial record)
const studentsDb = [
  {
    student_id: '62363172',
    firstname: 'Terasit',
    lastname: 'Juntarasombut',
    gender: 'male',
    department: 'CPE',
    createdAt: new Date().toISOString()
  },
  {
    student_id: '64010001',
    firstname: 'Somchai',
    lastname: 'Devtech',
    gender: 'male',
    department: 'CPE',
    createdAt: new Date().toISOString()
  },
  {
    student_id: '64010002',
    firstname: 'Suda',
    lastname: 'Wongcom',
    gender: 'female',
    department: 'EE',
    createdAt: new Date().toISOString()
  }
];

class StudentRepository {
  /**
   * Find all student records with optional search filter
   * 
   * @param {Object} [filter] - Filter criteria
   * @param {string} [filter.query] - Search keyword across ID, name, or department
   * @param {string} [filter.department] - Filter by exact department code
   * @returns {Promise<Student[]>} List of matching student records
   */
  async findAll(filter = {}) {
    let result = [...studentsDb];

    if (filter.department) {
      const deptUpper = filter.department.toUpperCase();
      result = result.filter(s => (s.department || '').toUpperCase() === deptUpper);
    }

    if (filter.query) {
      const q = filter.query.toLowerCase();
      result = result.filter(s => 
        s.student_id.toLowerCase().includes(q) ||
        s.firstname.toLowerCase().includes(q) ||
        s.lastname.toLowerCase().includes(q) ||
        (s.department && s.department.toLowerCase().includes(q))
      );
    }

    return result;
  }

  /**
   * Find a specific student by primary key (student_id)
   * 
   * @param {string} studentId 
   * @returns {Promise<Student|null>}
   */
  async findById(studentId) {
    const student = studentsDb.find(s => s.student_id === studentId);
    return student ? { ...student } : null;
  }

  /**
   * Insert a new student record into the repository
   * 
   * @param {Omit<Student, 'createdAt'>} studentData 
   * @returns {Promise<Student>}
   */
  async create(studentData) {
    const existing = await this.findById(studentData.student_id);
    if (existing) {
      const error = new Error(`Student with ID '${studentData.student_id}' already exists.`);
      error.statusCode = 409; // Conflict
      error.code = 'DUPLICATE_STUDENT_ID';
      throw error;
    }

    const newStudent = {
      student_id: studentData.student_id,
      firstname: studentData.firstname,
      lastname: studentData.lastname,
      gender: studentData.gender || 'prefer_not_to_say',
      department: (studentData.department || 'CPE').toUpperCase(),
      createdAt: new Date().toISOString()
    };

    studentsDb.push(newStudent);
    return { ...newStudent };
  }

  /**
   * Update an existing student record
   * 
   * @param {string} studentId 
   * @param {Partial<Student>} updateData 
   * @returns {Promise<Student>}
   */
  async update(studentId, updateData) {
    const index = studentsDb.findIndex(s => s.student_id === studentId);
    if (index === -1) {
      const error = new Error(`Student with ID '${studentId}' not found.`);
      error.statusCode = 404;
      error.code = 'STUDENT_NOT_FOUND';
      throw error;
    }

    const current = studentsDb[index];
    const updatedRecord = {
      ...current,
      ...(updateData.firstname && { firstname: updateData.firstname }),
      ...(updateData.lastname && { lastname: updateData.lastname }),
      ...(updateData.gender && { gender: updateData.gender }),
      ...(updateData.department && { department: updateData.department.toUpperCase() }),
      updatedAt: new Date().toISOString()
    };

    studentsDb[index] = updatedRecord;
    return { ...updatedRecord };
  }

  /**
   * Delete a student record by student_id
   * 
   * @param {string} studentId 
   * @returns {Promise<boolean>} True if removed successfully
   */
  async delete(studentId) {
    const index = studentsDb.findIndex(s => s.student_id === studentId);
    if (index === -1) {
      const error = new Error(`Student with ID '${studentId}' not found.`);
      error.statusCode = 404;
      error.code = 'STUDENT_NOT_FOUND';
      throw error;
    }

    studentsDb.splice(index, 1);
    return true;
  }
}

module.exports = new StudentRepository();
