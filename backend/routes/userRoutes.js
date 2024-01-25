const express = require('express');
const User = require('../model/users');
const router = express.Router();

const multer = require('multer');
const upload = multer({dest: 'uploads/'})

router.use(express.json());

router.get("/", (req, res) => {
    res.send("Users")
})

//GET User Data
router.get('/details', async (req, res) => {
    try{       
        const userId = req.query.userfb;
        // console.log(userId);

        if(!userId){
            return res.status(400).json({message: "User Not Found."})
        }
        const userData = await User.findOne({user_fbId: userId});

        if(!userData){
            return res.status(400).json({message: "User Details Not Found."});
        }
        // console.log(userData);

        res.status(201).json({message: "User Details", userData});
        console.log("User Details Found");
    } catch (error){
        console.error('User Details Not Found:', error);
        res.status(400).json({message:" Error Finding User Details", detail: error.message});
    }
});

//POST User Data
router.post('/register', upload.single('profilePicture'), async (req, res) => {
    console.log(req.body);
    try{       
        //check if username is unique
        const {username} = req.body;
        const existingUser = await User.findOne({ username });

        if (existingUser){
            return res.status(400).json({message: 'Username Already Taken'})
        }

        const newUser = new User(req.body);

        if (req.file){
            newUser.profilePicture = req.file.path;
        }

        await newUser.save();

        res.status(201).json({message: "User Created", user: newUser});
        console.log("User Created");
    } catch (error){
        console.error('Error creating user:', error);
        res.status(400).json({message:" Error Creating User", detail: error.message});
    }
});

//UPDATE User Data
router.put('/update', upload.single('profilePicture'), async (req, res) => {
    try{       
        console.log(req.body)
        //check if username is unique
        const userId = req.query.userfb;
        // console.log(userId);

        if(!userId){
            return res.status(400).json({message: "User Not Found."})
        }
        const userUpdate = await User.findOne({user_fbId: userId});

        if(!userUpdate){
            return res.status(400).json({message: "User to Update Not Found."});
        }

        if(req.body.email){
            userUpdate.email = req.body.email;
        }
        if(req.file){
            userUpdate.profilePicture = req.file.path;
        }
        if(req.body.vehicle){
            userUpdate.vehicle = req.body.vehicle;
        }

        await userUpdate.save();

        res.status(201).json({message: "User Updated", user: userUpdate});
        console.log("User Updated");
    } catch (error){
        console.error('Error updating user:', error);
        res.status(400).json({message:" Error updaing User", detail: error.message});
    }
});

module.exports = router;