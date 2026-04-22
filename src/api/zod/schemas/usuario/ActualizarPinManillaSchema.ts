import { pinProperty } from "@api/zod/common/pinProperty";
import { object } from "zod";

export const ActualizarPinManillaSchema = object({
	nuevoPin: pinProperty,
});
