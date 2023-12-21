import { Router } from "express";
const router=Router()
import * as doctorController from './doctor.controller.js'
import { asyncHandler } from "../../services/errorHandling.js";

router.post('/signup',asyncHandler(doctorController.signup))
router.get('/doctorAvailability/:id',asyncHandler(doctorController.doctorAvailability))
export default router