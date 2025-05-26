const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const yaml = require('js-yaml'); 

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Relatient API Prototype',
      version: '1.0.0',
      description: 'A sample API for demonstrating Relatient\'s scheduling and patient management capabilities.',
    },
    servers: [
      {
        url: 'https://relatient-production.up.railway.app',
        description: 'Production / Live API Server',
      },
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Local development server',
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

const outputPath = path.resolve(__dirname, 'openapi.yaml');

fs.writeFileSync(outputPath, yaml.dump(swaggerSpec), 'utf8'); 

console.log(`OpenAPI spec written to ${outputPath}`);