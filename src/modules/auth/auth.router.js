import { Router } from "express";
import * as authController from '../auth/auth.controller.js'
import { asyncHandler } from "../../services/errorHandling.js";
import auth from "../../middleware/auth.js";
import { endPoint } from "./auth.endpoint.js";
const router = Router();
router.post('/signup',asyncHandler(authController.singnUp))
router.get('/confirmEmail/:token', asyncHandler(authController.confirmEmail));
router.post('/signin', asyncHandler(authController.signin));
router.patch('/sendCode',auth(endPoint.sendCode), asyncHandler(authController.sendCode));
router.patch('/forgetPassword',auth(endPoint.forgetPassword), asyncHandler(authController.forgetPassword));

router.get('/',asyncHandler(authController.printExcel))
export default router
