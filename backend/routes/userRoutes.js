const express = require('express');
const User = require('../model/users');
const router = express.Router();

router.use(express.json());

router.get("/", (req, res) => {
    res.send("Users")
})

router.get('/register', async (req, res) => {
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

router.post('/register', async (req, res) => {
    console.log(req.body);
    try{       
        //check if username is unique
        const {username} = req.body;
        const existingUser = await User.findOne({ username });

        if (existingUser){
            return res.status(400).json({message: 'Username Already Taken'})
        }

        const newUser = new User(req.body);
        await newUser.save();

        res.status(201).json({message: "User Created", user: newUser});
        console.log("User Created");
    } catch (error){
        console.error('Error creating user:', error);
        res.status(400).json({message:" Error Creating User", detail: error.message});
    }
});

module.exports = router;