const express = require('express');
const router = express.Router();

//Vehicle List
router.get('/list', async (req, res) => {

    const fetch = (await import('node-fetch')).default;
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

        const apiResponse = await fetch(`https://parseapi.back4app.com/classes/Carmodels_Car_Model_List?limit=9899&order=Make,Model&keys=Make,Model&where=${where}`,
            {
                headers:{
                    'X-Parse-Application-Id': APP_ID,
                    'X-Parse-REST-API-Key': REST_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        const responseBody = await apiResponse.text();

        if (apiResponse.ok) {
            const data = JSON.parse(responseBody);
            res.json(data);
        } else {
            // console.log('API Response Status:', apiResponse.status);
            // console.log('API Response Body:', responseBody);
            res.status(apiResponse.status).json({ message: "Error fetching data from the external API.", details: responseBody });
        }
    } catch (error) {
        console.error('Error making fetch request:', error);
        res.status(500).json({ message: "Internal server error.", details: error.message });
    }
});


//Vehicle Search
router.get('/search', async (req, res) => {

    const fetch = (await import('node-fetch')).default;
    try {
        const LIVE_APP_ID = process.env.CAR_LIVE_API;
        const TEST_APP_ID = process.env.CAR_TEST_API;

        const VehicleReg = req.query.vrn

        if(!VehicleReg){
            return res.status(400).json({message: "Vehicle Registration Number Required."})
        }

        // console.log(VehicleReg);

        const apiResponse = await fetch(`https://api.checkcardetails.co.uk/vehicledata/ukvehicledata?apikey=${TEST_APP_ID}&vrm=${VehicleReg}`
            ,{
                method:'GET',
                headers:{
                    'accept': 'application/json',
                },
            }
        );

        const datainfo = await apiResponse.json();

        const apiImageResponse = await fetch(`https://api.checkcardetails.co.uk/vehicledata/vehicleimage?apikey=${TEST_APP_ID}&vrm=${VehicleReg}`
            ,{
                method:'GET',
                headers:{
                    'accept': 'application/json',
                },
            }
        );

        const dataImg = await apiImageResponse.json();

        if (apiResponse.ok && apiImageResponse.ok) {
            const responseData = {
                datainfo,
                dataImg
            }
            res.json(responseData);
        } else {
            res.status(apiResponse.status).json({ message: "Error fetching data from the external API.", details: datainfo });
        }
    } catch (error) {
        console.error('Error making fetch request:', error);
        res.status(500).json({ message: "Internal server error.", details: error.message });
    }
});

module.exports = router;