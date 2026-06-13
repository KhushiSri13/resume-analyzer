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


module.exports = interviewRouter;