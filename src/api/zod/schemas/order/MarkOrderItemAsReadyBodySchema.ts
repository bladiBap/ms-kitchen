import { coerce, object } from 'zod';

export const MarkOrderItemAsReadyBodySchema = object({
	quantity: coerce.number().int().positive(),
});
