import axios from "axios"
//function for register api call
// takes an object with username,email and password as parameters as they are sent to the backend
// withCredentials:true is used to send cookies with the request
// returns the response from the server
// export async function register({username,email,password}){

//     try{
//         const response = await axios.post('http://localhost:3000/api/auth/register',{username,email,password},{
//             withCredentials:true
//         })
//     return response.data;
//     }catch(err){
//         console.log(err);
//     }
    
// }
// iski jagah axios ka instance bna ke usme base url and withCredentials set krke use kr skte hai taki baar baar ye options na dene pade har request me

const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})

export async function register({username,email,password}){

    try{
        const response = await api.post('/api/auth/register',{username,email,password},{
            withCredentials:true
        })
    return response.data;
    }catch(err){
        console.log(err);
    }
    
}

export async function login({email,password}){{
    try{
        const response = await api.post('/api/auth/login',{email,password},{
            withCredentials:true
        })
        return response.data;
    }catch(err){
        console.log(err);
    }
}}

export async function logout(){
    try {
        const response = await api.get('/api/auth/logout')
        return response.data;
    } catch (err) {
        console.log(err);
    }
    
}

export async function getMe(){
    try {
        const response = await api.get('/api/auth/get-me')
        return response.data;
    }
    catch(err){
        console.log(err);
    }
}