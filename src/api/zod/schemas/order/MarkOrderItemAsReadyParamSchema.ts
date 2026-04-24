import { object, string } from 'zod';

export const MarkOrderItemAsReadyParamSchema = object({
	orderItemId: string().trim().min(1),
});
