// import modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// Initalise dotenv to load env
dotenv.config();

// Connection to MongoDB
const {connectDB} = require('./conn')
// Connection to AWS
const connectAWS = require('./awsConn')

// Routes
const vehicleAPIRoutes = require('./routes/vehicleAPIRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const eventRoutes = require('./routes/eventRoutes');

// Create an express application and enables CORS middleware
const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("Backend Server");
})

// Handle connection to server
const connection = async () => {
    try{
        // Connection to MongoDB
        await connectDB();

        // Connection to AWS functions
        app.use((req, res, next) => {
            req.s3 = connectAWS.s3;
            req.s3_BUCKET = connectAWS.S3_BUCKET;
            req.uploadAWS = connectAWS.uploadAWS;
            next();
        })
        
        // Define routes for different API endpoints
        app.use('/vehicleAPI', vehicleAPIRoutes);
        app.use('/users', userRoutes);
        app.use('/posts', postRoutes);
        app.use('/vehicles', vehicleRoutes);
        app.use('/events', eventRoutes);
        
        // Server Port
        const PORT = process.env.PORT;
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    } catch (error){
        console.error("Cannot Connect To Database:", error);
    }
}

// Starts the server connection
connection();