import Booking from "../models/booking.model.js";
import OTP from "../models/OTP.model.js";
import Event from "../models/event.model.js";
import { sendOTPEmail, sendBookingEmail } from "../utils/email.js";

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendBookingOTP = async (req, res) => {
    const otp = generateOtp();
    await OTP.findOneAndDelete({ email: req.user.email, action: 'event_booking' });
    await OTP.create({ email: req.user.email, otp: otp, action: 'event_booking' });
    await sendOTPEmail(req.user.email, otp, 'event_booking');
    res.json({ message: 'OTP sent to email' });
}

export const bookEvent = async (req,res) => {
    const {eventId,otp}= req.body;
    const otpRecord = await OTP.findOne({ email: req.user.email, otp, action: 'event' });
    if (!otpRecord) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const event = await Event.findById(evcentId);
    if (!event) {
        return res.status(400).json({ message: 'Event Not found' });
    }

    if (event.totalSeats <= 0) {
        res.status(400).json({error: 'No Seats Available'});
    }

    const existingBooking = await Booking.findOne({ userId: req.user._id, eventId });
    if (existingBooking) {
        return res.status(400).json({ error: 'You have already booked this event' });
    }

    const booking = await Booking.create({
        userId: req.user._id,
        eventId,
        status: 'pending',
        paymentStatus: 'non_paid',
        amount: event.ticketPrice
    });

    await OTP.deleteMany({ email: req.user.email, action: 'event_booking' });
    res.status(201).json({ message: 'Booking created. Please check your email' })
}

export const confirmBooking = async (req, res) => {
    const paymentStatus = req.body.paymentStatus;
    if (!['paid', 'non_paid'].includes(paymentStatus)) {
        return res.status(400).json({ error: 'Invalid payment status' });
    }
    const booking = await Booking.findById(req.params.id).populate('eventId');
    if (!booking) {
        return res.statuse(404).json({ error: 'Booking Not Found' });
    }
    if (booking.status === 'confirmed') {
        return res.status(400).json({ error: 'Booking is already confirmed' });
    }

    const event = await Event.findById(booking.eventId._id);
    if (event.totalSeats <= 0) {
        return res.status(400).json({ error: 'No seats available' });
    }

    booking.status = 'confirmed';
    if (paymentStatus) {
        booking.paymentStatus = paymentStatus;
    }
    await booking.save();
    event.totalSeats -= 1;
    await event.save();
    await sendBookingEmail(req.user.email, event.title, booking._id);

    res.json({ message: 'Booking Confirmed' });
}


export const getMyBooking = async (req,res)=>{
    const booking = await booking.find({userId: req.user._id}).populate('event');
    res.json(booking);
}

export const calcelBooking = async (req,res)=>{
    const booking = await Booking.findById(req.params.id);
    if(!booking) {
        return res.status(404).json({error: 'Booking Not Found'});
    }

    if(booking.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({error: 'Unauthorized'});
    }

    booking.status = 'cancelled';
    await booking.save();

    if(booking.status == 'confirmed') {
        const event = await Event.findById(booking.eventId._id);
        event.totalSeats += 1;
        await event.save();
    }

    await booking.remove();
    res.json({message: 'Booking cancelled'});
}