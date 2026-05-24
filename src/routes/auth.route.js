const { Router } = require("express")

const authRouter = Router();
const authController = require("../controllers/auth.controller")
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
module.exports = authRouter