const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { trace } = require('@opentelemetry/api');

const traceExporter = new OTLPTraceExporter({
  url: `${process.env.AXIOM_URL || 'https://api.axiom.co'}/v1/traces`,
  headers: {
    'Authorization': `Bearer ${process.env.AXIOM_TOKEN}`,
    'X-Axiom-Org-Id': process.env.AXIOM_ORG_ID
  }
});

const metricExporter = new OTLPMetricExporter({
  url: `${process.env.AXIOM_URL || 'https://api.axiom.co'}/v1/metrics`,
  headers: {
    'Authorization': `Bearer ${process.env.AXIOM_TOKEN}`,
    'X-Axiom-Org-Id': process.env.AXIOM_ORG_ID
  }
});

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  intervalMillis: 60000
});

const sdk = new NodeSDK({
  traceExporter,
  metricReader,
  instrumentations: [getNodeAutoInstrumentations()],
  serviceName: 'ms-user',
  serviceVersion: '1.0.0'
});

sdk.start();
console.log('📊 OpenTelemetry iniciado');

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('✅ Telemetry shutdown'))
    .catch(err => console.error('❌ Error shutting down telemetry', err))
    .finally(() => process.exit(0));
});

module.exports = { trace };