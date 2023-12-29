import { roles } from "../../middleware/auth.js";

export const endPoint={
    addDoctor:[roles.Admin],
    updateRange:[roles.Doctor]
}