// import User from "../models/auth.model.js"
// import OTP from "../models/OTP.model.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { sendOtpEmail } from "../utils/email.js";

// const generateToken = (id, role) => {
//     return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
// }

// export const registerUser = async (req, res) => {
//     console.log('1.11');
//     console.log("start")
//     const { name, email, password, role } = req.body;
//     let userExists = await User.findOne({ email });
//     if (userExists) {
//         return res.status(400).json({ error: 'User already exists' });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     try {
//         const user = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//             role,
//         });

//         const otp = Math.floor(100000 + Math.random() * 900000).toString();
//         console.log(`otp for ${email}: ${otp}`);
//         console.log("90")
//         await OTP.create({ email, otp, action: 'account_verification' });
//         console.log("91")
//         await sendOtpEmail(email, otp, 'account_verification');
//         console.log("92")
//         return res.status(201).json({
//             message: 'User registered successfully. Please chack your email for otp to verify your account.',
//             email: user.email
//         });

//         // console.log(user)
//         // return res.status(201).json({ message: 'User register successfully' });
//     } catch (error) {
//         console.log(error)
//     }
// };

// //Login User

// export const loginUser = async (req, res) => {
//     console.log("1")
//     const { email, password } = req.body;
//     console.log("2")

//     const user = await User.findOne({ email });
//     if (!user) {
//         return res.status(400).json({ error: 'Invalid cradentials, Please Sign Up first' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//         return res.status(400).json({ error: 'Invalid cradentials' });
//     }


//     if (!user.isVerified && user.role === 'user') {
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();
//         await OTP.deleteMany({ email, action: 'account_verification' });
//         await OTP.create({ email, otp, action: 'account_verification' });
//         await sendOtpEmail({ email, otp, 'account_verification' });
//         return res.status(400).json({
//             error: 'Account is not verified. A new OTP has been sent to your email'
//         });
//     }

//     res.json({
//         message: 'Login successful',
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         token: generateToken(user._id, user.role)
//     })
// };

// // Verify OTP

// export const verifyOtp = async (req, res) => {
//     const { email, otp } = req.body;
//     const otpRecord = await OTP.findOne({ email, otp, action: 'account_verification' });

//     if (!otpRecord) {
//         return res.status(400).json({ error: 'Invalid or expired or OTP' });
//     }

//     const user = await User.findOneAndUpdate({ email }, { isVerified: true });
//     await OTP.deleteMany({ email, action: 'account_verification' });
//     res.json(
//         {
//             message: 'Account verified successfully. You can now login.',
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             role: user.role,
//             token: generateToken(user._id, user.role)
//         }
//     );
// };


import User from "../models/auth.model.js";
import OTP from "../models/OTP.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/email.js";


// ==========================================
// GENERATE JWT TOKEN
// ==========================================

const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};


// ==========================================
// REGISTER USER
// ==========================================

export const registerUser = async (req, res) => {
    try {
        console.log("Register started");

        const { name, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                error: "User already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
            isVerified: false
        });

        // Generate OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        console.log(`OTP for ${email}: ${otp}`);

        // Remove old OTPs
        await OTP.deleteMany({
            email,
            action: "account_verification"
        });

        // Save new OTP
        await OTP.create({
            email,
            otp,
            action: "account_verification"
        });

        // Send OTP email
        await sendOtpEmail(
            email,
            otp,
            "account_verification"
        );

        return res.status(201).json({
            message:
                "User registered successfully. Please check your email for OTP to verify your account.",
            email: user.email
        });

    } catch (error) {
        console.error("Register error:", error);

        return res.status(500).json({
            error: error.message || "Registration failed"
        });
    }
};


// ==========================================
// LOGIN USER
// ==========================================

export const loginUser = async (req, res) => {
    try {
        console.log("Login started");

        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                error: "Invalid credentials. Please sign up first."
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                error: "Invalid credentials"
            });
        }

        // Check account verification
        if (!user.isVerified && user.role === "user") {

            // Generate new OTP
            const otp = Math.floor(
                100000 + Math.random() * 900000
            ).toString();

            console.log(`Login OTP for ${email}: ${otp}`);

            // Delete old OTP
            await OTP.deleteMany({
                email,
                action: "account_verification"
            });

            // Save new OTP
            await OTP.create({
                email,
                otp,
                action: "account_verification"
            });

            // Send new OTP
            await sendOtpEmail(
                email,
                otp,
                "account_verification"
            );

            return res.status(400).json({
                error:
                    "Account is not verified. A new OTP has been sent to your email.",
                needsVerification: true
            });
        }

        // Generate token
        const token = generateToken(
            user._id,
            user.role
        );

        return res.status(200).json({
            message: "Login successful",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            error: error.message || "Login failed"
        });
    }
};


// ==========================================
// VERIFY OTP
// ==========================================

export const verifyOtp = async (req, res) => {
    try {
        console.log("OTP verification started");

        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                error: "Email and OTP are required"
            });
        }

        // Find OTP
        const otpRecord = await OTP.findOne({
            email,
            otp,
            action: "account_verification"
        });

        if (!otpRecord) {
            return res.status(400).json({
                error: "Invalid or expired OTP"
            });
        }

        // Find and verify user
        const user = await User.findOneAndUpdate(
            { email },
            { isVerified: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        // Delete used OTP
        await OTP.deleteMany({
            email,
            action: "account_verification"
        });

        // Generate token
        const token = generateToken(
            user._id,
            user.role
        );

        return res.status(200).json({
            message:
                "Account verified successfully.",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });

    } catch (error) {
        console.error("OTP verification error:", error);

        return res.status(500).json({
            error:
                error.message ||
                "OTP verification failed"
        });
    }
};