const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const userRoutes = require('./routes/user.routes');
const healthRoutes = require('./routes/health.routes');
const traceMiddleware = require('./middlewares/traceMiddleware');
const logger = require('./logger');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(traceMiddleware); // ← Agregar aquí

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/health', healthRoutes);

// 404 handler
app.use((req, res) => {
  logger.warn(`Not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

// Solo inicia servidor si no está siendo importado (tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
  });
}

module.exports = app;