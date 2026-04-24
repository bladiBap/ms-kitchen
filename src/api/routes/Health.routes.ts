import { Router } from 'express';
// import { logger } from '@/log/pino';

const healthRouter = Router();

healthRouter.get('', (req, res) => {
	// logger.info('Health check endpoint called');
	res.status(200).json({ status: 'ok' });
});

export { healthRouter };
