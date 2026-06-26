import React, { useState } from 'react'
import '../auth.form.scss'
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth.jsx'

const Login = () => {
  const navigate = useNavigate();
  const { loading, handleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlesubmit = async (e) => {
    e.preventDefault();
    const success = await handleLogin({ email, password });
    if (success !== false) {
      navigate('/home');
    }
  }

  if (loading) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <h1>Signing you in...</h1>
        </div>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="header-icon">◆</div>
          <h1>Welcome back</h1>
          <p>Sign in to continue creating your interview strategy.</p>
        </div>
        <form onSubmit={handlesubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" placeholder='Enter your email' />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder='Enter your password' />
          </div>
          <button className="button primary-button" type="submit">
            Login
          </button>
        </form>
        <p className="auth-link">Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </main>
  )
}

export default Login