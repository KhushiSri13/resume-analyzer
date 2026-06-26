import {getAllInterviewReports,generateInterviewReport,getInterviewReportById, generateResumePdf} from "../services/interview.api"
import {useContext,useEffect} from "react"
import { InterviewContext } from "../interview.context"
import {useParams} from "react-router"
import { useFlash } from "../../../components/FlashProvider"
export const useInterview = () =>{
    const context = useContext(InterviewContext);
    const {interviewId} = useParams();
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }
    const {loading, setLoading, report, setReport, reports, setReports} = context;
    const { showFlash } = useFlash();
    const generateReport = async ({jobDescription,selfDescription,resumeFile}) =>{
        setLoading(true);
        let response = null;
        try{
            response = await generateInterviewReport({jobDescription, selfDescription, resumeFile});
            setReport(response.interviewReport);
            showFlash('Interview report generated successfully.', 'success');
        } catch (error) {
            console.error("Error generating interview report:", error);
            showFlash(error?.response?.data?.message || 'Failed to generate interview report.', 'error');
        } finally {
            setLoading(false);
        }
        return response.interviewReport;
    };
    const getReportById = async (interviewId) =>{
        setLoading(true);
        let response = null;
        try {
            response = await getInterviewReportById(interviewId);
            setReport(response.interviewReport);
        } catch (error) {
            console.error("Error fetching interview report:", error);
            showFlash('Unable to load this interview report.', 'error');
        } finally {
            setLoading(false);
        }
        return response.interviewReport;
    }
    const getAllReports = async () =>{
        setLoading(true);
        let response = null;
        try {
            response = await getAllInterviewReports();
            setReports(response.interviewReports);
        } catch (error) {
            console.error("Error fetching interview reports:", error);
            showFlash('Unable to load recent reports.', 'error');
        } finally {
            setLoading(false);
        }
        return response.interviewReports;
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true);
        try {
            const blob = await generateResumePdf(interviewReportId);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `resume_${interviewReportId}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            showFlash('AI-generated resume downloaded successfully.', 'success');
        } catch (error) {
            console.error(error);
            showFlash('AI-generated resume failed to download. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        }
    }, [interviewId]);
    return {loading, report, reports, generateReport, getReportById, getAllReports, getResumePdf}
}