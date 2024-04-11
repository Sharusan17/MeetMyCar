// import mongoose
const mongoose = require('mongoose');

// Event Schema
const EventSchema = new mongoose.Schema({
    // Ref: User Database , users who organised the Event
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    // Title of Event (min: 2 and max: 30)
    title:{
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true,
    },
    // Description of Event
    description:{
        type: String,
        minlength: 2,
        required: true,
    },
    // Location of Event
    location:{
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true,
    },
    // Type of Event
    type:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required: true
    },
    // Likes of Event
    likes:[
        {
            _id: false,
            // Ref: User Database for likes
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
            }
        }
    ],
     // Attendees of Event
     attendees:[
        {
            _id: false,
            // Ref: User Database for Attendees
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
            }
        }
    ],
},
    // CreatedAt and UpdatedAt fields
    {
        collection: 'Events',
        timestamps: true
    }
);

// Create a model from the Event Schema
const Event = mongoose.model('Events', EventSchema);
console.log("Collection:", Event.collection.name);

// Export the Event model
module.exports = Event;