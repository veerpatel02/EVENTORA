// import express from 'express'
// import { loginUser, registerUser } from '../controllers/authController.js';
// const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login', loginUser);
// // router.post('/land', loginUser)
// // router.post('/verify-otp', verifyOtp);


// export default router;

import express from "express";
import {
    registerUser,
    loginUser,
    verifyOtp
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verifyOTP", verifyOtp);

export default router;