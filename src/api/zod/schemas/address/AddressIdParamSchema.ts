import { object, string } from 'zod';

export const AddressIdParamSchema = object({
	id: string().trim().min(1),
});
