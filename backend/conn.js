const mongoose = require('mongoose');

//add this to env file
const uri = ('mongodb+srv://dbuser:LBZQYTKWo6bIACLG@meetmycardb.lq0dlcf.mongodb.net/MMC?retryWrites=true&w=majority');

const connectionParams = {
  useNewUrlParser:true,
  useUnifiedTopology:true,
};

const connectDB = async() => {
  try {
    // Connect the client to the server
    await mongoose.connect(uri, connectionParams);
    console.log("Successful Connection To MongoDB!");
  } catch (error) {
    console.error("Failed Connection To MongoDB! " + error);
    process.exit(1);
  }
}

module.exports = {connectDB};
