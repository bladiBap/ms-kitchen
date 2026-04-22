// import { ZodObject } from "zod";
// import { NextFunction, Request, Response } from "express";
// import { Result } from "@core/results/Result";
// import { Exception } from "@core/results/Exception";
// import { issuesToString } from "@api/zod/issues/issuesToString";

// export const BodySchemaMiddleware = (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
// 	const result = schema.safeParse(req.body);

// 	if (!result.success) {
// 		return res.status(400).json(Result.failure(Exception.ValidationError(issuesToString(result.error))));
// 	}

// 	req.body = result.data;
// 	next();
// };
