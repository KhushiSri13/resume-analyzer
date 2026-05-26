const { Router } = require("express")

const authRouter = Router();
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")
// jsdoc comments used for documentation by ide
/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register" ,authController.registerUserController)
/**
 * @route POST /api/auth/login
 * @description login user
 * @access Public
 */
authRouter.post("/login" ,authController.loginUserController)
/**
 * @route GET /api/auth/logout
 * @description logout user by blacklisting the token
 * @access Public
 */
authRouter.get("/logout", authController.logoutUserController);
/**
 * @route GET /api/auth/get-me
 * @description get user details of logged in user
 * @access Private
 */
authRouter.get("/get-me" , authMiddleware.authUser , authController.getMeController)
module.exports = authRouter