const { trace } = require('../telemetry');

const tracer = trace.getTracer('express-tracer');

const traceMiddleware = (req, res, next) => {
  const span = tracer.startSpan(`${req.method} ${req.path}`);
  
  span.setAttributes({
    'http.method': req.method,
    'http.url': req.url,
    'http.client_ip': req.ip
  });

  res.on('finish', () => {
    span.setAttributes({
      'http.status_code': res.statusCode
    });
    span.end();
  });

  next();
};

module.exports = traceMiddleware;