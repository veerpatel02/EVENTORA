import Event from "../models/event.model.js";

// Get All Events
export const getAllEvents = async (req, res) => {
    try {
        const filters = {};

        if (req.query.category) {
            filters.category = req.query.category;
        }

        if (req.query.ticketPrice) {
            filters.ticketPrice = req.query.ticketPrice;
        }

        // Search by title
        if (req.query.search) {
            filters.title = {
                $regex: req.query.search,
                $options: "i",
            };
        }

        const events = await Event.find(filters).sort({ date: 1 });

        // IMPORTANT: Send events to frontend
        res.status(200).json(events);

    } catch (error) {
        console.error("Get events error:", error);

        res.status(500).json({
            error: error.message,
        });
    }
};


// Get Event By ID
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                error: "Event Not Found",
            });
        }

        res.status(200).json(event);

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};


// Create Event
export const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            ticketPrice,
            imageUrl,
            image,
        } = req.body;

        const seats = Number(totalSeats);
        const eventImage = String(imageUrl ?? image ?? "").trim();

        if (!eventImage) {
            return res.status(400).json({
                message: "An event image URL is required.",
            });
        }

        if (!Number.isFinite(seats) || seats <= 0) {
            return res.status(400).json({
                message: "Total seats must be greater than zero.",
            });
        }

        const event = await Event.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats: seats,
            availableSeats: seats,
            ticketPrice: Number(ticketPrice),
            imageUrl: eventImage,
            createdBy: req.user._id,
        });

        return res.status(201).json({
            message: "Event created successfully.",
            event,
        });
    } catch (error) {
        console.error("Create event error:", error);

        return res.status(400).json({
            error: error.message || "Failed to create event.",
        });
    }
};
// export const createEvent = async (req, res) => {
//     const {
//         title,
//         description,
//         date,
//         location,
//         category,
//         totalSeats,
//         ticketPrice,
//         imageUrl,
//     } = req.body;

//     try {
//         const event = await Event.create({
//             title,
//             description,
//             date,
//             location,
//             category,
//             totalSeats,
//             ticketPrice,
//             imageUrl,
//         });

//         res.status(201).json(event);

//     } catch (error) {
//         res.status(400).json({
//             error: error.message,
//         });
//     }
// };


// Update Event
export const updateEvent = async (req, res) => {
    const {
        title,
        description,
        date,
        location,
        category,
        totalSeats,
        ticketPrice,
        imageUrl,
    } = req.body;

    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                date,
                location,
                category,
                totalSeats,
                ticketPrice,
                imageUrl,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!event) {
            return res.status(404).json({
                error: "Event Not Found",
            });
        }

        res.status(200).json(event);

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};


// Delete Event
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                error: "Event Not Found",
            });
        }

        res.status(200).json({
            message: "Event Deleted Successfully",
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};
    

