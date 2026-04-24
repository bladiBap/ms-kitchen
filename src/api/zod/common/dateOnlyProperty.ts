import { string } from 'zod';

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const dateOnlyProperty = string()
	.regex(DATE_ONLY_REGEX, 'La fecha debe tener formato YYYY-MM-DD')
	.transform((value) => {
		const [year, month, day] = value.split('-').map(Number);
		return new Date(year!, month! - 1, day, 12, 0, 0, 0);
	});
