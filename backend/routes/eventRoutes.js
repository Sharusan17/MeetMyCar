// import modules
const express = require('express');
const Event = require('../model/events');
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

// parse as JSON
router.use(express.json());

//Get Event Data
router.get('/', async (req, res) => {
    console.log(req.body);
    try{
        // parameters from query string (eventId)
        const eventId = req.query.eventId;
        let eventData;

        // Find event data by eventId and populate the user and comments
        if(eventId){
            eventData = await Event.findOne({_id: eventId}).populate('user', 'username profilePicture');
            // return a 400 Bad response, if no event data found
            if (!eventData){
                return res.status(400).json({message: "Event Not Found."})
            }
        }else{
            // Find all event and sort the event by date (Nearest Date First)
            eventData = await Event.find().populate('user', 'username profilePicture')
                                        .sort({date: 1});
        }
        
        res.status(200).json({message: "Event Found", eventData});
        console.log("Event Found");
    } catch (error){
        console.error('Error Fetching Events:', error);
        res.status(500).json({message:" Error Fetching Event", detail: error.message});
    }
});

//POST Event Data
router.post('/create', upload.array('image'), async (req, res) => {
    console.log(req.body);
    try{       
        // Create a new event with body data
        const newEvent = new Event(req.body);

        // Save the event to database
        await newEvent.save();

        res.status(201).json({message: "Event Created Successfully", newEvent});
        console.log("Event Created Successfully");
    } catch (error){
        console.error('Error Creating Event:', error);
        res.status(500).json({message:" Error Creating Event", detail: error.message});
    }
});

//UPDATE Event Data
router.put('/edit', upload.array('image'), async (req, res) => {
    console.log(req.body)
    try{       
        // parameters from query string (eventId)
        const eventId = req.query.eventId;

        // return a 400 Bad response, if no event id
        if(!eventId){
            return res.status(400).json({message: "Event Not Found."})
        }
        // Find a event with eventId
        const eventUpdate = await Event.findById(eventId);

        // return a 400 Bad response, if no event data found
        if(!eventUpdate){
            return res.status(404).json({message: "Event Not Able To Update."});
        }

        // updates title, if title in body found
        if(req.body.title){
            eventUpdate.title = req.body.title;
        }
        // updates description, if description in body found
        if(req.body.description){
            eventUpdate.description = req.body.description;
        }
        // updates location, if location in body found
        if(req.body.location){
            eventUpdate.location = req.body.location;
        }
        // updates date, if date in body found
        if(req.body.date){
            eventUpdate.date = req.body.date;
        }
        // adds like, if like in body found
        if(req.body.addUserIdLike){
            const userIdLike = req.body.addUserIdLike
            if(!eventUpdate.likes.includes(userIdLike)){
                eventUpdate.likes.push({userId: userIdLike})
            }
        }
        // removes like, if like in body found
        if(req.body.removeUserIdLike){
            eventUpdate.likes.pull({userId: req.body.removeUserIdLike})
        }
        // adds attendee, if attendee in body found
        if(req.body.addUserIdAttend){
            const userIdAttend = req.body.addUserIdAttend
            if(!eventUpdate.attendees.includes(userIdAttend)){
                eventUpdate.attendees.push({userId: userIdAttend})
            }
        }
        // removes attendee, if attendee in body found
        if(req.body.removeUserIdAttend){
            eventUpdate.attendees.pull({userId: req.body.removeUserIdAttend})
        }
        
        // Saves the event's changes to database
        await eventUpdate.save();
  
        res.status(200).json({message: "Event Updated", event: eventUpdate});
        console.log("Event Updated");
    } catch (error){
        console.error('Error Updating Event:', error);
        res.status(500).json({message:" Error Updating Event", detail: error.message});
    }
});

//DELETE Event Data
router.delete('/delete', async (req, res) => {
    try{       
        // parameters from query string (eventId)
        const eventId = req.query.eventId;

        // return a 400 Bad response, if event not found
        if(!eventId){
            return res.status(400).json({message: "Event Not Found."})
        }
        // Find and delete event based on eventId
        const eventDeleted = await Event.findByIdAndDelete( eventId);
  
        // returns a 404 Not Found response, if event not found
        if(!eventDeleted){
            return res.status(404).json({message: "Event Not Able To Delete."});
        }

        res.status(200).json({message: "Event ${eventId} Deleted", event: eventDeleted});
        console.log("Event Deleted");
    } catch (error){
        console.error('Error Deleting Event:', error);
        res.status(500).json({message:" Error Deleting Event", detail: error.message});
    }
});

// export the Event Route
module.exports = router;