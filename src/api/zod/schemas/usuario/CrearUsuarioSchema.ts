import { object } from "zod";
import { correoProperty } from "@api/zod/common/correoProperty";
import { contrasenaProperty } from "@api/zod/common/contrasenaProperty";
import { textoProperty } from "@api/zod/common/textoProperty";

export const CrearUsuarioSchema = object({
	nombre: textoProperty(),
	apellido: textoProperty(),
	correo: correoProperty,
	contrasena: contrasenaProperty,
});
