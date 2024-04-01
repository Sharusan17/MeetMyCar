// import mongoose
const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    // User's Firebase ID
    user_fbId:{
        type: String,
        required: true,
        unique: true
    },
    // First name of User (min: 2)
    firstname: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    // Last name of User (min: 2)
    lastname: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    // Username of User (min: 2 and max: 20)
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 2,
        maxlength: 20,
        trim: true
    },
    // Email of User
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/]
    },
    // Profile Picture of User
    profilePicture:{
        type: String
    },
    // Followers of User
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
    // Followings of User
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
    // Ref: Post Database, post created by user
    posts:[
        {
            _id: false,
            postId:{ 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Posts',
            }
        }
    ],
    // Ref: Vehicle Database, vehicles owned by user
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
    // Win Points for User
    winPoints:[
        {
            _id: false,
            // Ref: Vehicle Database
            vehicleId:{ 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Vehicles',
            },
            // Ref: User Database
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
            },
            vrn:{
                type: String,
                required: true
            }
        }
    ],
    // Lost Points for User
    lostPoints:[
        {
            _id: false,
            // Ref: Vehicle Database
            vehicleId:{ 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Vehicles',
            },
            // Ref: User Database
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
            },
            vrn:{
                type: String,
                required: true
            }
        }
    ],
    // Superfuel for User (start: 10)
    superfuel:{
        type: Number,
        default: 10
    },
},
    // CreatedAt and UpdatedAt fields
    {
        collection: 'Users',
        timestamps: true
    }
);

// Create a model from the User Schema
const User = mongoose.model('Users', UserSchema);
console.log("Collection:", User.collection.name);

// Export the User model
module.exports = User;