import { roles } from "../../middleware/auth.js";

export const endPoint={
    getallInvoice_Doctor:[roles.Doctor],
    getallInvoice_User:[roles.User],
    update:[roles.Doctor],
    cancelInvoice:[roles.Doctor],
    printInvoice:[roles.Doctor]
}