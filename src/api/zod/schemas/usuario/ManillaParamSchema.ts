import { object } from "zod";
import { idProperty } from "@api/zod/common/idProperty";

export const ManillaParamSchema = object({
	manillaId: idProperty("manillaId"),
});
