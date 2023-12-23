import {Router} from 'express'
import { asyncHandler } from '../../services/errorHandling.js'
import * as appointmentController from './appointment.controller.js'
import auth from '../../middleware/auth.js'
import  {endPoint}  from './appointment.endPoint.js'
const router=Router()
router.post('/createAppointment/:doctorId',auth(endPoint.create),asyncHandler(appointmentController.createAppointment))
export default router