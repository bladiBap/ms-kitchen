import { coerce } from 'zod';

export const idProperty = (nombre: string) => {
	return coerce
		.number()
		.int()
		.positive()
		.transform((value) => {
			if (isNaN(value)) {
				throw new Error(`El campo ${nombre} debe ser un número válido`);
			}
			return value;
		});
};
