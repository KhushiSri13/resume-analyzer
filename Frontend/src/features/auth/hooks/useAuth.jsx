import {useContext, useEffect} from 'react';
import { AuthContext } from '../auth.context.jsx';
import {login,register,logout,getMe} from '../services/auth.api.jsx'
import { useFlash } from '../../../components/FlashProvider.jsx';
export const useAuth = () => {
    const context = useContext(AuthContext);
    const {user,setUser,loading,setLoading} = context;
    const { showFlash } = useFlash();

    const handleLogin = async ({email,password}) => {

        setLoading(true);
        try{
            const data = await login({email,password});
            setUser(data.user);
            showFlash('Welcome back! You are now logged in.', 'success');
        }
        catch(err){
            console.log(err);
            showFlash(err?.response?.data?.message || 'Login failed. Please try again.', 'error');
        }
        finally{        
            setLoading(false);
        }
    }
    const handleRegister = async ({username,email,password}) => {
        setLoading(true);
        try{
            const data = await register({username,email,password});
            setUser(data.user);
            showFlash('Account created successfully. Welcome aboard!', 'success');
        }
        catch(err){
            console.log(err);
            showFlash(err?.response?.data?.message || 'Registration failed. Please try again.', 'error');
        }
        finally{        
            setLoading(false);
        }
    }
    const handleLogout = async () => {
        setLoading(true);
        try{
            await logout();
            setUser(null);
            showFlash('You have been logged out.', 'success');
        }
        catch(err){
            console.log(err);
            showFlash('Logout failed. Please try again.', 'error');
        }
        finally{        
            setLoading(false);
        }
    }
    useEffect(() => {
        const getAndSetUser = async() => {
            try {
                const data = await getMe();
                setUser(data.user);
            } catch (err) {
                console.log(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        getAndSetUser();
    }, [])
    
    return {user,loading,handleLogin,handleRegister,handleLogout}
}