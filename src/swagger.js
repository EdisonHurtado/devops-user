import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MS-USER API",
      version: "1.0.0",
      description: "Microservicio CRUD de Usuarios",
      contact: {
        name: "API Support"
      }
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo"
      }
    ]
  },
  apis: ["./src/routes/*.js"]
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };