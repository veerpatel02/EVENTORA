import express from "express";
import {protect, admin} from "../middleware/auth.js";
import {bookingEvent, sendBookingOTP, getMyBookings, confirmBooking, cancelBooking} from "../controllers/bookingController.js"
const router = express.Router();



router.post('/', protect, bookingEvent);
router.post('/send-otp', protect, sendBookingOTP);
router.get('/my', protect, getMyBookings);
router.put('/:id/confirm', protect, admin, confirmBooking);
router.delete('/:id', protect, cancelBooking);

export default  router;
