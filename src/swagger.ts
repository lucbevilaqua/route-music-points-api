import swaggerAutogen from 'swagger-autogen';
import * as dotenv from 'dotenv';

dotenv.config();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/routes.ts'];

const doc = {
  info: {
    version: '1.0.0',
    title: 'Api Route Music Points',
    description: 'API com integracao do spotify',
  },
  host: process.env.PROD_HOST,
  schemes: ['https', 'http'],
  servers: [
    {
      url: process.env.DEV_HOST,
      description: 'Development server',
      templates: {
        scheme: {
          enum: ['https', 'http'],
          default: 'http',
        },
      },
    },
    {
      url: process.env.PROD_HOST,
      description: 'Production server',
      templates: {
        scheme: {
          enum: ['https', 'http'],
          default: 'https',
        },
      },
    },
  ],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    api_key: {
      type: 'apiKey',
      name: 'api_key',
      in: 'header',
    },
  },
};

swaggerAutogen()(outputFile, endpointsFiles, doc).then(async () => {
    await import('./server');
});