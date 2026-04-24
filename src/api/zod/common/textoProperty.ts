import { string } from 'zod';

export const textoProperty = (min: number = 2, max: number = 50) => {
	return string().trim().min(min).max(max);
};
