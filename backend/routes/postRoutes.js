const express = require('express');
const Post = require('../model/posts');
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.use(express.json());

//Get Post Data
router.get('/', async (req, res) => {
    console.log(req.body);
    try{
        const postId = req.query.postId;
        let postData;

        if(postId){
            postData = await Post.findOne({_id: postId}).populate('user', 'username profilePicture')
                                                        .populate('comments.userID', 'username profilePicture').populate('comments.replies.userID', 'username profilePicture');
            if (!postData){
                return res.status(400).json({message: "Post Not Found."})
            }
        }else{
            //sorts the post by updatedAt Date/Time (Newest First)
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
        const newPost = new Post(req.body);

        if (req.file){
            const uploadResult = await req.uploadAWS(req.file);
            newPost.image = uploadResult.Location;
        }

        if(req.body.vehicleId && req.body.vrn){
            const vehicleId = req.body.vehicleId;
            newPost.vehicles = ({vehicleId: vehicleId, vrn: req.body.vrn});
        }

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
        const postId = req.query.postId;

        if(!postId){
            return res.status(400).json({message: "Post Not Found."})
        }
        const postUpdate = await Post.findById(postId);

        if(!postUpdate){
            return res.status(404).json({message: "Post Not Able To Update."});
        }

        if(req.body.title){
            postUpdate.title = req.body.title;
        }
        if (req.file){
            const uploadResult = await req.uploadAWS(req.file);
            postUpdate.image = uploadResult.Location;
        }
        if(req.body.description){
            postUpdate.description = req.body.description;
        }
        if(req.body.vehicleId && req.body.vrn){
            const vehicleId = req.body.vehicleId;
            postUpdate.vehicles = ({vehicleId: vehicleId, vrn: req.body.vrn});
        }
        if(req.body.addUserIdLike){
            const userIdLike = req.body.addUserIdLike
            if(!postUpdate.likes.includes(userIdLike)){
                postUpdate.likes.push({userId: userIdLike})
            }
        }
        if(req.body.removeUserIdLike){
            postUpdate.likes.pull({userId: req.body.removeUserIdLike})
        }
        if(req.body.commentUser && req.body.commentText){
            postUpdate.comments.push({userID: req.body.commentUser, commentText: req.body.commentText})
        }
        if(req.body.deleteCommentId){
            postUpdate.comments.pull({_id: req.body.deleteCommentId})
        }
        if(req.body.commentId && req.body.replyUser && req.body.replyText){
            const commentIndex = postUpdate.comments.findIndex(comment => comment._id.equals(req.body.commentId))
            postUpdate.comments[commentIndex].replies.push({userID: req.body.replyUser, replyText: req.body.replyText})
        }
        if(req.body.commentId && req.body.deleteReplyId){
            const commentIndex = postUpdate.comments.findIndex(comment => comment._id.equals(req.body.commentId))
            postUpdate.comments[commentIndex].replies.pull({_id: req.body.deleteReplyId})
        }
        if(req.body.addUserIdSuperFuel){
            const userIdSuperFuel = req.body.addUserIdSuperFuel
            if(!postUpdate.superfuel.includes(userIdSuperFuel)){
                postUpdate.superfuel.push({userId: userIdSuperFuel})
            }
        }
        if(req.body.removeUserIdSuperFuel){
            postUpdate.superfuel.pull({userId: req.body.removeUserIdSuperFuel})
        }
        
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
        const postId = req.query.postId;

        if(!postId){
            return res.status(400).json({message: "Post Not Found."})
        }

        const postDeleted = await Post.findByIdAndDelete( postId);
  
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

module.exports = router;