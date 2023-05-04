// if we don't use this authorization then any user will just need the ID value to make a PUT request thorugh the ID that we get when we make a GET request.
// so to avoid this we will make use of TOKENS that we get when we make a LOGIN request. 

import jwt  from "jsonwebtoken";
import ENV from '../config.js';


//since it is default async function that's why it's not necessary to give this function a NAME.
export default async function Auth(req,res,next){
    try {

        //access authorize header to validate request ---> this just means that to validate our request we are briging the Auth-header in play
        const token = req.headers.authorization.split(" ")[1];    //once we generate the token we access it using authorization property

        //retrieve the user details of the logged in user
        const decodedToken = await jwt.verify(token,ENV.JWT_SECRET); 
        req.user = decodedToken;

        // res.json(decodedToken);
        next(); 
        
    } catch (error){
        res.status(401).json({error : "Authentication Failed"});
    }

}

export function localVariables(req,res,next){
    //this variable is made only when there is a need to reset OTP
    req.app.locals = {
        OTP : null,
        resetSession : false
    }
    next()
}