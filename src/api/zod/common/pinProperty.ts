import { string } from "zod";

export const pinProperty = string().trim().length(4).regex(/^\d+$/, { message: "El pin debe contener solo números" });
