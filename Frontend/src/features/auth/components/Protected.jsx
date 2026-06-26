import { useAuth } from "../hooks/useAuth";
import React from 'react';
import {Navigate} from 'react-router';

const Protected = ({children}) => {
    const {loading,user} = useAuth();

    if(loading){
        return (<main className="auth-page"><div className="auth-card"><h1>Preparing your workspace...</h1></div></main>)
    }
    if(!user){
        return <Navigate to="/login" replace />;
    }
  return (
    <>{children}</>
  )
}

export default Protected