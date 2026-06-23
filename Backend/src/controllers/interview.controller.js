const pdfParse = require("pdf-parse");
const {generateInterviewReport, generateResumePdf} = require("../services/ai.services");
const interviewReportModel = require("../models/interviewReport.model")
async function generateInterviewReportController(req, res){
    const resumeFile = req.file;
    const {selfDescription, jobDescription} = req.body;
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer))).getText();

    const interviewReportByAi = await generateInterviewReport({resume: resumeContent.text, selfDescription, jobDescription})

    const interviewReport = await interviewReportModel.create({
        user:req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    res.status(201).json({
        message: "interview report generated successfully",
        interviewReport
    })
}

async function getInterviewReportByIdController(req, res){
    const {interviewId} = req.params;
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });
    if(!interviewReport) {
        return res.status(404).json({
            message: "interview report not found"
        })
    }
    res.status(200).json({
        message: "interview report fetched successfully",
        interviewReport
    })
}
async function getAllInterviewReportByIdController(req, res){
    const interviewReports = (await interviewReportModel.find({ user: req.user.id })).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");
    res.status(200).json({
        message: "interview reports fetched successfully",
        interviewReports
    })
}

async function generateResumePdfController(req, res){
    const {interviewReportId} = req.params;
    const interviewReport = await interviewReportModel.findById(interviewReportId);

    if(!interviewReport) {
        return res.status(404).json({
            message: "interview report not found"
        })
    }
    const {resume, selfDescription, jobDescription} = interviewReport;
    const {pdfBuffer} = await generateResumePdf({resume, selfDescription, jobDescription});
    res.status(200).json({
        message: "resume PDF generated successfully",
        pdfBuffer
    });
}
module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportByIdController, generateResumePdfController }