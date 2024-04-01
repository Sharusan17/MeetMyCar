// import modules
const express = require('express');
const Vehicle = require('../model/vehicles');
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

// parse as JSON
router.use(express.json());

//Get Vehicle Data
router.get('/', async (req, res) => {
    console.log(req.body);
    try{
        // parameters from query string (vehicleId)
        const vehicleId = req.query.vehicleId;

        // return a 400 Bad response, if no vehicle id found
        if(!vehicleId){
            return res.status(400).json({message: "Vehicle Not Found."})
        }

        // Find vehicle data by vehicleId and populate the user
        vehicleData = await Vehicle.findOne({_id: vehicleId}).populate('user', 'username');

        // return a 400 Bad response, if no vehicle data found
        if(!vehicleData){
            return res.status(404).json({message: "Vehicle Details Not Found."});
        }

        res.status(200).json({message: "Vehicle Found", vehicleData});
        console.log("Vehicle Found");
    } catch (error){
        console.error('Error Fetching Vehicle:', error);
        res.status(500).json({message:" Error Fetching Vehicle", detail: error.message});
    }
});

//POST Vehicle Data
router.post('/add', upload.single('image'), async (req, res) => {
    console.log(req.body);
    try{       
        // Create a new vehicle with body data
        const newVehicle = new Vehicle(req.body);

        // Upload The VehicleImg Into AWS and store the image
        if (req.body.image){
            const imageResponse= await fetch(req.body.image);
            const imageData = await imageResponse.arrayBuffer();
            const uploadImage = await req.uploadAWS({ buffer: Buffer.from(imageData), originalname: `${req.body.vrn}_image.jpg`, mimetype: 'image/jpeg' });
    
            newVehicle.image = uploadImage.Location;
        }
        

        // Parses The VehicleInfo Into Nested Objects
        if (req.body.vehicleInfo){
            newVehicle.vehicleInfo = JSON.parse(req.body.vehicleInfo)
        }

        // Parses The VehicleValue Into Nested Objects
        if (req.body.vehicleValue){
            newVehicle.vehicleValue = JSON.parse(req.body.vehicleValue)
        }

        // Parses The VehicleMOT Into Nested Objects
        if (req.body.vehicleMOT){
            newVehicle.vehicleMOT = JSON.parse(req.body.vehicleMOT)
        }

        // Parses The VehicleHistory Into Nested Objects
        if (req.body.vehicleHistory){
            newVehicle.vehicleHistory = JSON.parse(req.body.vehicleHistory)
        }

        // Save the vehicle to database
        await newVehicle.save();

        res.status(201).json({message: "Vehicle Added Successfully", newVehicle});
        console.log("Vehicle Added Successfully");
    } catch (error){
        console.error('Error Adding Vehicle:', error);
        res.status(500).json({message:" Error Adding Vehicle", detail: error.message});
    }
});

//UPDATE Vehicle Data
router.put('/edit', upload.single('image'), async (req, res) => {
    console.log(req.body)
    try{     
        // parameters from query string (vehicleId)  
        const vehicleId = req.query.vehicleId;

        // return a 400 Bad response, if no vehicle id
        if(!vehicleId){
            return res.status(400).json({message: "Vehicle Not Found."})
        }
        // Find a vehicle with vehicleId and returns updated data
        const vehicleUpdate = await Vehicle.findById(vehicleId, {new: true});

        // return a 400 Bad response, if no vehicle data found
        if(!vehicleUpdate){
            return res.status(404).json({message: "Vehicle Not Able To Update."});
        }

        // updates vrn, if vrn in body found
        if(req.body.vrn){
            vehicleUpdate.vrn = req.body.vrn;
        }
        // updates image, if image in body found
        if (req.file){
            const uploadResult = await req.uploadAWS(req.file);
            vehicleUpdate.image = uploadResult.Location;
        }
        // updates vehicleInfo, if vehicleInfo in body found
        if(req.body.vehicleInfo){
            vehicleUpdate.vehicleInfo = req.body.vehicleInfo;
        }
        // updates vehicleValue, if vehicleValue in body found
        if (req.body.vehicleValue){
            newVehicle.vehicleValue = JSON.parse(req.body.vehicleValue)
        }
        // updates vehicleMOT, if vehicleMOT in body found
        if (req.body.vehicleMOT){
            newVehicle.vehicleMOT = JSON.parse(req.body.vehicleMOT)
        }
        // updates vehicleHistory, if vehicleHistory in body found
        if (req.body.vehicleHistory){
            newVehicle.vehicleHistory = JSON.parse(req.body.vehicleHistory)
        }

        // Save the vehicle's changes to database
        await vehicleUpdate.save();
  
        res.status(200).json({message: "Vehicle Updated", vehicle: vehicleUpdate});
        console.log("Vehicle Updated");
    } catch (error){
        console.error('Error Updating Vehicle:', error);
        res.status(500).json({message:" Error Updating Vehicle", detail: error.message});
    }
});

//DELETE Vehicle Data
router.delete('/delete', async (req, res) => {
    try{      
        // parameters from query string (vehicleId) 
        const vehicleId = req.query.vehicleId;

        // return a 400 Bad response, if vehicle not found
        if(!vehicleId){
            return res.status(400).json({message: "Vehicle Not Found."})
        }
        // Find and delete vehicle based on vehicleId
        const vehicleDeleted = await Vehicle.findByIdAndDelete( vehicleId);
  
        // returns a 404 Not Found response, if vehicle not found
        if(!vehicleDeleted){
            return res.status(404).json({message: "Vehicle Not Able To Remove."});
        }

        res.status(200).json({message: "Vehicle ${vehicleId} Removed", vehicle: vehicleDeleted});
        console.log("Vehicle Removed");
    } catch (error){
        console.error('Error Removing Vehicle:', error);
        res.status(500).json({message:" Error Removing Vehicle", detail: error.message});
    }
});

// export the Vehicle Route
module.exports = router;