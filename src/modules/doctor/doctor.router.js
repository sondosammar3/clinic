import { Router } from "express";
const router=Router()
import * as doctorController from './doctor.controller.js'
import { asyncHandler } from "../../services/errorHandling.js";
import auth from "../../middleware/auth.js";
import { endPoint } from "./doctor.endPoint.js";
router.post('/signup',auth(endPoint.addDoctor),asyncHandler(doctorController.signup))
router.get('/doctorAvailability/:id',asyncHandler(doctorController.doctorAvailability))

export default router