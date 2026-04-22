import { textoProperty } from "@api/zod/common/textoProperty";
import { object } from "zod";

export const VincularManillaSchema = object({
	tagId: textoProperty(5, 100),
});
