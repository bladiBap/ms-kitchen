import * as z from 'zod';

export function issuesToString(error: z.core.$ZodError) {
	return error.issues
		.map((iss) => {
			const path = iss.path.length ? iss.path.join('.') : '(root)';
			return `${iss.message}${path ? ` en ${path}` : ''}`;
		})
		.join('\n');
}
