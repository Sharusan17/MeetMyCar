// import modules
const express = require('express');
const User = require('../model/users');
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

// parse as JSON
router.use(express.json());

//GET User Data
router.get('/', async (req, res) => {
    try{       
        // parameters from query string (fbID or userId or username)
        const userId = req.query.userfb;
        const userid = req.query.userid;
        const queryusername = req.query.username;

        // Creates a query depending on which query string it received
        let query = userid ? {_id: userid} : userId ? {user_fbId: userId} : {username: queryusername};
        
        // console.log(userId);

        // return a 400 Bad response, if query is empty
        if(!query){
            return res.status(400).json({message: "User Not Found."})
        }
        // Find user data based on fbID or userId or username
        const userData = await User.findOne(query);

        // return a 400 Bad request, if user not found
        if(!userData){
            return res.status(404).json({message: "User Details Not Found."});
        }
        // console.log(userData);

        // sends user data
        res.status(200).json({message: "User Details", userData});
        console.log("User Details Found");
    } catch (error){
        console.error('User Details Not Found:', error);
        res.status(500).json({message:" Error Finding User Details", detail: error.message});
    }
});

//GET All User Data
router.get('/all', async (req, res) => {
    try{       
        // finds all user data
        const allUserData = await User.find({});

        // return a 400 Bad response, if no users found
        if(!allUserData){
            return res.status(400).json({message: "No Users found."})
        }

        // sends all user data
        res.status(200).json({message: "All User Details", allUserData});
        console.log("All User Details Found");
    } catch (error){
        console.error('All User Details Not Found:', error);
        res.status(500).json({message:" Error Finding All User Details", detail: error.message});
    }
});

//POST User Data
router.post('/register', upload.single('profilePicture'), async (req, res) => {
    console.log(req.body);
    try{       
        //checks if username is unique
        const {username} = req.body;
        const existingUser = await User.findOne({ username });

        // returns a 400 Bad response, if username taken
        if (existingUser){
            return res.status(400).json({message: 'Username Already Taken'})
        }

        // Creates a new user with body data
        const newUser = new User(req.body);

        // uploads profile picture to AWS, and stores url to user
        if (req.file){
            const uploadResult = await req.uploadAWS(req.file);
            newUser.profilePicture = uploadResult.Location;
        }

        // Saves the user to database
        await newUser.save();

        res.status(201).json({message: "User Created", user: newUser});
        console.log("User Created");
    } catch (error){
        console.error('Error creating user:', error);
        res.status(500).json({message:" Error Creating User", detail: error.message});
    }
});

//UPDATE User Data
router.put('/update', upload.single('profilePicture'), async (req, res) => {
    try{
        // parameters from query string (fbID or userId)
        const userId = req.query.userfb;
        const userid = req.query.userid;

        // Creates a query depending on which query string it received
        let query = userid ? {_id: userid} : {user_fbId: userId}

        // return a 400 Bad response, if query is empty
        if(!query){
            return res.status(400).json({message: "User Not Found."})
        }

        // Find user data based on fbID or userId or username
        const userUpdate = await User.findOne(query);

        // return a 400 Bad request, if user not found
        if(!userUpdate){
            return res.status(404).json({message: "User to Update Not Found."});
        }

        // updates email, if email in body found
        if(req.body.email){
            userUpdate.email = req.body.email;
        }
        // updates image, if image in body found
        if(req.file){
            const uploadResult = await req.uploadAWS(req.file);
            userUpdate.profilePicture = uploadResult.Location;
        }
        // adds followers, if followers in body found
        if(req.body.followersId && req.body.followersname){
            const followerId = req.body.followersId;
            if (!userUpdate.followers.includes(followerId)){
                userUpdate.followers.push({followerId: followerId, followerName: req.body.followersname});
            }
        }
        // removes followers, if followers in body found
        if(req.body.followersToRemove){
            userUpdate.followers.pull({followerId: req.body.followersToRemove})
        }
        // adds followings, if followings in body found
        if(req.body.followeringId && req.body.followeringName){
            const followeringId = req.body.followeringId;
            if (!userUpdate.following.includes(followeringId)){
                userUpdate.following.push({followeringId: followeringId, followeringName: req.body.followeringName});
            }
        }
        // removes followerings, if followerings in body found
        if(req.body.followingtoRemove){
            userUpdate.following.pull({followeringId: req.body.followingtoRemove})
        }
        // adds post, if post in body found
        if(req.body.postId){
            if (!userUpdate.posts.includes(req.body.postId)){
                userUpdate.posts.push({postId: req.body.postId});
            }
        }
        // removes post, if post in body found
        if(req.body.postIdRemove){
            userUpdate.posts.pull({postId: req.body.postIdRemove})
        }
        // adds vehicle, if vehicle in body found
        if(req.body.vehicleId && req.body.vrn){
            const vehicleId = req.body.vehicleId;
            if (!userUpdate.vehicles.includes(vehicleId)){
                userUpdate.vehicles.push({vehicleId: vehicleId, vrn: req.body.vrn});
            }
        }
        // remove vehicle, if vehicle in body found 
        if(req.body.vehicleIdRemove){
            userUpdate.vehicles.pull({vehicleId: req.body.vehicleIdRemove})
        }
        // adds winPoint, if winPoint in body found
        if(req.body.winVRNPoints && req.body.winUserPoints && req.body.winVRN){
            if (!req.body.winUserPoints !== userId){
                userUpdate.winPoints.push({vehicleId: req.body.winVRNPoints, userId: req.body.winUserPoints, vrn: req.body.winVRN})
            }
        }
        // add lostPoint, if lostPoint in body found
        if(req.body.lostVRNPoints && req.body.lostUserPoints && req.body.lostVRN){
            if (req.body.lostUserPoints !== userId){
                userUpdate.lostPoints.push({vehicleId: req.body.lostVRNPoints, userId: req.body.lostUserPoints, vrn: req.body.lostVRN})
            }
        }
        // adds superfuel, if superfuel in body found
        if(req.body.addSuperFuel){
            userUpdate.superfuel += 1
        }
        // removes superfuel, if superfuel in body found
        if(req.body.removeSuperFuel){
            userUpdate.superfuel -= 1
        }
        
        // Saves user's changes to database
        await userUpdate.save();

        res.status(200).json({message: "User Updated", user: userUpdate});
        console.log("User Updated");
    } catch (error){
        console.error('Error updating user:', error);
        res.status(500).json({message:" Error updating User", detail: error.message});
    }
});

//DELETE User Data
router.delete('/delete', async (req, res) => {
    try{       
        // parameters from query string (fbID)
        const userId = req.query.userfb;

        // return a 400 Bad response, if user not found
        if(!userId){
            return res.status(400).json({message: "User Not Found."})
        }
        // Find and delete user based on user ID
        const userDelete = await User.findByIdAndDelete (userId);

        // returns a 404 Not Found response, if user not found
        if(!userDelete){
            return res.status(404).json({message: "User to Delete Not Found."});
        }

        res.status(200).json({message: "User Deleted", user: userDelete});
        console.log("User Deleted");
    } catch (error){
        console.error('Error deleting user:', error);
        res.status(500).json({message:" Error deleting User", detail: error.message});
    }
});

// export the User Route
module.exports = router;