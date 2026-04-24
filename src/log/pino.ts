import pino from 'pino';
import { trace, context } from '@opentelemetry/api';

export const logger = pino({
	mixin() {
		const span = trace.getSpan(context.active());
		if (!span) {
			return {};
		}
		const { traceId, spanId } = span.spanContext();
		return { traceId, spanId };
	},
	base: { service: 'mi-node-service' },
	transport: {
		targets: [
			{
				target: 'pino-pretty',
				options: { colorize: true },
				level: 'info'
			},
			{
				target: 'pino-loki',
				options: {
					host: 'http://165.22.148.216:3100',
					labels: { application: 'mi-node-service' },
					batching: true,
					interval: 5,
				},
				level: 'info'
			}
		]
	}
});
