import Booking from "../models/booking.model.js";
import OTP from "../models/OTP.model.js";
import Event from "../models/event.model.js";

import {
    sendOtpEmail,
    sendBookingEmail,
} from "../utils/email.js";

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send booking OTP
export const sendBookingOTP = async (req, res) => {
    try {
        const otp = generateOtp();

        await OTP.deleteMany({
            email: req.user.email,
            action: "event_booking",
        });

        await OTP.create({
            email: req.user.email,
            otp,
            action: "event_booking",
        });

        await sendOtpEmail(
            req.user.email,
            otp,
            "event_booking"
        );

        return res.status(200).json({
            message: "OTP sent to your email.",
        });
    } catch (error) {
        console.error("Error sending booking OTP:", error);

        return res.status(500).json({
            message: "Failed to send booking OTP.",
        });
    }
};

// Create a booking after OTP verification
export const bookingEvent = async (req, res) => {
    try {
        const { eventId, otp } = req.body;

        if (!eventId || !otp) {
            return res.status(400).json({
                message: "Event ID and OTP are required.",
            });
        }

        const otpRecord = await OTP.findOne({
            email: req.user.email,
            otp: String(otp),
            action: "event_booking",
        });

        if (!otpRecord) {
            return res.status(400).json({
                message: "Invalid or expired OTP.",
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found.",
            });
        }

        if (event.availableSeats <= 0) {
            return res.status(400).json({
                message: "No seats available.",
            });
        }

        // Prevent duplicate active bookings for the same event
        const existingBooking = await Booking.findOne({
            userId: req.user._id,
            eventId,
            status: { $ne: "cancelled" },
        });

        if (existingBooking) {
            return res.status(400).json({
                message: "You already have a booking for this event.",
            });
        }

        const booking = await Booking.create({
            userId: req.user._id,
            eventId,
            status: "pending",
            paymentStatus: "non_paid",
            amount: event.ticketPrice,
        });

        await OTP.deleteMany({
            email: req.user.email,
            action: "event_booking",
        });

        return res.status(201).json({
            message: "Booking created and awaiting admin confirmation.",
            booking,
        });
    } catch (error) {
        console.error("Error creating booking:", error);

        return res.status(500).json({
            message: "Failed to create booking.",
        });
    }
};

// Get the logged-in user's bookings
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            userId: req.user._id,
        })
            .populate("eventId")
            .sort({ bookedAt: -1 });

        return res.status(200).json(bookings);
    } catch (error) {
        console.error("Error getting user bookings:", error);

        return res.status(500).json({
            message: "Failed to get bookings.",
        });
    }
};

// Get ALL bookings for the Admin Dashboard
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("userId", "name email")
            .populate(
                "eventId",
                "title date location totalSeats availableSeats ticketPrice"
            )
            .sort({ bookedAt: -1 });

        return res.status(200).json(bookings);
    } catch (error) {
        console.error("Error getting all bookings:", error);

        return res.status(500).json({
            message: "Failed to get all bookings.",
        });
    }
};

// Confirm a booking (admin-only route)
export const confirmBooking = async (req, res) => {
    try {
        const { paymentStatus } = req.body;

        if (!["paid", "non_paid"].includes(paymentStatus)) {
            return res.status(400).json({
                message: "Invalid payment status.",
            });
        }

        const booking = await Booking.findById(req.params.id)
            .populate("eventId")
            .populate("userId", "name email");

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found.",
            });
        }

        if (booking.status === "confirmed") {
            return res.status(400).json({
                message: "Booking is already confirmed.",
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                message: "A cancelled booking cannot be confirmed.",
            });
        }

        const event = await Event.findById(
            booking.eventId?._id
        );

        if (!event) {
            return res.status(404).json({
                message: "Event not found.",
            });
        }

        if (event.availableSeats <= 0) {
            return res.status(400).json({
                message: "No seats available.",
            });
        }

        // Mark as confirmed
        booking.status = "confirmed";
        booking.paymentStatus = paymentStatus;

        await booking.save();

        // Reduce available seats, not total capacity
        event.availableSeats -= 1;
        await event.save();

        // Email the customer, not the administrator
        try {
            await sendBookingEmail({
                email: booking.userId.email,
                name: booking.userId.name || "there",
                bookingId: booking._id,
                eventName: event.title,
                eventDate: event.date,
                eventTime: event.time,
                location: event.location,
                quantity: 1,
            });
        } catch (emailError) {
            console.error(
                "Booking confirmed, but email failed:",
                emailError
            );
        }

        return res.status(200).json({
            message: "Booking confirmed successfully.",
            booking,
        });
    } catch (error) {
        console.error("Error confirming booking:", error);

        return res.status(500).json({
            message: "Failed to confirm booking.",
        });
    }
};

// Cancel a booking (owner or admin)
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found.",
            });
        }

        const isAdmin = req.user.role === "admin";
        const isOwner =
            String(booking.userId) === String(req.user._id);

        if (!isAdmin && !isOwner) {
            return res.status(403).json({
                message: "You are not authorized to cancel this booking.",
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                message: "Booking is already cancelled.",
            });
        }

        const wasConfirmed = booking.status === "confirmed";

        booking.status = "cancelled";
        await booking.save();

        // Restore an available seat only if it had been reserved
        if (wasConfirmed) {
            const event = await Event.findById(booking.eventId);

            if (event) {
                event.availableSeats = Math.min(
                    Number(event.totalSeats),
                    Number(event.availableSeats || 0) + 1
                );

                await event.save();
            }
        }

        return res.status(200).json({
            message: "Booking cancelled successfully.",
        });
    } catch (error) {
        console.error("Error cancelling booking:", error);

        return res.status(500).json({
            message: "Failed to cancel booking.",
        });
    }
};