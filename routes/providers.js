const express = require('express');
const router = express.Router();

// In-memory mock DB for demonstration purposes
let providers = [
  {
    id: 'prov1',
    firstName: 'Dr. Emily',
    lastName: 'White',
    specialty: 'General Practice',
    contactNumber: '555-777-8888',
    email: 'emily.w@example.com'
  },
  {
    id: 'prov2',
    firstName: 'Dr. Michael',
    lastName: 'Green',
    specialty: 'Pediatrics',
    contactNumber: '555-999-0000',
    email: 'michael.g@example.com'
  }
];

/**
 * @swagger
 * tags:
 *   - name: Providers
 *     description: API for managing healthcare provider information.
 */

/**
 * @swagger
 * /providers:
 *   get:
 *     summary: Retrieve a list of all healthcare providers
 *     description: Returns a comprehensive list of all registered healthcare providers in the system.
 *     tags: [Providers]
 *     responses:
 *       200:
 *         description: A successful response with a list of providers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Provider'
 *       500:
 *         description: Internal server error.
 */
router.get('/', (req, res) => {
  res.json(providers);
});

/**
 * @swagger
 * /providers/{id}:
 *   get:
 *     summary: Get a specific healthcare provider by ID
 *     description: Retrieves the detailed information of a single provider by ID.
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "prov1"
 *         description: Provider ID
 *     responses:
 *       200:
 *         description: Provider found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Provider'
 *       404:
 *         description: Provider not found.
 */
router.get('/:id', (req, res) => {
  const provider = providers.find(p => p.id === req.params.id);
  if (!provider) {
    return res.status(404).json({ message: `Provider with ID ${req.params.id} not found`, code: 'PROVIDER_NOT_FOUND' });
  }
  res.json(provider);
});

/**
 * @swagger
 * /providers:
 *   post:
 *     summary: Create a new healthcare provider
 *     tags: [Providers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - specialty
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Dr. Sarah"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               specialty:
 *                 type: string
 *                 example: "Dermatology"
 *               contactNumber:
 *                 type: string
 *                 example: "555-222-3333"
 *               email:
 *                 type: string
 *                 example: "sarah.doe@example.com"
 *     responses:
 *       201:
 *         description: Provider created successfully.
 *       400:
 *         description: Missing required fields.
 */
router.post('/', (req, res) => {
  const { firstName, lastName, specialty, contactNumber, email } = req.body;
  if (!firstName || !lastName || !specialty) {
    return res.status(400).json({ message: 'Missing required fields.', code: 'INVALID_INPUT' });
  }

  const newProvider = {
    id: `prov${providers.length + 1}`,
    firstName,
    lastName,
    specialty,
    contactNumber: contactNumber || null,
    email: email || null
  };

  providers.push(newProvider);
  res.status(201).json(newProvider);
});

/**
 * @swagger
 * /providers/{id}:
 *   put:
 *     summary: Update a provider's information
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "prov1"
 *         description: Provider ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Provider updated successfully.
 *       404:
 *         description: Provider not found.
 */
router.put('/:id', (req, res) => {
  const index = providers.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: `Provider with ID ${req.params.id} not found`, code: 'PROVIDER_NOT_FOUND' });
  }

  providers[index] = {
    ...providers[index],
    ...req.body
  };

  res.json(providers[index]);
});

/**
 * @swagger
 * /providers/{id}:
 *   delete:
 *     summary: Delete a healthcare provider
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "prov1"
 *     responses:
 *       204:
 *         description: Provider deleted successfully.
 *       404:
 *         description: Provider not found.
 */
router.delete('/:id', (req, res) => {
  const index = providers.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: `Provider with ID ${req.params.id} not found`, code: 'PROVIDER_NOT_FOUND' });
  }

  providers.splice(index, 1);
  res.status(204).send();
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Provider:
 *       type: object
 *       example:
 *         id: "prov1"
 *         firstName: "Dr. Emily"
 *         lastName: "White"
 *         specialty: "General Practice"
 *         contactNumber: "555-777-8888"
 *         email: "emily.w@example.com"
 *       properties:
 *         id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         specialty:
 *           type: string
 *         contactNumber:
 *           type: string
 *         email:
 *           type: string
 *       required:
 *         - id
 *         - firstName
 *         - lastName
 *         - specialty
 */

module.exports = router;
module.exports.providers = providers;
