import { textoProperty } from "@api/zod/common/textoProperty";
import { object } from "zod";

export const ActualizarNombreManillaSchema = object({
	nombre: textoProperty(),
});
