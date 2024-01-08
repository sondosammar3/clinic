import { Router } from "express";
const router=Router()
import * as invoiceController from './invoice.controller.js'
import { asyncHandler } from "../../services/errorHandling.js";
import auth from "../../middleware/auth.js";
import { endPoint } from "./invoice.endPoint.js";
import * as validationinvoice from './invoice.validation.js'
import { validation } from "../../middleware/validation.js";
//doctor
router.get('/getallInvoice_Doctor',auth(endPoint.getallInvoice_Doctor),asyncHandler(invoiceController.getallInvoice_Doctor))
//user
router.get('/getallInvoice_User',auth(endPoint.getallInvoice_User),asyncHandler(invoiceController.getallInvoice_User))

//doctor
router.post('/updatePriceOrStatus/:invoice_id',auth(endPoint.update),validation(validationinvoice.updatePriceOrStatus),asyncHandler(invoiceController.updatePriceOrStatus))
//doctor
router.post('/cancelInvoice/:invoice_id',auth(endPoint.cancelInvoice),validation(validationinvoice.cancelInvoice),asyncHandler(invoiceController.cancelInvoice))

//****Print****
router.get('/printInvoice/:invoice_id',auth(endPoint.printInvoice),asyncHandler(invoiceController.printInvoice))





export default router