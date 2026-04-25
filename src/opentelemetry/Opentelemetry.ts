import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { TypeormInstrumentation } from '@opentelemetry/instrumentation-typeorm';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

const sdk = new NodeSDK({
	serviceName: 'ms-kitchen',
	traceExporter: new OTLPTraceExporter({
		// URL de Tempo (usando el puerto gRPC 4317)
		url: 'http://localhost:4317',
	}),
	metricReader: new PeriodicExportingMetricReader({
		// Enviamos métricas al puerto 4317 de Tempo/Prometheus cada 60s
		exporter: new OTLPMetricExporter({
			url: 'http://localhost:4317',
		}),
		exportIntervalMillis: 60000,
	}),
	instrumentations: [
		getNodeAutoInstrumentations(),
		new TypeormInstrumentation(),
	],
});

sdk.start();
