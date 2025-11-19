const express = require('express');

const router = express.Router();

const startTime = Date.now();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Verifica el estado del servidor
 *     responses:
 *       200:
 *         description: Servidor en línea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 service:
 *                   type: string
 *                   example: "ms-user"
 *                 timestamp:
 *                   type: string
 *                 uptime:
 *                   type: integer
 */
router.get('/', (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ms-user',
    uptime: uptime
  });
});

module.exports = router;