import joi from "joi"
import { generalFields } from "../../middleware/validation.js"

export const createAppointment=joi.object({
    doctorId:generalFields.id,
    appointmentDate:joi.date().greater('now').required(),
    appointmentTime:joi.string().required(),
    reason:joi.string().max(30).required(),
})

export const updateStatus=joi.object({
    appointment_id:generalFields.id,
    status:joi.string().valid('Scheduled', 'Completed', 'Cancelled', 'No Show').insensitive().required(),
})

export const Cancel_Appointment=joi.object({
    appointmentId:generalFields.id
})

export const appointmentsByDate=joi.object({
    date:joi.date().greater('now').required(),
    page:joi.number().min(1),
    limit:joi.number().min(1)
})