const pdfParseModule = require("pdf-parse");
const {generateInterviewReport, generateResumePdf} = require("../services/ai.services");
const interviewReportModel = require("../models/interviewReport.model")

async function parseResumePdf(buffer) {
    if (typeof pdfParseModule === "function") {
        return pdfParseModule(buffer);
    }

    const { PDFParse } = pdfParseModule;
    const parser = new PDFParse({ data: buffer });

    try {
        return await parser.getText();
    } finally {
        if (typeof parser.destroy === "function") {
            await parser.destroy();
        }
    }
}

async function generateInterviewReportController(req, res){
    try {
        const resumeFile = req.file;
        const {selfDescription, jobDescription} = req.body;

        if (!resumeFile) {
            return res.status(400).json({ message: "Resume file is required" });
        }

        if (!selfDescription || !jobDescription) {
            return res.status(400).json({ message: "Self description and job description are required" });
        }

        const pdfData = await parseResumePdf(resumeFile.buffer);
        const resumeContent = pdfData?.text || "";

        if (!resumeContent.trim()) {
            return res.status(400).json({ message: "Unable to read text from the uploaded resume PDF" });
        }

        const interviewReportByAi = await generateInterviewReport({resume: resumeContent, selfDescription, jobDescription})

        const sanitizedReport = {
            ...interviewReportByAi,
            technicalQuestions: (interviewReportByAi.technicalQuestions || []).map((question) => ({
                question: question?.question || "",
                intention: question?.intention || "",
                answer: typeof question?.answer === "string" && question.answer.trim()
                    ? question.answer.trim()
                    : question?.answer_idea?.trim() || ""
            })),
            behavioralQuestions: (interviewReportByAi.behavioralQuestions || []).map((question) => ({
                question: question?.question || "",
                intention: question?.intention || "",
                answer: typeof question?.answer === "string" && question.answer.trim()
                    ? question.answer.trim()
                    : question?.answer_idea?.trim() || ""
            }))
        }

        const interviewReport = await interviewReportModel.create({
            user:req.user.id,
            resume: resumeContent,
            selfDescription,
            jobDescription,
            ...sanitizedReport
        })

        return res.status(201).json({
            message: "interview report generated successfully",
            interviewReport
        })
    } catch (error) {
        console.error("generateInterviewReportController error:", error);
        return res.status(500).json({
            message: "Failed to generate interview report",
            error: error.message
        })
    }
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
    const pdfBuffer = await generateResumePdf({resume, selfDescription, jobDescription});

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="resume_${interviewReportId}.pdf"`);
    return res.status(200).send(pdfBuffer);
}
module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportByIdController, generateResumePdfController }