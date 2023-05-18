//inside this file we are going to create a Authorizeed Router


import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";

export const AuthorizeUser = ({ children}) => {
    const token  = localStorage.getItem('token');

    if(!token){   //if user is not authorized
        return <Navigate to={'/'} replace={true}></Navigate>
    }

    return children;  //if user is authorized
}


export const ProtectRoute = ({ children }) => {
    const username = useAuthStore.getState().auth.username;
    if(!username){
        return <Navigate to={'/'} replace={true}></Navigate>
    }

    return children;
}