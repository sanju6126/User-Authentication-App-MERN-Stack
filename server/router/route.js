import { Router  } from 'express';
const router = Router();

// import all controllers
import * as controller from '../controllers/appController.js';
import { registerMail } from '../controllers/mailer.js';
import Auth, {localVariables} from '../middleware/auth.js';



// POST Methods
router.route('/register').post(controller.register);     //register user
router.route('/registerMail').post(registerMail);                //send the mail
router.route('/authenticate').post(controller.verifyUser, (req,res)=> res.end());       //authenticate user
router.route('/login').post(controller.verifyUser, controller.login);              //login in app
//before logging in it will first verify the user and if the result is positive it will move ahead to  login using next function

// GET Methods
router.route('/user/:username').get(controller.getUser);      //user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP);         //we also need to verify the user before generating random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP);           //verify generated OTP
router.route('/createResetSession').get(controller.createResetSession);  //reset all the variables



// PUT Methods
router.route('/updateUser').put(Auth, controller.updateUser);          //is use to update the user profile....this statement is goinng to first call the middleware AUTH and then the controller
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword);       //use to reset the password








export default router;