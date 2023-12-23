import {Router} from 'express'
import { asyncHandler } from '../../services/errorHandling.js'
import * as appointmentController from './appointment.controller.js'
import auth from '../../middleware/auth.js'
import  {endPoint}  from './appointment.endPoint.js'
const router=Router()
router.post('/createAppointment/:doctorId',auth(endPoint.create),asyncHandler(appointmentController.createAppointment))
router.post('/updateStatus/:appointment_id',auth(endPoint.update),asyncHandler(appointmentController.updateStatus))
router.get('/',auth(endPoint.review),asyncHandler(appointmentController.reviewAppointmentScheduled))
router.get('/getAllappointment',auth(endPoint.review),asyncHandler(appointmentController.reviewAllAppointment))
export default router