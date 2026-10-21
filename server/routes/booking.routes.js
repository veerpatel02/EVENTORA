import express from "express";
import { protect, admin } from "../middleware/auth.js";

import {
    bookingEvent,
    sendBookingOTP,
    getMyBookings,
    getAllBookings,
    confirmBooking,
    cancelBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// Create a booking
router.post("/", protect, bookingEvent);

// Send booking OTP
router.post("/send-otp", protect, sendBookingOTP);

// Get the current user's bookings
router.get("/my", protect, getMyBookings);

// Get all bookings (admin only)
router.get("/", protect, admin, getAllBookings);

// Confirm a booking (admin only)
router.put("/:id/confirm", protect, admin, confirmBooking);

// Cancel a booking
router.delete("/:id", protect, cancelBooking);

export default router;