import { roles } from "../../middleware/auth.js";
export const endPoint={
    medicalReport_Doctor:[roles.Doctor],
    medicalReport_User:[roles.User],
    updateMedicalReport:[roles.Doctor],
    cancelMedicalReport:[roles.Doctor],
    printMedicalReport:[roles.Doctor]
}