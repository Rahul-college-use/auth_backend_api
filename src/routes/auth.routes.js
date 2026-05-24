import { Router } from "express";
import * as authController from '../controllers/auth.controllers.js'

const authRouter = Router();
/** Defualt rooter */

authRouter.get('/',(req,res)=>{
    res.send("api/auth/@demo")
})


/**
 * POST /api/auth/register
 */
authRouter.post('/register',authController.register)


/**
 * GET /api/auth/get-me
 * 
 */
authRouter.get('/get-me',authController.get_me)

/**
 * Get /api/auth/refresh-token
 */
authRouter.get("/refresh-token",authController.refreshToken)

/**
 * Get Logout /api/auth/logout
 */
authRouter.get("/logout",authController.logout)

/* Logout all */
authRouter.get("/logout-all",authController.logoutAll)

/* Login */
authRouter.post("/login",authController.login)

/* Verify Email */
authRouter.post("/verify-email",authController.verifyEmail)

export default authRouter;