//with this file we will be making a request to the APIs

import axios from 'axios';
//Axios will make sure how to access the APIs in the React Application

import jwt_decode from 'jwt-decode';

// I guess API/endpoints ko call kar rhe hai yaha se
//we are requesting the endpoints from here
//when we make a request to the register end point //



axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN
//instead of using a harcoded value for the server domain...we will be putting it in the .ENV file


//to get the username information using the token
export async function getUsername(){
    const token = localStorage.getItem('token');
    if(!token) return Promise.reject("Cannot find token")
    //to decode and get the user Info from the token we need to install a module named as jwt-decode

    let decode = jwt_decode(token);
    // console.log(decode);
    return decode;
}



//authenticate function
export async function authenticate(username){
    try {
        return await axios.post('/api/authenticate', { username })
    } catch (error) {
        return { error : "Username does not exist" }
    }
}

// get User details
export async function getUser({ username }){
    try {
        const { data } = await axios.get(`/api/user/${username}`);
        return { data }
    } catch (error) {
        return { error : "Password doesn't match...!" }
    }
}


//register user function
export async function registerUser(credentials){
    try {
        const { data : { msg }, status} = await axios.post(`/api/register`,credentials);

        let { username, email } = credentials;

        //send email
        if(status === 201){
            await axios.post('/api/registerMail', { username, userEmail : email, text : msg})
        }
        
        return Promise.resolve(msg); 
    } catch (error) {
        return Promise.reject({error})
    }
}

 
//login function     or u can name the function as login aslo
export async function verifyPassword( {username, password }){
    try {
        if(username){
            const { data } = await axios.post('/api/login', {username, password})
            return Promise.resolve({ data });
        } 
    } catch (error) {
        return Promise.reject({ error : "Password does not match" });
    }
}

// **********as a second argument we want to pass the data that we want to Update

//update user profile function
export async function updateUser(response){
    try {
        //to update user profile we first need get the token from local storage and then pass it to the header
        // and then we pass the thing we need to update in the body
        const token = await localStorage.getItem('token'); 
        // console.log(token);
        const data = await axios.put('/api/updateUser',response , { headers: { 'Authorization' : 'Bearer ' + token}});
        
        console.log(data);
        return Promise.resolve(data);  //this is just to return the data that we get after a successful update
    } catch{
        return Promise.reject({error: "couldn't update profile"});
    }
}



export async function generateOTP(username){
    try {
        const {data : {code},status} = await axios.get('/api/generateOTP',{params : {username: username}});

        // send mail with the OTP
        if(status === 201 ){
            let { data : { email }} = await getUser({username});
            let text = `Your Password Recovery OTP is ${code}. Verify and recover your Password`;
            await axios.post('/api/registerMail', { username, userEmail : email, text, subject : "Password Recovery" });
        }
        return Promise.resolve(code);
    } catch{
        return Promise.reject({ error: "got an error while generating OTP" });
    }
}



//verify OTP
export async function verifyOTP( { username, code}){
    try {
       const { data,status }  = await axios.get('/api/verifyOTP',{ params : { username,code }})
        return { data,status}
    } catch (error){
        return Promise.reject(error);
    }
}



//reset password
export async function resetPassword({ username,password }){
    try {
        const { data, status } = await axios.put('/api/resetPassword',{ username, password });
        return Promise.resolve({data, status}); 
    } catch (error) {
        return Promise.reject(error);
    }


} 




//these are function to make a request to the backend server 