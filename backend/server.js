const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./conn.js')
const vehicleRoutes = require('./routes/vehicleRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());

app.use('/vehicle', vehicleRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));