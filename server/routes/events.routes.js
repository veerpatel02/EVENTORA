import express from "express";

import { protect, admin } from "../middleware/auth.js"
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../controllers/eventController.js"
const router = express.Router();


//Get All Event

router.get('/', getAllEvents);

//Get Event by Id

router.get('/:id', getEventById);

// Create Event (Admin Only)

router.post("/", protect, admin, createEvent);

// Update Event (Admin Only)

router.put("/:id", protect, admin, updateEvent);

// Delete Event (Admin Only)

router.delete("/:id", protect, admin, deleteEvent);

export default router;

