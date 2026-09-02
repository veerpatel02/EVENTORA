import User from "../models/auth.model.js"
import OTP from "../models/OTP.js";


export const registerUser = async (req, res) => {
    console.log("start")
    const { name, email, password } = req.body;
    try {
        const user = await User.create({
            name,
            email,
            password,
            roler,
        });

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            console.log(`otp for ${email}: ${otp}`); 

            await OTP.create({email, otp, action: 'account_verification'});

            await sendOTPEmail(email, otp, 'account_verification');
            res.status(201).json({
                message: 'User registered successfully. Please chack your email for otp to verify your account.',
                email: user.email
            });

        console.log(user)
        return res.status(201).json({ message: 'User register successfully' })
    } catch (error) {
        console.log(error)
    }
}