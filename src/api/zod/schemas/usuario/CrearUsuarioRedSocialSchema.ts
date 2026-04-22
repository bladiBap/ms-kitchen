import { object } from "zod";
import { textoProperty } from "@api/zod/common/textoProperty";

export const CrearUsuarioRedSocialSchema = object({
	token: textoProperty(20, 500),
});
