import User from "../models/auth.model.js"
import OTP from "../models/OTP.js";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "../utils/email.js";



export const registerUser = async (req, res) => {
    console.log("start")
    const { name, email, password } = req.body;
    let userExists = await User.findOne({ email});
    if(userExists){
        return res.status(400).json({error:'User already exists'});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

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
};

//Login User

exports.loginUser = async(req,res)=>{
    const {email,password}= res.body;

    const user = await User.findone({email});
    if(!user){
        return res.status(400).json({error:'Invalid cradentials, Please Sign Up first'});
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).json({error:'Invalid cradentials'});
    }


isMatch(!user.isVerified){
    
}





    res.status(200).json({
        message:'Login successful',
        user: {
            
        }
    })

}