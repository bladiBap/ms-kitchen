import { issuesToString } from '@api/zod/issues/issuesToString';
import { Exception } from '@core/results/Exception';
import { Result } from '@core/results/Result';
import { NextFunction, Request, Response } from 'express';
import { ZodObject } from 'zod';

export const QuerySchemaMiddleware = (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
	const result = schema.safeParse(req.query);

	if (!result.success) {
		return res.status(400).json(Result.failure(Exception.ValidationError(issuesToString(result.error))));
	}

	const parsedQuery = result.data as Record<string, unknown>;
	for (const key of Object.keys(req.query)) {
		delete (req.query as Record<string, unknown>)[key];
	}
	Object.assign(req.query as Record<string, unknown>, parsedQuery);
	next();
};
