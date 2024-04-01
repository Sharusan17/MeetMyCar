// import modules
const express = require('express');
const Post = require('../model/posts');
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

// parse as JSON
router.use(express.json());

//Get Post Data
router.get('/', async (req, res) => {
    console.log(req.body);
    try{
        // parameters from query string (postId)
        const postId = req.query.postId;
        let postData;

        // Find post data by postId and populate the user and comments
        if(postId){
            postData = await Post.findOne({_id: postId}).populate('user', 'username profilePicture')
                                                        .populate('comments.userID', 'username profilePicture').populate('comments.replies.userID', 'username profilePicture');
            // return a 400 Bad response, if no post data found
            if (!postData){
                return res.status(400).json({message: "Post Not Found."})
            }
        }else{
            // Find all post and sort the post by createdAt Date/Time (Newest First)
            postData = await Post.find().populate('user', 'username profilePicture')
                                        .populate('comments.userID', 'username profilePicture').populate('comments.replies.userID', 'username profilePicture')
                                        .sort({createdAt: -1});
        }
        
        res.status(200).json({message: "Post Found", postData});
        console.log("Post Found");
    } catch (error){
        console.error('Error Fetching Posts:', error);
        res.status(500).json({message:" Error Fetching Post", detail: error.message});
    }
});

//POST Post Data
router.post('/add', upload.single('image'), async (req, res) => {
    console.log(req.body);
    try{       
        // Create a new post with body data
        const newPost = new Post(req.body);

        // uploads post image to AWS, and stores url to post
        if (req.file){
            const uploadResult = await req.uploadAWS(req.file);
            newPost.image = uploadResult.Location;
        }

        // stores vehicle details to post
        if(req.body.vehicleId && req.body.vrn){
            const vehicleId = req.body.vehicleId;
            newPost.vehicles = ({vehicleId: vehicleId, vrn: req.body.vrn});
        }

        // Save the post to database
        await newPost.save();

        res.status(201).json({message: "Post Created Successfully", newPost});
        console.log("Post Created Successfully");
    } catch (error){
        console.error('Error Creating Post:', error);
        res.status(500).json({message:" Error Creating Post", detail: error.message});
    }
});

//UPDATE Post Data
router.put('/edit', upload.single('image'), async (req, res) => {
    console.log(req.body)
    try{       
        // parameters from query string (postId)
        const postId = req.query.postId;

        // return a 400 Bad response, if no post id
        if(!postId){
            return res.status(400).json({message: "Post Not Found."})
        }
        // Find a post with postId
        const postUpdate = await Post.findById(postId);

        // return a 400 Bad response, if no post data found
        if(!postUpdate){
            return res.status(404).json({message: "Post Not Able To Update."});
        }

        // updates title, if title in body found
        if(req.body.title){
            postUpdate.title = req.body.title;
        }
        // updates image, if image in body found
        if (req.file){
            const uploadResult = await req.uploadAWS(req.file);
            postUpdate.image = uploadResult.Location;
        }
        // updates description, if description in body found
        if(req.body.description){
            postUpdate.description = req.body.description;
        }
        // updates vehicle, if vehicle in body found
        if(req.body.vehicleId && req.body.vrn){
            const vehicleId = req.body.vehicleId;
            postUpdate.vehicles = ({vehicleId: vehicleId, vrn: req.body.vrn});
        }
        // adds like, if like in body found
        if(req.body.addUserIdLike){
            const userIdLike = req.body.addUserIdLike
            if(!postUpdate.likes.includes(userIdLike)){
                postUpdate.likes.push({userId: userIdLike})
            }
        }
        // removes like, if like in body found
        if(req.body.removeUserIdLike){
            postUpdate.likes.pull({userId: req.body.removeUserIdLike})
        }
        // adds comment, if comment in body found
        if(req.body.commentUser && req.body.commentText){
            postUpdate.comments.push({userID: req.body.commentUser, commentText: req.body.commentText})
        }
        // removes comment, if comment in body found
        if(req.body.deleteCommentId){
            postUpdate.comments.pull({_id: req.body.deleteCommentId})
        }
        // add replies, if replies in body found
        if(req.body.commentId && req.body.replyUser && req.body.replyText){
            const commentIndex = postUpdate.comments.findIndex(comment => comment._id.equals(req.body.commentId))
            postUpdate.comments[commentIndex].replies.push({userID: req.body.replyUser, replyText: req.body.replyText})
        }
        // delete replies, if replies in body found
        if(req.body.commentId && req.body.deleteReplyId){
            const commentIndex = postUpdate.comments.findIndex(comment => comment._id.equals(req.body.commentId))
            postUpdate.comments[commentIndex].replies.pull({_id: req.body.deleteReplyId})
        }
        // add superfuel, if superfuel in body found
        if(req.body.addUserIdSuperFuel){
            const userIdSuperFuel = req.body.addUserIdSuperFuel
            if(!postUpdate.superfuel.includes(userIdSuperFuel)){
                postUpdate.superfuel.push({userId: userIdSuperFuel})
            }
        }
        // remove superfuel, if superfuel in body found
        if(req.body.removeUserIdSuperFuel){
            postUpdate.superfuel.pull({userId: req.body.removeUserIdSuperFuel})
        }
        
        // Saves the post's changes to database
        await postUpdate.save();
  
        res.status(200).json({message: "Post Updated", post: postUpdate});
        console.log("Post Updated");
    } catch (error){
        console.error('Error Updating Post:', error);
        res.status(500).json({message:" Error Updating Post", detail: error.message});
    }
});

//DELETE Post Data
router.delete('/delete', async (req, res) => {
    try{       
        // parameters from query string (postId)
        const postId = req.query.postId;

        // return a 400 Bad response, if post not found
        if(!postId){
            return res.status(400).json({message: "Post Not Found."})
        }
        // Find and delete post based on postId
        const postDeleted = await Post.findByIdAndDelete( postId);
  
        // returns a 404 Not Found response, if post not found
        if(!postDeleted){
            return res.status(404).json({message: "Post Not Able To Delete."});
        }

        res.status(200).json({message: "Post ${postId} Deleted", post: postDeleted});
        console.log("Post Deleted");
    } catch (error){
        console.error('Error Deleting Post:', error);
        res.status(500).json({message:" Error Deleting Post", detail: error.message});
    }
});

// export the Post Route
module.exports = router;