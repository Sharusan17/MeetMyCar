const express = require('express');
const Vehicle = require('../model/vehicles');
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.use(express.json());

//Get Vehicle Data
router.get('/', async (req, res) => {
    console.log(req.body);
    try{
        const vehicleId = req.query.vehicleId;

        if(!vehicleId){
            return res.status(400).json({message: "Vehicle Not Found."})
        }
    
        vehicleData = await Vehicle.findOne({_id: vehicleId}).populate('user', 'username');

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
        const newVehicle = new Vehicle(req.body);

        //Download The VehicleImg Into AWS
        if (req.body.image){
            const imageResponse= await fetch(req.body.image);
            const imageData = await imageResponse.arrayBuffer();
            const uploadImage = await req.uploadAWS({ buffer: Buffer.from(imageData), originalname: `${req.body.vrn}_image.jpg`, mimetype: 'image/jpeg' });
    
            newVehicle.image = uploadImage.Location;
        }
        

        //Parses The VehicleInfo Into Nested Objects
        if (req.body.vehicleInfo){
            newVehicle.vehicleInfo = JSON.parse(req.body.vehicleInfo)
        }

        //Parses The VehicleValue Into Nested Objects
        if (req.body.vehicleValue){
            newVehicle.vehicleValue = JSON.parse(req.body.vehicleValue)
        }

        //Parses The VehicleMOT Into Nested Objects
        if (req.body.vehicleMOT){
            newVehicle.vehicleMOT = JSON.parse(req.body.vehicleMOT)
        }

        //Parses The VehicleHistory Into Nested Objects
        if (req.body.vehicleHistory){
            newVehicle.vehicleHistory = JSON.parse(req.body.vehicleHistory)
        }

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
        const vehicleId = req.query.vehicleId;

        if(!vehicleId){
            return res.status(400).json({message: "Vehicle Not Found."})
        }
        const vehicleUpdate = await Vehicle.findById(vehicleId, {new: true});

        if(!vehicleUpdate){
            return res.status(404).json({message: "Vehicle Not Able To Update."});
        }

        if(req.body.vrn){
            vehicleUpdate.vrn = req.body.vrn;
        }
        if (req.file){
            const uploadResult = await req.uploadAWS(req.file);
            vehicleUpdate.image = uploadResult.Location;
        }
        if(req.body.vehicleInfo){
            vehicleUpdate.vehicleInfo = req.body.vehicleInfo;
        }
        if (req.body.vehicleValue){
            newVehicle.vehicleValue = JSON.parse(req.body.vehicleValue)
        }
        if (req.body.vehicleMOT){
            newVehicle.vehicleMOT = JSON.parse(req.body.vehicleMOT)
        }
        if (req.body.vehicleHistory){
            newVehicle.vehicleHistory = JSON.parse(req.body.vehicleHistory)
        }

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
        const vehicleId = req.query.vehicleId;

        if(!vehicleId){
            return res.status(400).json({message: "Vehicle Not Found."})
        }

        const vehicleDeleted = await Vehicle.findByIdAndDelete( vehicleId);
  
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

module.exports = router;