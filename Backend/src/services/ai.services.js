const { GoogleGenAI } = require( "@google/genai");
const {z} = require("zod")
const {zodToJsonSchema} = require("zod-to-json-schema")
const puppeteer = require("puppeteer");
const ai = process.env.GOOGLE_GENAI_API_KEY ? new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
}) : null;

function ensureAiClient() {
    if (!ai) {
        throw new Error("GOOGLE_GENAI_API_KEY is not set. Please configure the backend environment variable before generating reports.");
    }
}

// async function invokeGeminiAi(){
//     const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents:"hello gemini! explain what is interview?"
//     });
//     console.log(response.text);
// }
const interviewReportSchema = z.object({
    matchScore : z.number().describe("The match score between the candidate's resume and the job describe, on a scale of 0 to 100"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question that can be asked during the interview"),
        intention: z.string().describe("The intention behind the technical question"),
        answer: z.string().describe("how to answer this question, what points to cover,what approach to take while answering this question")
    })),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question that can be asked during the interview"),
        intention: z.string().describe("The intention behind the behavioral question"),
        answer: z.string().describe("how to answer this question, what points to cover,what approach to take while answering this question")
    })),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill that is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap i.e. how important is it to address this skill gap")

    })).describe("List of skill gaps that the candidate has, along with the severity of each skill gap"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day of the week"),
        focus: z.string().describe("The area of focus for that day"),
        tasks: z.array(z.string().describe("The tasks to be completed on that day"))
    })).describe("A day-wise preparation plan for the candidate to follow in order to improve their chances of success in the interview"),
    title: z.string().describe("The title of the job for which the interview report is being generated")
})
function extractTextFromGeminiResponse(response) {
    if (typeof response?.text === "string" && response.text.trim()) {
        return response.text;
    }

    const parts = response?.candidates?.[0]?.content?.parts ?? [];
    return parts.map((part) => part?.text || "").join("").trim();
}

function parseGeminiJsonResponse(response) {
    const responseText = extractTextFromGeminiResponse(response);
    const cleanedText = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

    return JSON.parse(cleanedText);
}

function toArray(value) {
    if (Array.isArray(value)) {
        return value;
    }

    if (value && typeof value === "object") {
        return [value];
    }

    return [];
}

function normalizeInterviewReportPayload(parsed = {}) {
    return {
        title: typeof parsed.title === "string" && parsed.title.trim() ? parsed.title : "Interview Report",
        matchScore: Number(parsed.matchScore ?? parsed.match_score ?? 0),
        technicalQuestions: toArray(parsed.technicalQuestions ?? parsed.technical_questions).map((q) => ({
            question: q?.question ?? "",
            intention: q?.intention ?? "",
            answer: q?.answer ?? q?.answer_idea ?? "",
        })),
        behavioralQuestions: toArray(parsed.behavioralQuestions ?? parsed.behavioral_questions).map((q) => ({
            question: q?.question ?? "",
            intention: q?.intention ?? "",
            answer: q?.answer ?? q?.answer_idea ?? "",
        })),
        skillGaps: toArray(parsed.skillGaps ?? parsed.skill_gaps).map((g) => ({
            skill: g?.skill ?? "",
            severity: g?.severity ?? "medium",
        })),
        preparationPlan: toArray(parsed.preparationPlan ?? parsed.preparation_plan).map((p, index) => ({
            day: typeof p?.day === "number" ? p.day : index + 1,
            focus: p?.focus ?? "",
            tasks: Array.isArray(p?.tasks) ? p.tasks : (Array.isArray(p?.activities) ? p.activities : []),
        })),
    };
}

async function generateInterviewReport({resume, selfDescription, jobDescription}) {
    ensureAiClient();

    const prompt = `Generate an interview report based on the following information:\n\nResume: ${resume}\n\nSelf Description: ${selfDescription}\n\nJob Description: ${jobDescription}\n\nThe interview report should include the following sections:\n1. Match Score: A score between 0 and 100 indicating how well the candidate's resume matches the job description.\n2. Technical Questions: A list of technical questions that can be asked during the interview, along with their intentions and answers.\n3. Behavioral Questions: A list of behavioral questions that can be asked during the interview, along with their intentions and answers.\n4. Skill Gaps: A list of skill gaps that the candidate has, along with the severity of each skill gap (low, medium, high).\n5. Preparation Plan: A day-wise preparation plan for the candidate to follow in order to improve their chances of success in the interview.\n\nPlease provide the interview report in JSON format, adhering to the following schema:\n${JSON.stringify(zodToJsonSchema(interviewReportSchema), null, 2)}`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        // model: "gemini-2.0-flash",
        contents: prompt,
        config:{
            responseMimeType: "application/json",
            // responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    });

    const parsed = parseGeminiJsonResponse(response);
    const report = normalizeInterviewReportPayload(parsed);

    console.log(report);

    return interviewReportSchema.parse(report);
    
}
// module.exports = invokeGeminiAi;

async function generatePdfFromHtml(htmlContent){
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        singlePage: true,
        margin: { top: '8mm', bottom: '8mm', left: '8mm', right: '8mm' }
    });
    await browser.close();
    return pdfBuffer;
}
async function generateResumePdf({resume,selfDescription, jobDescription}){
    ensureAiClient();
    
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume PDF"),
    });

    const prompt = `Generate a resume based on the following information:\n\nResume: ${resume}\n\nSelf Description: ${selfDescription}\n\nJob Description: ${jobDescription}\n\n
    the response should be in JSON object with a single field "html" which contains the HTML content of the resume PDF. The HTML should be well-structured and formatted, suitable for generating a PDF document using Puppeteer.
    the content of resume should be in a professional format, with clear sections for the candidate's name, contact information, summary, skills, experience, and education. The HTML should be responsive and visually appealing, with appropriate use of headings, lists, and other HTML elements to enhance readability.
    it should look like a human written resume, with a professional layout and design. The HTML should be compatible with Puppeteer for generating a PDF document.
    you can highlight the content using some colors, but it should be professional and not too flashy. The HTML should be well-structured and formatted, suitable for generating a PDF document using Puppeteer.
    contnt should be ats friendly, and should be optimized for applicant tracking systems (ATS) to ensure that the resume is easily readable and scannable by automated systems used by employers.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config:{
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    });
    const jsonContent = JSON.parse(response.text);

    return await generatePdfFromHtml(jsonContent.html);
}
module.exports = {
    generateInterviewReport,
    generateResumePdf,
    normalizeInterviewReportPayload,
    parseGeminiJsonResponse,
}
