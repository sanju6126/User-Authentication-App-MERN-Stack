import { Router  } from 'express';
const router = Router();

// import all controllers
import * as controller from '../controllers/appController.js';




// POST Methods
router.route('/register').post(controller.register);     //register user
// router.route('/registerMail').post();                //send the mail
router.route('/authenticate').post((req,res)=> res.end());       //authenticate user
router.route('/login').post(controller.verifyUser,controller.login);              //login in app
//before logging in it will first verufy the user and if the result is positive it will move ahead to  login using next function

// GET Methods
router.route('/user/:username').get(controller.getUser);      //user with username
router.route('/generateOTP').get(controller.generateOTP);         //generate random OTP
router.route('/verifyOTP').get(controller.verifyOTP);           //verify generated OTP
router.route('/createResetSession').get(controller.createResetSession);  //reset all the variables



// PUT Methods
router.route('/updateUser').put(controller.updateUser);          //is use to update the user profile
router.route('/resetPassword').put(controller.resetPassword);       //use to reset the password








export default router;