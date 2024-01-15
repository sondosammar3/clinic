import { Router } from "express";
const router=Router()
import * as medicalReportController from './medicalReport.controller.js'
import { asyncHandler } from "../../services/errorHandling.js";
import auth from "../../middleware/auth.js";
import { endPoint } from "./medicalReport.endPoint.js";
import * as medicalReportvalidation from './medicalReport.validation.js'
import { validation } from "../../middleware/validation.js";
import fileUpload from "../../services/multer.js";
import { fileValidation } from "../../services/multer.js";
//doctor
router.get('/getallmedicalReport_Doctor',auth(endPoint.medicalReport_Doctor),asyncHandler(medicalReportController.getallmedicalReport_Doctor))
//user
router.get('/getallmedicalReport_User',auth(endPoint.medicalReport_User),asyncHandler(medicalReportController.getallmedicalReport_User))

//doctor
router.post('/updateMedicalReport/:medicalReport_id',auth(endPoint.updateMedicalReport),
fileUpload(fileValidation.pdf).fields([{ name:'file', maxCount: 10 }]),
validation(medicalReportvalidation.updateMedicalReport),asyncHandler(medicalReportController.updateMedicalReport))


//doctor
router.post('/cancelMedicalReport/:medicalReport_id',auth(endPoint.cancelMedicalReport),
validation(medicalReportvalidation.cancelMedicalReport),
asyncHandler(medicalReportController.cancelMedicalReport))


//********
router.get('/printMedicalReport/:medicalReport_id',auth(endPoint.printMedicalReport),validation(medicalReportvalidation.printMedicalReport),asyncHandler(medicalReportController.printMedicalReport))


export default router