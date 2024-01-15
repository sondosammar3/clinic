import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const updateMedicalReport=joi.object({
    medicalReport_id: generalFields.id.required(),
    reportText:joi.string().optional(),
    file:joi.object({
        file:joi.array().items(generalFields.file).max(10)
    })
    
 
})

export const cancelMedicalReport=joi.object({
    medicalReport_id: generalFields.id.required(), 
})

export const printMedicalReport=joi.object({
    medicalReport_id: generalFields.id.required(), 
})