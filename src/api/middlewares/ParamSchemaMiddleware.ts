import { ZodObject } from 'zod';
import { issuesToString } from '@api/zod/issues/issuesToString';
import { Exception } from '@core/results/Exception';
import { Result } from '@core/results/Result';
import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line consistent-return
export const ParamSchemaMiddleware = (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
	const result = schema.safeParse(req.params);

	if (!result.success) {
		return res.status(400).json(Result.failure(Exception.ValidationError(issuesToString(result.error))));
	}

	req.params = result.data as Request['params'];
	next();
};
