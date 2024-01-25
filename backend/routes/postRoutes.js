const express = require('express');
const Post = require('../model/posts');
const router = express.Router();

const multer = require('multer');
const upload = multer({dest: 'uploads/'})

router.use(express.json());

router.get("/", (req, res) => {
    res.send("Posts")
})

//POST Post Data
router.post('/add', async (req, res) => {
    try{       
        const newPost = new Post(req.body);
        await newPost.save();

        res.status(201).json({message: "Post Created Successfully", newPost});
        console.log("Post Created Successfully");
    } catch (error){
        console.error('Error Creating Post:', error);
        res.status(400).json({message:" Error Creating Post", detail: error.message});
    }
});

//Get Post Data
router.get('/view', async (req, res) => {
    console.log(req.body);
    try{       
        const posts = await Post.find();

        res.status(201).json({message: "Post Found", userData});
        console.log("Post Found");
    } catch (error){
        console.error('Error Fetching Posts:', error);
        res.status(400).json({message:" Error Fetching Post", detail: error.message});
    }
});

//UPDATE Post Data
router.put('/edit/:postId', async (req, res) => {
    try{       
        const {heading, image, description, vehicle} = req.body;
        const postId = req.params.postId;

        if(!postId){
            return res.status(400).json({message: "Post Not Found."})
        }

        const postUpdate = await Post.findByIdAndUpdate(
            postId,
            {heading, image, description, vehicle},
            {new: true}
        );
  
        if(!postUpdate){
            return res.status(400).json({message: "Post Not Able To Update."});
        }

        res.status(201).json({message: "Post Updated", user: userUpdate});
        console.log("User Updated");
    } catch (error){
        console.error('Error Updating Post:', error);
        res.status(400).json({message:" Error Updaing Post", detail: error.message});
    }
});

module.exports = router;