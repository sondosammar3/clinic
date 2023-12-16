import { Router } from "express";
import * as authController from '../auth/auth.controller.js'
import { asyncHandler } from "../../services/errorHandling.js";
const router = Router();

router.post('/singup',asyncHandler(authController.singnUp))

export default router
