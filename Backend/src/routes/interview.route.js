const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");


const interviewRouter = express.Router();
const interviewReportController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")
/**
 * @route POST /api/interview
 * @description Generate interview report based on resume, self description and job description
 * @access private
 */
interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interviewReportController.generateInterviewReportController)

/**
 * @route GET /api/interview/:interviewId
 * @description Get interview report by ID
 * @access private
 */
interviewRouter.get("/report/:interviewId",authMiddleware.authUser,interviewReportController.getInterviewReportByIdController)
 
/**
 * @route GET /api/interview/
 * @description Get all interview reports of the user by interviewId
 * @access private
 */
interviewRouter.get("/",authMiddleware.authUser,interviewReportController.getAllInterviewReportByIdController)
module.exports = interviewRouter;