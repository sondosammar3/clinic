import { roles } from "../../middleware/auth.js";



export const endPoint={
    addDoctor:[roles.Admin],
    review:[roles.Doctor],
    update:[roles.Doctor]
}