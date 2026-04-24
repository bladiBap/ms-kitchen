import { object, string } from 'zod';

export const OrderIdParamSchema = object({
	id: string().trim().min(1),
});
