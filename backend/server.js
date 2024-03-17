const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const {connectDB} = require('./conn')
const connectAWS = require('./awsConn')

const vehicleAPIRoutes = require('./routes/vehicleAPIRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("Backend Server");
})

const connection = async () => {
    try{
        await connectDB();

        app.use((req, res, next) => {
            req.s3 = connectAWS.s3;
            req.s3_BUCKET = connectAWS.S3_BUCKET;
            req.uploadAWS = connectAWS.uploadAWS;
            next();
        })
        
        app.use('/vehicleAPI', vehicleAPIRoutes);
        app.use('/users', userRoutes);
        app.use('/posts', postRoutes);
        app.use('/vehicles', vehicleRoutes);
        
        
        const PORT = process.env.PORT;
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    } catch (error){
        console.error("Cannot Connect To Database:", error);
    }
}

connection();

