import { createContext, useEffect, useState } from "react";

import { toast } from "react-toastify";
import axios from 'axios'

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {

    //Login state checked by server
    const [login, setLogin] = useState(false);
    const [ loggedUserId, setLoggedUserId ] = useState();

    //Regsiter user fucntion
    const registerUser = async ({ userName, password }) => {
        if (!userName || !password) {
           toast.error("All fields are required");
        } 

        try {
            //send register request
            const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/register`,
                { userName, password }, { withCredentials: true });
            
            if (data.success) {
                toast.success(data.message || "Registration successful");
                setTimeout(() => {
                  window.location.reload();
                }, 2500);
            } else {
                toast.error(data.message || "Registration failed");
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    //Login user fucntion
    const loginUser = async({ userName, password }) => {
        if(!userName || !password) {
            toast.error("All fields are required");
        }

        try {
            //send login request
            const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/login`,
                { userName, password }, { withCredentials: true });
            
            if (data.success) {
                toast.success(data.message || "Login successful");
                setTimeout(() => {
                    window.location.reload();
                },2500);
            } else {
                toast.error(data.message || "Login failed");
            }
            
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error)
        }
    }

    //Check is Logged In
    const checkLoggedIn = async () => {
        try {
            //send login request
            const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/check`, { withCredentials: true });
            
            if (data.success) {
                setLogin(true);
                setLoggedUserId(data.user._id);
            } else {
                setLogin(false);
                toast.error(data.message || "Login failed");
            }
            
        } catch (error) {
            console.log(error)
            setLogin(false)
        }
    }  
    
    //call checkLoggedIn
    useEffect(() => {
        checkLoggedIn();
    },[ login ]);


    const value = {
      registerUser,
      loginUser,
      login,
      loggedUserId,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


export { AuthContextProvider, AuthContext };