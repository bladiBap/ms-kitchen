import { object, string } from 'zod';

export const PackageByOrderParamSchema = object({
	orderId: string().trim().min(1),
});
