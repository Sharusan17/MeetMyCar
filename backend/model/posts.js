// import mongoose
const mongoose = require('mongoose');

// Post Schema
const PostSchema = new mongoose.Schema({
    // Ref: User Database , users who created the post
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    // Title of Post (min: 2 and max: 30)
    title:{
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true,
    },
    // Image array of Post
    image:[{
        type: String,
        required: true,
    }],
    // Description of Post
    description:{
        type: String,
        minlength: 2,
        required: true,
    },
    // Vehicle of Post
    vehicles:{
        _id: false,
        // Ref: Vehicle Database for post
        vehicleId:{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicles',
        },
        vrn:{
            type: String,
            required: true
        }
    },
    // Likes of Post
    likes:[
        {
            _id: false,
            // Ref: User Database for likes
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
            }
        }
    ],
    // Comments of Post
    comments: [
        {
            // Ref: User Database for comments
            userID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
            },
            commentText: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now,
                required: true
            },
            // Replies of Post
            replies: [
                {
                    // Ref: User Database for replies
                    userID: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Users',
                    },
                    replyText: {
                        type: String
                    },
                    createdAt: {
                        type: Date,
                        default: Date.now,
                        required: true
                    },
                }
            ]
        },
    ],
    // Superfuel of Post
    superfuel:[
        {
            _id: false,
            // Ref: User Database for superfuel
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
            }
        }
    ],
},
    // CreatedAt and UpdatedAt fields
    {
        collection: 'Posts',
        timestamps: true
    }
);

// Create a model from the Post Schema
const Post = mongoose.model('Posts', PostSchema);
console.log("Collection:", Post.collection.name);

// Export the Post model
module.exports = Post;