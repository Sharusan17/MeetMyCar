const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_fbId:{
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 2,
        maxlength: 20,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/]
    },
    profilePicture:{
        type: String
    },
    followers:[
        {
            _id: false,
            followerId:{ 
                type: String,
            },
            followerName:{
                type: String,
                required: true
            }
        }
    ],
    following:[
        {
            _id: false,
            followeringId:{ 
                type: String,
            },
            followeringName:{
                type: String,
                required: true
            }
        }
    ],
    posts:[
        {
            _id: false,
            postId:{ 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Posts',
            }
        }
    ],
    vehicles:[
        {
            _id: false,
            vehicleId:{ 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Vehicles',
            },
            vrn:{
                type: String,
                required: true
            }
        }
    ],
    winPoints:[
        {
            _id: false,
            vehicleId:{ 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Vehicles',
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            vrn:{
                type: String,
                required: true
            }
        }
    ],
    lostPoints:[
        {
            _id: false,
            vehicleId:{ 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Vehicles',
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            vrn:{
                type: String,
                required: true
            }
        }
    ],
},
    {
        collection: 'Users',
        timestamps: true
    }
);

const User = mongoose.model('Users', UserSchema);
console.log("Collection:", User.collection.name);
module.exports = User;

