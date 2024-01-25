const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    heading:{
        type: String,
        maxlength: 30,
    },
    image:{
        type: String
    },
    description:{
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            text: String,
        },
    ],
},
    {
        collection: 'Posts',
        timestamps: true
    }
);

const Post = mongoose.model('Posts', PostSchema);
console.log("Collection:", Post.collection.name);
module.exports = Post;

