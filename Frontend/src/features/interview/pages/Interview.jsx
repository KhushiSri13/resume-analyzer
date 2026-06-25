import React, { useEffect, useState } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hook/useInterview'
import { useParams } from 'react-router'

const Interview = () => {
  const [activeTab, setActiveTab] = useState('technical')
  const [expandedQuestions, setExpandedQuestions] = useState({})
  const { report, getReportById, getResumePdf, loading } = useInterview()
  const { interviewId } = useParams()

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId)
    }
  }, [interviewId])

  if(loading || !report) {
    return <main className="loading-container">
      <h1>Loading your interview report...</h1>
    </main>
  }
  const toggleQuestion = (index) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const handleDownloadResume = async () => {
    const reportId = report?._id || report?.id || interviewId

    if (reportId) {
      await getResumePdf(reportId)
    }
  }

  const renderContent = () => {
    let questions = []
    let count = 0
    let title = ''

    if (activeTab === 'technical') {
      questions = report.technicalQuestions
      count = questions.length
      title = 'Technical Questions'
    } else if (activeTab === 'behavioral') {
      questions = report.behavioralQuestions
      count = questions.length
      title = 'Behavioral Questions'
    } else if (activeTab === 'roadmap') {
      return (
        <div className="roadmap-container">
          {report.preparationPlan.map((plan, index) => (
            <div key={index} className="roadmap-item">
              <h3 className="roadmap-day">Day {plan.day}</h3>
              <p className="roadmap-focus">{plan.focus}</p>
              <ul className="roadmap-tasks">
                {plan.tasks.map((task, taskIndex) => (
                  <li key={taskIndex} className="task-item">{task}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )
    }
    
    return (
      <>
        <div className="content-header">
          <h2 className="content-title">{title}</h2>
          <span className="question-count">{count} questions</span>
        </div>
        <div className="questions-container">
          {questions.map((item, index) => (
            <div key={index} className="question-item">
              <button 
                className="question-header"
                onClick={() => toggleQuestion(index)}
              >
                <div className="question-info">
                  <span className="question-number">{String.fromCharCode(65 + index)}</span>
                  <span className="question-text">{item.question}</span>
                </div>
                <span className={`expand-icon ${expandedQuestions[index] ? 'expanded' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedQuestions[index] && (
                <div className="question-details">
                  <div className="detail-section">
                    <p className="detail-label">Intention:</p>
                    <p className="detail-content">{item.intention}</p>
                  </div>
                  <div className="detail-section">
                    <p className="detail-label">Answer:</p>
                    <p className="detail-content">{item.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <main className="interview">
      {/* Left Sidebar */}
      <aside className="interview-sidebar">
        <div className="sections-header">SECTIONS</div>
        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeTab === 'technical' ? 'active' : ''}`}
            onClick={() => setActiveTab('technical')}
          >
            Technical questions
          </button>
          <button 
            className={`nav-item ${activeTab === 'behavioral' ? 'active' : ''}`}
            onClick={() => setActiveTab('behavioral')}
          >
            Behavioral questions
          </button>
          <button 
            className={`nav-item ${activeTab === 'roadmap' ? 'active' : ''}`}
            onClick={() => setActiveTab('roadmap')}
          >
            Road Map
          </button>
          <button
            className="nav-item download-resume-btn"
            onClick={handleDownloadResume}
            disabled={loading}
          >
            <span className="nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3v10" strokeLinecap="round" />
                <path d="m8 9 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 15v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
                <path d="M8 3h4" strokeLinecap="round" />
              </svg>
            </span>
            <span>Download Resume</span>
          </button>
        </nav>
      </aside>

      {/* Center Content */}
      <section className="interview-main">
        <div className="content-area">
          {renderContent()}
        </div>
      </section>

      {/* Right Sidebar - Match Score & Skill Gaps */}
      <aside className="interview-skillgaps">
        {/* Match Score */}
        <div className="match-score-container">
          <div className="match-score-header">MATCH SCORE</div>
          <div className="circular-score">
            <div className="score-circle">
              <span className="score-number">{report.matchScore}</span>
            </div>
            <p className="score-message">Strong match for this role</p>
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="skillgaps-container">
          <div className="skillgaps-header">SKILL GAPS</div>
          <div className="skill-badges">
            {report.skillGaps.map((gap, index) => (
              <button 
                key={index}
                className={`skill-badge skill-${gap.severity}`}
              >
                {gap.skill}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </main>
  )
}

export default Interview