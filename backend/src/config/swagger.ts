import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env.js';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TripSecure AI Enterprise Backend API',
      version: '1.0.0',
      description: 'Production-grade enterprise REST API and Socket.IO real-time documentation for TripSecure AI passenger safety system.',
      contact: {
        name: 'TripSecure Engineering Team',
        email: 'support@tripsecure.ai',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/${env.API_VERSION}`,
        description: 'Development Server',
      },
      {
        url: `https://tripsecure-backend.onrender.com/api/${env.API_VERSION}`,
        description: 'Production Render Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token in the format: Bearer <token>',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Invalid token or unauthorized' },
            error: { type: 'object' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation completed successfully' },
            data: { type: 'object' },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
