import { object } from "zod";
import { correoProperty } from "@api/zod/common/correoProperty";
import { textoProperty } from "@api/zod/common/textoProperty";

export const ActualizarUsuarioSchema = object({
	nombre: textoProperty().optional(),
	apellido: textoProperty().optional(),
	correo: correoProperty.optional(),
}).refine(
	(data) => {
		return data.nombre !== undefined || data.apellido !== undefined || data.correo !== undefined;
	},
	{
		message: "Al menos un campo (nombre, apellido o correo) debe ser proporcionado",
	},
);
