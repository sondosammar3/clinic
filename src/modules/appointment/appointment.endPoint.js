
 import { roles } from "../../middleware/auth.js";

 export const endPoint={
    create:[roles.User],
    update:[roles.Doctor,roles.Admin],
    review:[roles.Doctor,roles.Admin]
 }