const express = require('express');
const router = express.Router();
const patientsModule = require('./patients'); 
const providersModule = require('./providers');

const patients = patientsModule.patients;
const providers = providersModule.providers;

// In-memory mock DB for demonstration purposes
let appointments = [
  {
    id: 'app1',
    patientId: 'pat1',
    providerId: 'prov1',
    date: '2025-06-15T10:00:00Z',
    type: 'Check-up',
    status: 'scheduled',
  },
  {
    id: 'app2',
    patientId: 'pat2',
    providerId: 'prov2',
    date: '2025-06-16T14:30:00Z',
    type: 'Follow-up',
    status: 'scheduled',
  },
];

/**
 * @swagger
 * tags:
 *   - name: Appointments
 *     description: Endpoints for managing patient appointments and scheduling workflows.
 */

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Retrieve a list of all appointments
 *     description: Returns a comprehensive list of all scheduled appointments within the system.
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: A successful response with a list of appointments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', (req, res) => {
  res.json(appointments);
});

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get a specific appointment by ID
 *     description: Retrieves the details of a single appointment using its unique identifier.
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "app1"
 *         description: The unique identifier of the appointment.
 *     responses:
 *       200:
 *         description: Appointment found and returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', (req, res) => {
  const appt = appointments.find(a => a.id === req.params.id);
  if (!appt) {
    return res.status(404).json({ message: `Appointment with ID ${req.params.id} not found`, code: 'APPOINTMENT_NOT_FOUND' });
  }
  res.json(appt);
});

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - providerId
 *               - date
 *               - type
 *             properties:
 *               patientId:
 *                 type: string
 *                 example: "pat1"
 *               providerId:
 *                 type: string
 *                 example: "prov1"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-15T10:00:00Z"
 *               type:
 *                 type: string
 *                 example: "Check-up"
 *     responses:
 *       201:
 *         description: Appointment created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', (req, res) => {
  const { patientId, providerId, date, type } = req.body;

  if (!patientId || !providerId || !date || !type) {
    return res.status(400).json({ message: 'Missing required fields for appointment creation.', code: 'INVALID_INPUT' });
  }

  const patientExists = patients.some(p => p.id === patientId);
  if (!patientExists) {
    return res.status(400).json({ message: `Patient with ID ${patientId} not found.`, code: 'PATIENT_NOT_FOUND' });
  }

  const providerExists = providers.some(pr => pr.id === providerId);
  if (!providerExists) {
    return res.status(400).json({ message: `Provider with ID ${providerId} not found.`, code: 'PROVIDER_NOT_FOUND' });
  }

  const newAppointment = {
    id: `app${appointments.length + 1}`,
    patientId,
    providerId,
    date,
    type,
    status: 'scheduled',
  };

  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update an existing appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "app1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               providerId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               type:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Appointment not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', (req, res) => {
  const index = appointments.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: `Appointment with ID ${req.params.id} not found.`, code: 'APPOINTMENT_NOT_FOUND' });
  }

  const { patientId, providerId } = req.body;

  if (patientId !== undefined) {
    const patientExists = patients.some(p => p.id === patientId);
    if (!patientExists) {
      return res.status(400).json({ message: `Patient with ID ${patientId} not found.`, code: 'PATIENT_NOT_FOUND' });
    }
  }

  if (providerId !== undefined) {
    const providerExists = providers.some(pr => pr.id === providerId);
    if (!providerExists) {
      return res.status(400).json({ message: `Provider with ID ${providerId} not found.`, code: 'PROVIDER_NOT_FOUND' });
    }
  }

  appointments[index] = { ...appointments[index], ...req.body };
  res.json(appointments[index]);
});

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "app1"
 *     responses:
 *       204:
 *         description: Appointment successfully deleted.
 *       404:
 *         description: Appointment not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', (req, res) => {
  const index = appointments.findIndex(a => a.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: `Appointment with ID ${req.params.id} not found.`, code: 'APPOINTMENT_NOT_FOUND' });
  }

  appointments.splice(index, 1);

  res.status(204).send();
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       example:
 *         id: "app1"
 *         patientId: "pat1"
 *         providerId: "prov1"
 *         date: "2025-06-15T10:00:00Z"
 *         type: "Check-up"
 *         status: "scheduled"
 *       properties:
 *         id:
 *           type: string
 *         patientId:
 *           type: string
 *         providerId:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         type:
 *           type: string
 *         status:
 *           type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         code:
 *           type: string
 */

module.exports = router;
