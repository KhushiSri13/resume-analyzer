import React,{useState,useRef} from 'react'
import "../style/home.scss"
import {useInterview} from "../interview.context.jsx"
import {useNavigate} from 'react-router'
const Home = () => {

  const {loading,generateReport,reports} = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const resumeInputRef = useRef(null);
  
  const navigate = useNavigate();
  
  const handleGenerateReport = async () =>{
    const resumeFile = resumeInputRef.current.files[0];
    await generateReport({jobDescription, selfDescription, resumeFile});
    navigate(`/interview/${data._id}`);
  }
  return (
    <main className='home'>
      {/* Header Section */}
      <div className="header">
        <h1>Create Your Custom <span className="highlight">Interview Plan</span></h1>
        <p className="subtitle">Let our AI analyze the job requirements and your unique profile to build a winning strategy</p>
      </div>

      {/* Main Interview Setup Section */}
      <div className="interview-container">
        <div className="interview-group">
          
          {/* Left Section - Job Description */}
          <div className="left">
            <div className="section-header">
              <div className="header-icon">◆</div>
              <label htmlFor="jobDescription">Target Job Description</label>
            </div>
            <textarea 
            onChange={(e) => setJobDescription(e.target.value)}
              name="jobDescription" 
              id="jobDescription" 
              placeholder='Paste the job description here...'
              className="job-description-textarea"
            ></textarea>
            <p className="helper-text">↓ Paste here ↓</p>
          </div>

          {/* Right Section - Profile */}
          <div className="right">
            
            {/* Your Profile Header */}
            <div className="section-header">
              <div className="header-icon">◆</div>
              <label htmlFor="profile">Your Profile</label>
            </div>

            {/* Resume Upload */}
            <div className="input-group resume-upload">
              <p className="label-text">Resume <span className="highlight-note">use resume and self description together for best results</span></p>
              <label className="file-label" htmlFor="resume">
                <div className="upload-icon">📤</div>
                <p>Upload Resume</p>
                <p className="file-hint">Click to upload or drag & drop</p>
                <p className="file-size">PDF, DOC, DOCX up to 10 MB</p>
              </label>
              <input ref={resumeInputRef} hidden type="file" name="resume" id="resume" accept=".pdf,.doc,.docx"/>
            </div>

            {/* Self Description */}
            <div className="input-group">
              <label htmlFor="selfDescription" className="textarea-label">Quick Self Description</label>
              <textarea 
                name="selfDescription" 
                id="selfDescription" 
                placeholder='Write a brief summary about yourself, your skills, and experience...'
                className="self-description-textarea"
                onChange={(e) => setSelfDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Info Note */}
            <div className="info-note">
              <span className="note-icon">ⓘ</span>
              <p><strong>Pro Tip:</strong> Using both Resume + Self Description generates a personalized interview plan.</p>
            </div>

            {/* Generate Button */}
            <button 
              className='button primary-button'
              onClick={handleGenerateReport}
              disabled={loading}
            >
              {loading ? "Generating..." : "🚀 Generate My Interview Strategy"}
            </button>
          </div>
          {/*recent reports list*/}
          {
            reports.length > 0 && (
              <div className="recent-reports">
                <div className="section-header">
                  <div className="header-icon">◆</div>
                  <label>Recent Reports</label>
                </div>
                <ul>
                  {reports.map((report) => (
                    <li key={report._id} className="report-item" onClick={() => navigate(`/interview/${report._id}`)}>
                      <h3>{report.jobTitle || "Untitled Report"}</h3>
                      <p className="created-date">Created on: {new Date(report.createdAt).toLocaleDateString()}</p>
                      <p className="match-score">Match Score: {report.matchScore || 0}%</p>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }
        </div>
      </div>
    </main>
  )
}

export default Home