import { roles } from "../../middleware/auth.js"

export const endPoint = {
    sendCode: [roles.User,roles.Doctor],
    forgetPassword: [roles.User,roles.Doctor],

}