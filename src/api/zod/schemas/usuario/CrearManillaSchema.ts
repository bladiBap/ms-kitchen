import { textoProperty } from "@api/zod/common/textoProperty";
import { object } from "zod";

export const CrearManillaSchema = object({
	nombre: textoProperty(),
	tagId: textoProperty(5, 100),
});
