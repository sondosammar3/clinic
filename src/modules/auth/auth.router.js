import { Router } from "express";
import * as authController from '../auth/auth.controller.js'
import { asyncHandler } from "../../services/errorHandling.js";
const router = Router();

router.post('/signup',asyncHandler(authController.singnUp))
router.get('/confirmEmail/:token', asyncHandler(authController.confirmEmail));
router.post('/signin', asyncHandler(authController.signin));
router.patch('/sendCode', asyncHandler(authController.sendCode));
router.patch('/forgetPassword', asyncHandler(authController.forgetPassword));
export default router
