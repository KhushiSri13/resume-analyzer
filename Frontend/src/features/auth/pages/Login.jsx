import React from 'react'
// import '../auth.form.scss' 
import {useNavigate,Link} from 'react-router';
import {useAuth} from '../hooks/useAuth.jsx'
import {useState} from 'react'

const Login = () => {
  const navigate = useNavigate();
  
  const {loading,handleLogin} = useAuth();

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  const handlesubmit = async (e) => {
    e.preventDefault();
    await handleLogin({email,password});
    navigate("/");
  }

  if(loading){
    return (<main><h1>Loading...</h1></main>)
  }
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
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
        <p>Don't have an account? <Link to="/register">Register</Link> </p>
      </div>
    </main>
  )
}

export default Login