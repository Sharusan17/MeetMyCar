const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: false,
    },
    vrn:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    vehicleInfo:{
        type: Object,
        required: true,
    }
},
    {
        collection: 'Vehicles',
        timestamps: true
    }
);

const Vehicle = mongoose.model('Vehicles', VehicleSchema);
console.log("Collection:", Vehicle.collection.name);
module.exports = Vehicle;

