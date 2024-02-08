const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const {connectDB} = require('./conn')
const vehicleAPIRoutes = require('./routes/vehicleAPIRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
    res.send("Backend Server")
})

app.use('/vehicleAPI', vehicleAPIRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/vehicles', vehicleRoutes);


const PORT = 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));