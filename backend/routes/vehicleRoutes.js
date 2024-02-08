const express = require('express');
const Vehicle = require('../model/vehicles');
const router = express.Router();

const multer = require('multer');
const upload = multer({dest: 'uploads/'})

router.use(express.json());

router.get("/", (req, res) => {
    res.send("Vehicles")
})

//Get Vehicle Data
router.get('/view', async (req, res) => {
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

        //Parses The VehicleInfo Into Nested Objects
        if (req.body.vehicleInfo){
            newVehicle.vehicleInfo = JSON.parse(req.body.vehicleInfo)
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
        if(req.file){
            vehicleUpdate.image = req.file.path;
        }
        if(req.body.vehicleInfo){
            vehicleUpdate.vehicleInfo = req.body.vehicleInfo;
        }

        await vehicleUpdate.save();
  
        res.status(201).json({message: "Vehicle Updated", vehicle: vehicleUpdate});
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