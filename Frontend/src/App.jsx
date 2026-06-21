import React from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.routes.jsx'
// import { AuthProvider } from './features/auth/auth.context.jsx' puri application me auth context provide krne ke liye
import { AuthProvider } from './features/auth/auth.context.jsx'
import { InterviewProvider } from './features/interview/interview.context.jsx'
function App() {
  return (
    <div>
      <AuthProvider>
        <InterviewProvider>
        <RouterProvider router={router}/>
        </InterviewProvider>
      </AuthProvider>
    </div>
  )
}
export default App