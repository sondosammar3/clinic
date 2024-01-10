
 import { roles } from "../../middleware/auth.js";

 export const endPoint={
    create:[roles.User],
    update:[roles.Doctor],
    review:[roles.Doctor],
    GetAllAppointments_Patient:[roles.User],
    Cancel_Appointment:[roles.User],
    appointmentsByDate:[roles.Doctor]
 }