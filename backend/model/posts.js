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
    likes:[
        {
            _id: false,
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            text: String,
        },
    ],
    superfuel:[
        {
            _id: false,
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        }
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

