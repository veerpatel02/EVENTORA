import express from 'express'
import { registerUser } from '../controllers/authController.js';
const router = express.Router();
// import { rigisterUser, } from '../controllers/authController.js'


router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.post('/verify-otp', verifyOtp);


export default router;