const mongoose = require('mongoose');

const uri = process.env.MONGO_DB_URI;

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
