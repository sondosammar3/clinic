import { Router } from "express";
const router=Router()
import * as doctorController from './doctor.controller.js'
import { asyncHandler } from "../../services/errorHandling.js";
import auth from "../../middleware/auth.js";
import { endPoint } from "./doctor.endPoint.js";
import * as validationdoctor from './doctor.validation.js'
import { validation } from "../../middleware/validation.js";
import fileUpload from "../../services/multer.js"
import { fileValidation } from "../../services/multer.js";
router.post('/signup',auth(endPoint.addDoctor),fileUpload(fileValidation.image).single('image'),validation(validationdoctor.signup),asyncHandler(doctorController.signup))
router.get('/doctorAvailability/:id',asyncHandler(doctorController.doctorAvailability))
router.post('/updateRange',auth(endPoint.updateRange),validation(validationdoctor.updateRange),asyncHandler(doctorController.updateRange))
export default router