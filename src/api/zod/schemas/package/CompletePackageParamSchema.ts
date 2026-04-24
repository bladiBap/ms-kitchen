import { object, string } from 'zod';

export const CompletePackageParamSchema = object({
	packageId: string().trim().min(1),
});
