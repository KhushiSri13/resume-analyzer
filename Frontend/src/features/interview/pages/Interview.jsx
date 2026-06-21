import React, { useState } from 'react'
import '../style/interview.scss'

const Interview = () => {
  const [activeTab, setActiveTab] = useState('technical')
  const [expandedQuestions, setExpandedQuestions] = useState({})

  // Sample data - replace with actual data from props or API
  const interviewData = {
    matchScore: 88,
    technicalQuestions: [
      {
        question: "Explain the Node.js event loop and how it handles asynchronous I/O operations.",
        intention: "To assess the candidate's understanding of data structures and their applications.",
        answer: "A stack is a linear data structure that follows the Last In First Out (LIFO) principle, where the last element added is the first one to be removed. A queue, on the other hand, follows the First In First Out (FIFO) principle, where the first element added is the first one to be removed."
      },
      {
        question: "How do you optimize a MongoDB aggregation pipeline for high-volume data?",
        intention: "To evaluate database optimization skills.",
        answer: "Use index optimization and proper stage ordering."
      },
      {
        question: "Can you describe the Cache-Aside pattern and when you would use Redis in a Node.js application?",
        intention: "To assess caching strategies.",
        answer: "Cache-Aside pattern involves checking cache first before hitting the database."
      },
      {
        question: "What are the challenges of integrating a monolithic application to a microservice-based architecture?",
        intention: "To evaluate system design knowledge.",
        answer: "Challenges include data consistency, service communication, and deployment complexity."
      }
    ],
    behavioralQuestions: [
      {
        question: "Can you describe a time when you had to work under pressure to meet a deadline?",
        intention: "To evaluate the candidate's ability to handle stress and manage time effectively.",
        answer: "During my internship, I was assigned a project with a tight deadline. I prioritized tasks, created a schedule, and collaborated with my team to ensure we met the deadline successfully."
      }
    ],
    skillGaps: [
      {
        skill: "Manage Docker & Kubernetes",
        severity: "high"
      },
      {
        skill: "Advanced Docker & CI/CD Pipelines",
        severity: "high"
      },
      {
        skill: "Distributed Systems Design",
        severity: "medium"
      },
      {
        skill: "Production-level testing management",
        severity: "low"
      }
    ],
    preparationPlan: [
      {
        day: 1,
        focus: "Review Data Structures and Algorithms",
        tasks: [
          "learn and practice common data structures (arrays, linked lists, stacks, queues, trees, graphs)",
          "solve 5-10 problems on LeetCode related to these data structures",
          "review sorting and searching algorithms"
        ]
      }
    ]
  }

  const toggleQuestion = (index) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const renderContent = () => {
    let questions = []
    let count = 0
    let title = ''

    if (activeTab === 'technical') {
      questions = interviewData.technicalQuestions
      count = questions.length
      title = 'Technical Questions'
    } else if (activeTab === 'behavioral') {
      questions = interviewData.behavioralQuestions
      count = questions.length
      title = 'Behavioral Questions'
    } else if (activeTab === 'roadmap') {
      return (
        <div className="roadmap-container">
          {interviewData.preparationPlan.map((plan, index) => (
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
              <span className="score-number">{interviewData.matchScore}</span>
            </div>
            <p className="score-message">Strong match for this role</p>
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="skillgaps-container">
          <div className="skillgaps-header">SKILL GAPS</div>
          <div className="skill-badges">
            {interviewData.skillGaps.map((gap, index) => (
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