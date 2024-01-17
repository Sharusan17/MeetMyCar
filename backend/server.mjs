import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

import dotenv from 'dotenv'
dotenv.config();

const app = express();
app.use(cors());

app.get('/vehicle/list', async (req, res) => {
    try {
        const where = encodeURIComponent(JSON.stringify({
            "Make": {
              "$exists": true
            },
            "Model": {
              "$exists": true
            }
        }));

        const APP_ID = process.env.PARSE_APP_ID;
        const REST_API_KEY = process.env.PARSE_REST_API_KEY;

        console.log(APP_ID)

        const apiResponse = await fetch(`https://parseapi.back4app.com/classes/Carmodels_Car_Model_List?limit=9899&order=Make,Model&keys=Make,Model&where=${where}`,
            {
                headers:{
                    'X-Parse-Application-Id': APP_ID,
                    'X-Parse-REST-API-Key': REST_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('API Response Status:', apiResponse.status);
        const responseBody = await apiResponse.text();
        console.log('API Response Body:', responseBody);

        if (apiResponse.ok) {
            const data = JSON.parse(responseBody);
            res.json(data);
        } else {
            console.log('API Response Status:', apiResponse.status);
            console.log('API Response Body:', responseBody);
            res.status(apiResponse.status).json({ message: "Error fetching data from the external API.", details: responseBody });
        }
    } catch (error) {
        console.error('Error making fetch request:', error);
        res.status(500).json({ message: "Internal server error.", details: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
