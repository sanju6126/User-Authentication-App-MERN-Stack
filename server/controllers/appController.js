import UserModel from '../model/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';
import otpGenerator from 'otp-generator';


// middleware for verifying user before loggin in
export async function verifyUser(req,res,next){
    try {
        //we are going to make this middleware available for get and post request
        //when there will be a GET request we will get the data from req.query
        //and if there will a POST or PUT request we will get the data from req.body
        const {username} = req.method == "GET" ? req.query : req.body; 

        //check the user existence
        let exist = await UserModel.findOne({username});
        if(!exist) return res.status(404).send({error : "User not found"});

        //if the user exists in the mongoDB Database then it will call the next function;
        next();

    } catch(error){
        return res.status(404).send({error:"Authentication Error"});
    }
}




// POST: http://localhost:8080/api/register
export async function register(req, res) {
    try {
        // De-Structuring all the data that the User enters in the Request Body/Form(in Register frontend)
        const {username,password,profile,email} = req.body;

        //check if username already exists. If exists we return a promise
        const existUsername = new Promise((resolve,reject)=>{
            UserModel.findOne({username},function(err,user){
                if(err) reject(new Error(err));
                if(user) reject({error:"Please use unique username"});
            })
            // If username not found in the database we return a promise
            resolve();
            
        }); 

        const existEmail = new Promise((resolve,reject)=>{
            UserModel.findOne({email},function(err,email){
                if(err) reject(new Error(err));
                if(email) reject({error:"Please use unique email"});

                resolve();
            })
        })

        Promise.all([existUsername,existEmail])
            .then(()=>{
                if(password){
                    bcrypt.hash(password,10)
                        .then(hashedPassword=>{
                            
                            const user = new UserModel({
                                username,
                                password:hashedPassword,
                                profile:profile || '',    // " " is used to give a deffault value to the profile variable if someone chooses to not to put profile pic
                                email
                            });
                            
                            // return saved result as a response
                            user.save()
                            .then(result=> res.status(201).send({msg:"User Regstered Successfully"}))
                            .catch(error=> res.status(500).send({error}));
                            

                        }).catch(error => {
                            return res.status(500).send({
                                error:"Unable to hash password"

                            })
                        })
                }
            }).catch (error =>{
                return res.status(500).send({error});
            })   



    } 
    catch (error) {
        return res.status(500).send(error);
    }
}


// POST: http://localhost:8080/api/login
export async function login(req, res) {
    const {username, password} = req.body;

    try {

        UserModel.findOne({username})
            .then(user => {
                bcrypt.compare(password,user.password)
                    .then(passwordCheck =>{
                        if(!passwordCheck) return res.status(404).send({error:"Don't have password"});

                        //create a jwt token
                        const token = jwt.sign({  //as a first argument it takes the payload second as jwt secret and thirs as  the expiry time
                                userId:user._id,
                                username:user.username,
                            },ENV.JWT_SECRET, {expiresIn:"24h"});    
                        
                        return res.status(200).send({
                            msg:"Login successful...",
                            username:user.username,
                            token
                        })
                    
                    })
                    .catch(error =>{
                        return res.status(404).send({error:"Password does not match"});
                    });
            })
            .catch(error =>{
                return res.status(404).send({error:"Username not found"});
            });
    } catch (error) {
        return res.status(500).send({error});
    }

}


// POST: http://localhost:8080/api/user/example123
export async function getUser(req, res) {
    const {username} = req.params;
    
    try {

        //if the variable is empty, nothing is passed inside it
        if(!username) return res.status(501).send({error:"Invalid Username"}); 
        
        //if the varialbe contains something
        UserModel.findOne({username},function(err,user){
            if(err) return res.status(500).send({err});   //if some error occurs while executing
            if(!user) return res.status(500).send({error: "Couldn't find the User"});  //if user is not found in the database
            
            //destructuring the password from user and saving the rest of the values inside the REST variable 
            // const {password,...rest} = user; 

            //since the above statement also returned the un-necessary mongoose data so we have to remove it 
            //to remove it we have taken the data and converted into JSON and assigned to new object
            const { password, ...rest } = Object.assign({},user.toJSON());         
            return res.status(200).send(rest);  //if the user is found them return the user
        })

    } catch (error){
        return res.status(404).send({error : "Cannot find User Data"})
    }

}


// PUT: http://localhost:8080/api/updateUser
// export async function updateUser(req, res) {
//     try {

//         const id = req.query.id;

//         if(id){
//             const body = req.body;   //the new data that we want to update instead of the old one

//             //update the data
//             UserModel.updateOne({_id: id}, body,function(err,data){
//                 if(err) throw err;
                
//                 return response.status(201).send({ msg : "Record Updated...!"});
//             })
//         } else {
//             return res.status(201).send({ error : "User not found"});
//         }

//     } catch (error){
//         return res.status(401).send({ error });
//     }
// }

export async function updateUser(req,res){
    try {
        
        // const id = req.query.id;
        const { userId } = req.user;

        if(userId){
            const body = req.body;
            console.log(body);

            // update the data
            UserModel.updateOne({ _id : userId }, body, function(err, data){
                if(err) throw err;

                return res.status(201).send({ msg : "Record Updated...!"});
            })

        }else{
            return res.status(401).send({ error : "User Not Found...!"});
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}



// GET: http://localhost:8080/api/generateOTP
export async function generateOTP(req, res) {
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({code: req.app.locals.OTP})
}
//we have to make app locals variable so that we can access the generated OTP to verify the OTP in verifyOTP API mentioned below 



// GET: http://localhost:8080/api/verifyOTP
export async function verifyOTP(req, res) {
    const {code} = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true;
        return res.status(201).send({ msg: 'Verified Successfully' });
    }
    return res.status(400).send({ error: "Invalid OTP" });
}


// successfully redirect user when OTP is valid
// GET: http://localhost:8080/api/createResetSession
export async function createResetSession(req, res) {
    res.json('createResetSession route')
}



// update the password when we have valid session
// GET: http://localhost:8080/api/resetPassword
export async function resetPassword(req, res) {
    try {
        if(!req.app.locals.resetSession) return res.status(404).send({error : "Session Expired"})
        //the above line will ensure that we can only reset the password through the OTP generation procedure not directly
        //if anyone tries to reset it directly then it will show "SESSION EXPIRED"

        const {username,password} = req.body;

        try {

            UserModel.findOne({ username })
                .then(user => {
                    bcrypt.hash(password,10)
                        .then(hashedPassword => {
                            UserModel.update({username : user.username},
                            { password : hashedPassword}, function(err,data){
                                if (err) throw err;
                                return res.status(201).send({msg : "Record updated successfully"})
                            });
                        })
                        .catch( e => {
                            return res.status(500).send({error:"Unable to hash Password"});
                        })
                })
                .catch(error => {
                    return res.status(404).send({error:"Username not found"});
                })

        } catch (error) {
            return response.status(500).send({error});
        }

    } catch (error) {
        return response.status(401).send({error});
    }
}