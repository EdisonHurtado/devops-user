require('dotenv').config();
require('./src/telemetry'); // ← Primero siempre

const app = require('./src/app');
const logger = require('./src/logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`✅ Servidor escuchando en http://localhost:${PORT}`);
  logger.info(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
  logger.info(`🏥 Health check: http://localhost:${PORT}/api/health`);
});