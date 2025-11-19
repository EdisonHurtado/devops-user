const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Management API",
      version: "1.0.0",
      description: "API para gestión de usuarios con Supabase",
      contact: {
        name: "API Support",
        email: "support@example.com"
      }
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3000",
        description: "Development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./src/routes/*.js"]
};

const specs = swaggerJsdoc(options);

module.exports = specs;