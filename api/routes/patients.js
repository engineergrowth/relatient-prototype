const express = require('express');
const router = express.Router();

// In-memory mock DB for demonstration purposes
let patients = [
  {
    id: 'pat1',
    firstName: 'Frank',
    lastName: 'White',
    dateOfBirth: '1985-03-20',
    contactNumber: '555-555-555',
    email: 'frank@aol.com',
  },
  {
    id: 'pat2',
    firstName: 'Bob',
    lastName: 'Johnson',
    dateOfBirth: '1992-11-05',
    contactNumber: '555-333-4444',
    email: 'bob@aol.com',
  },
];

/**
 * @swagger
 * tags:
 *   - name: Patients
 *     description: API for managing patient information.
 */

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Retrieve a list of all patients
 *     description: Returns a comprehensive list of all registered patients in the system.
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: A successful response with a list of patients.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Patient'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', (req, res) => {
  res.json(patients);
});

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get a specific patient by ID
 *     description: Retrieves the detailed information of a single patient using their ID.
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "pat1"
 *         description: The patient ID.
 *     responses:
 *       200:
 *         description: Patient retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ message: `Patient with ID ${req.params.id} not found`, code: 'PATIENT_NOT_FOUND' });
  }
  res.json(patient);
});

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create a new patient
 *     description: Registers a new patient in the system.
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - dateOfBirth
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Alice"
 *               lastName:
 *                 type: string
 *                 example: "Smith"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               contactNumber:
 *                 type: string
 *                 example: "555-111-2222"
 *               email:
 *                 type: string
 *                 example: "alice@example.com"
 *     responses:
 *       201:
 *         description: Patient created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', (req, res) => {
  const { firstName, lastName, dateOfBirth, contactNumber, email } = req.body;
  if (!firstName || !lastName || !dateOfBirth) {
    return res.status(400).json({ message: 'Missing required fields.', code: 'INVALID_INPUT' });
  }

  const newPatient = {
    id: `pat${patients.length + 1}`,
    firstName,
    lastName,
    dateOfBirth,
    contactNumber: contactNumber || null,
    email: email || null,
  };

  patients.push(newPatient);
  res.status(201).json(newPatient);
});

/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Update a patient's information
 *     description: Updates an existing patient record.
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "pat1"
 *         description: The patient ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               contactNumber:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Patient not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', (req, res) => {
  const index = patients.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: `Patient with ID ${req.params.id} not found.`, code: 'PATIENT_NOT_FOUND' });
  }

  patients[index] = {
    ...patients[index],
    ...req.body,
  };

  res.json(patients[index]);
});

/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Delete a patient
 *     description: Deletes a patient record by ID.
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "pat1"
 *         description: The patient ID.
 *     responses:
 *       204:
 *         description: Patient successfully deleted.
 *       404:
 *         description: Patient not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', (req, res) => {
  const index = patients.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: `Patient with ID ${req.params.id} not found.`, code: 'PATIENT_NOT_FOUND' });
  }

  patients.splice(index, 1);
  res.status(204).send();
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       example:
 *         id: "pat1"
 *         firstName: "Frank"
 *         lastName: "White"
 *         dateOfBirth: "1985-03-20"
 *         contactNumber: "555-555-555"
 *         email: "frank@aol.com"
 *       properties:
 *         id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         contactNumber:
 *           type: string
 *         email:
 *           type: string
 *       required:
 *         - id
 *         - firstName
 *         - lastName
 *         - dateOfBirth
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         code:
 *           type: string
 */

module.exports = router;
module.exports.patients = patients;
