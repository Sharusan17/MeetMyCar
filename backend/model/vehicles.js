// import mongoose
const mongoose = require('mongoose');

// Vehicle Schema
const VehicleSchema = new mongoose.Schema({
    // Ref: User Database created the vehicles
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    // Vehicle Registration Number of vehicle
    vrn:{
        type: String,
        required: true,
    },
    // Image of vehicle
    image:{
        type: String,
        required: true,
    },
    // Vehicle Info Object of vehicle
    vehicleInfo:{
        type: Object,
        required: true,
    },
    // Vehicle Value Object of vehicle
    vehicleValue:{
        type: Object,
        required: true,
    },
    // Vehicle MOT Object of vehicle
    vehicleMOT:{
        type: Object,
        required: true,
    },
    // Vehicle History Object of vehicle
    vehicleHistory:{
        type: Object,
        required: true,
    }
},
    // CreatedAt and UpdatedAt fields
    {
        collection: 'Vehicles',
        timestamps: true
    }
);

// Create a model from the Vehicle Schema
const Vehicle = mongoose.model('Vehicles', VehicleSchema);
console.log("Collection:", Vehicle.collection.name);

// Export the Vehicle model
module.exports = Vehicle;