const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const apiToken = process.env.API_TOKEN;
const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
const axiomDataset = process.env.AXIOM_DATASET;
const serviceName = process.env.OTEL_SERVICE_NAME;

console.log('🔧 OpenTelemetry Config:');
console.log(`   - Token: ${apiToken ? '✓ Configurado' : '✗ Falta'}`);
console.log(`   - Endpoint: ${otlpEndpoint}`);
console.log(`   - Dataset: ${axiomDataset}`);
console.log(`   - Service: ${serviceName}`);

const traceExporter = new OTLPTraceExporter({
  url: otlpEndpoint,
  headers: {
    'Authorization': `Bearer ${apiToken}`,
    'X-Axiom-Dataset': axiomDataset
  }
});

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  serviceName: serviceName,
  serviceVersion: '1.0.0'
});

sdk.start();
console.log('📊 OpenTelemetry iniciado');
console.log('📤 Exportando traces a Axiom...');

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('✅ Telemetry shutdown'))
    .catch(err => console.error('❌ Error shutting down telemetry', err))
    .finally(() => process.exit(0));
});

module.exports = { trace: require('@opentelemetry/api').trace };