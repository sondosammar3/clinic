
 import { roles } from "../../middleware/auth.js";

 export const endPoint={
    create:[roles.User],
    update:[roles.Doctor,roles.Admin],
    review:[roles.Doctor,roles.Admin],
    GetAllAppointments_Patient:[roles.User],
    Cancel_Appointment:[roles.User],
    appointmentsByDate:[roles.Doctor]
 }