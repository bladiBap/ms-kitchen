import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { TypeormInstrumentation } from '@opentelemetry/instrumentation-typeorm';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

const sdk = new NodeSDK({
	serviceName: 'ms-kitchen',
	traceExporter: new OTLPTraceExporter({
		url: 'http://165.22.148.216:4317',
	}),
	metricReader: new PeriodicExportingMetricReader({
		exporter: new OTLPMetricExporter({
			url: 'http://165.22.148.216:4317',
		}),
		exportIntervalMillis: 60000,
	}),
	instrumentations: [
		getNodeAutoInstrumentations(),
		new TypeormInstrumentation(),
	],
});

sdk.start();
