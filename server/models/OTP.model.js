import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    otp: {
        type: String,
        require: true
    },
    action: {
        type: String,
        enum: ['account_verification','event_booking'],
        require: true
    },
    createAt: {
        type: Date,
        default: Date.now,
        expires: 3000
    }   
});

const OTP = mongoose.model('OTP', otpSchema);

export default OTP