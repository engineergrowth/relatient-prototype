const express = require('express');
const app = express();
const { swaggerUi, swaggerSpec } = require('./swagger');

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/appointments', require('./routes/appointments'));
app.use('/providers', require('./routes/providers'));
app.use('/patients', require('./routes/patients'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
