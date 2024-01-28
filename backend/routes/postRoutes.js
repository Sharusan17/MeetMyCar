const express = require('express');
const Post = require('../model/posts');
const router = express.Router();

const multer = require('multer');
const upload = multer({dest: 'uploads/'})

router.use(express.json());

router.get("/", (req, res) => {
    res.send("Posts")
})

//Get Post Data
router.get('/view', async (req, res) => {
    console.log(req.body);
    try{
        //sorts the post by updatedAt Date/Time (Newest First)
        const postData = await Post.find().populate('user', 'username profilePicture').sort({updatedAt: -1});

        res.status(201).json({message: "Post Found", postData});
        console.log("Post Found");
    } catch (error){
        console.error('Error Fetching Posts:', error);
        res.status(400).json({message:" Error Fetching Post", detail: error.message});
    }
});

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

//UPDATE Post Data
router.put('/edit', async (req, res) => {
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

        res.status(201).json({message: "Post Updated", user: postUpdate});
        console.log("User Updated");
    } catch (error){
        console.error('Error Updating Post:', error);
        res.status(400).json({message:" Error Updating Post", detail: error.message});
    }
});

//DELETE Post Data
router.delete('/delete', async (req, res) => {
    try{       
        const postId = req.params.postId;

        if(!postId){
            return res.status(400).json({message: "Post Not Found."})
        }

        const postDeleted = await Post.findByIdAndDelete( postId);
  
        if(!postDeleted){
            return res.status(400).json({message: "Post Not Able To Delete."});
        }

        res.status(201).json({message: "Post ${postId} Deleted", user: userUpdate});
        console.log("Post Deleted");
    } catch (error){
        console.error('Error Deleting Post:', error);
        res.status(400).json({message:" Error Deleting Post", detail: error.message});
    }
});

module.exports = router;