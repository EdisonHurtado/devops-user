const express = require('express');
const router = express.Router();

const startTime = Date.now();

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