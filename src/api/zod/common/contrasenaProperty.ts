import { string } from "zod";

export const contrasenaProperty = string()
	.trim()
	.min(8)
	.max(100)
	.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
		message:
			"La contraseña debe contener al menos una letra mayúscula," +
			" una letra minúscula, un número y un carácter especial (@$!%*?&)",
	});
