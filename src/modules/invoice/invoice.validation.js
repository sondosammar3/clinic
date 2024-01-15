import { generalFields } from "../../middleware/validation.js"
import joi from "joi"
export const updatePriceOrStatus = joi.object({
    invoice_id: generalFields.id.required(),
    price: joi.number().optional(),
     status:joi.valid('Pending', 'Paid').optional()
})

export const cancelInvoice = joi.object({
    invoice_id: generalFields.id.required(),
})

export const printInvoice=joi.object({
    invoice_id: generalFields.id.required()
})