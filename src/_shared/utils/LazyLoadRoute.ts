import { container } from 'tsyringe';
import { Request, Response } from 'express';

export const LazyLoadRoute = (controllerClass: any, method: string) => {
	return async (req: Request, res: Response) => {
		const instance: any = container.resolve(controllerClass);
		await instance[method](req, res);
	};
};
