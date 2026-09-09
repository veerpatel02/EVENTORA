import Event from "../models/event.model.js";

export const getAllEvent = async (req,res)=>{
    try {

        const filters = {};
        if(req.query.category){
            filters.category = req.query.category;
        }
        if(req.query.ticketPrice){
            filters.ticketPrice = req.query.ticketPrice;
        }

        const events = await Event.find();
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const getEventById = async (req,res)=>{
    try {
        const event = await Event.findById(req.params.id);
        if(!event){
            return res.status(404).json({error: 'Event Not Found'});
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({error: error.message});       
    }
};

export const createEvent = async(req,res)=>{
    const{title, description, date, location, category, totalSeats, ticketPrice, imageUrl} = req.body;
    try {
        const event = await Event.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            ticketPrice,
            imageUrl
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

export const updateEvent = async(req,res)=>{
    const {title, description, date, location, category, totalSeats, ticketPrice, imageUrl} = req.body;
     try {
        const event = await Event.fiedByIdAndUpdate(req.params.id,{
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            ticketPrice,
            imageUrl
        }, {new: true});
        if(!event) {
            return res.status(404).json({error: 'Event Not Found'});
        }
        res.json(event);
     } catch (error) {
        res.status(500).json({error: error.message});
     }   
    };

    export const deleteEvent = async (req,res)=>{
        try {
            const event = await Event.findByIdAndDelete(req.params.id);
            if(!event){
                return res.status(404).json({error: 'Event Not Found'});
            }
            res.json({message: 'Event Delete Successfuly'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    };

