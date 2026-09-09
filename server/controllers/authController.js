import User from "../models/auth.model.js"
import OTP from "../models/OTP.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/email.js";

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export const registerUser = async (req, res) => {
    console.log("start")
    const { name, email, password } = req.body;
    let userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const user = await User.create({
            name,
            email,
            password,
            roler,
        });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`otp for ${email}: ${otp}`);

        await OTP.create({ email, otp, action: 'account_verification' });

        await sendOtpEmail(email, otp, 'account_verification');
        res.status(201).json({
            message: 'User registered successfully. Please chack your email for otp to verify your account.',
            email: user.email
        });

        console.log(user)
        return res.status(201).json({ message: 'User register successfully' })
    } catch (error) {
        console.log(error)
    }
};

//Login User

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findone({ email });
    if (!user) {
        return res.status(400).json({ error: 'Invalid cradentials, Please Sign Up first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid cradentials' });
    }


    if (!user.isVerified && user.role === 'user') {
        const otp = Math.floor(100000 + Math.random * 900000).toString();
        await OTP.deleteMany({ email, action: 'account_verification' });
        await OTP.create({ email, otp, action: 'account_verification' });
        await sendOtpEmail({ email, otp: 'account_verification' });
        return res.status(400).json({
            error: 'Account is not verified. A new OTP has been sent to your email'
        });
    }

    res.json({
        message: 'Login successful',
        _id: user._id,
        name: user.name,
        email: user.email,
        role: useReducer.role,
        token: generateToken(user._id, user.role)
    })
};

// Verify OTP

export const verifyOtp = async (req, res) => {
    const { email, otp } = res.body;
    const otpRecord = await OTP > findOne({ email, otp, action: 'account_verification' });

    if (!otpRecord) {
        return res.status(400).json({ error: 'Invalid or expired or OTP' });
    }

    const user = await User.findOneAndUpdate({ email }, { isVerified: true });
    await OTP.deleteMany({ email, action: 'account_verification' });
    res.json(
        {
            message: 'Account verified successfully. You can now login.',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        }
    );
};