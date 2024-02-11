const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    title:{
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        minlength: 2,
        required: true,
    },
    vehicles:{
        _id: false,
        vehicleId:{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicles',
        },
        vrn:{
            type: String,
            required: true
        }
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

