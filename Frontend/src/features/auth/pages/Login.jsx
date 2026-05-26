import React from 'react'

const Login = () => {
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form action="">
            <div className="input-group">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder='Enter your email' />

            </div>
            <div className="inp">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" placeholder='Enter your password' />
            </div>
            <button className="button primary button">Login</button>
        </form>
      </div>
    </main>
  )
}

export default Login