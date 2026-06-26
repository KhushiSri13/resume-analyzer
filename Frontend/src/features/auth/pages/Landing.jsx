import React from 'react'
import { Link } from 'react-router'
import '../../interview/style/home.scss'

const Landing = () => {
  const features = [
    {
      icon: '✨',
      title: 'AI-powered interview strategy',
      description: 'Turn your resume and self-summary into a tailored plan for the role you want.'
    },
    {
      icon: '📊',
      title: 'Skill gap insights',
      description: 'Discover the strengths and areas to improve with a clear match score and coaching cues.'
    },
    {
      icon: '⬇️',
      title: 'Download-ready resume export',
      description: 'Generate and export a polished one-page resume summary directly from your report flow.'
    }
  ]

  return (
    <main className="home landing-page">
      <div className="header">
        <p className="eyebrow">Resume Analyzer</p>
        <h1>
          Build a smarter interview plan from your <span className="highlight">resume</span>
        </h1>
        <p className="subtitle">
          Understand how your profile matches a job description, uncover practical skill gaps,
          and get a tailored roadmap to interview with confidence.
        </p>

        <div className="landing-actions">
          <Link className="action-link primary" to="/login">
            Login
          </Link>
          <Link className="action-link secondary" to="/register">
            Register
          </Link>
        </div>
      </div>

      <section className="landing-card">
        <div className="landing-card__content">
          <h2>What this application does</h2>
          <p>
            Resume Analyzer helps job seekers combine career experience, resume content, and a target role
            to create a focused interview strategy. It highlights how well you align with the position and
            suggests the next steps to strengthen your profile.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Landing
