// createContext is used to create a context object that can be used to share data across components without having to pass props down manually at every level.
import { createContext, useState } from "react";
import {getMe} from './services/auth.api.jsx'
// create a context object with default value of null
export const AuthContext = createContext()
// AuthContext will be used to provide and consume authentication related data across the application without prop drilling.
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    

    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}