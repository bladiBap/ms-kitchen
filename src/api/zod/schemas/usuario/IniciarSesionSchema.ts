import { object } from "zod";
import { correoProperty } from "@api/zod/common/correoProperty";
import { contrasenaProperty } from "@api/zod/common/contrasenaProperty";

export const IniciarSesionSchema = object({
	correo: correoProperty,
	contrasena: contrasenaProperty,
});
