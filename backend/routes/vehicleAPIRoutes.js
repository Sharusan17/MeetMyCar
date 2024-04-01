// import modules
const express = require('express');
const router = express.Router();

//VehicleAPI List
router.get('/list', async (req, res) => {
    // import node-fetch
    const fetch = (await import('node-fetch')).default;
    try {
        // filter vehicle with Make and Model
        const where = encodeURIComponent(JSON.stringify({
            "Make": {
              "$exists": true
            },
            "Model": {
              "$exists": true
            }
        }));

        // fetch Parse App ID and REST API Key from env
        const APP_ID = process.env.PARSE_APP_ID;
        const REST_API_KEY = process.env.PARSE_REST_API_KEY;

        // fetch vehicle list data from external API
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

        // successful response, parse response as JSON
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


//VehicleAPI Search
router.get('/search', async (req, res) => {

    const fetch = (await import('node-fetch')).default;
    try {
        // fetch CAR_LIVE_API and CAR_TEST_API from env
        const LIVE_APP_ID = process.env.CAR_LIVE_API;
        const TEST_APP_ID = process.env.CAR_TEST_API;

        // fetch vrn from query
        const VehicleReg = req.query.vrn

        // return 400 Bad response, if vrn is empty
        if(!VehicleReg){
            return res.status(400).json({message: "Vehicle Registration Number Required."})
        }

        // console.log(VehicleReg);

        // fetch vehicle data from external API with vrn and API key
        const apiResponse = await fetch(`https://api.checkcardetails.co.uk/vehicledata/ukvehicledata?apikey=${TEST_APP_ID}&vrm=${VehicleReg}`
            ,{
                method:'GET',
                headers:{
                    'accept': 'application/json',
                },
            }
        );

        const datainfo = await apiResponse.json();

        // fetch vehicle image from external API with vrn and API key
        const apiImageResponse = await fetch(`https://api.checkcardetails.co.uk/vehicledata/vehicleimage?apikey=${TEST_APP_ID}&vrm=${VehicleReg}`
            ,{
                method:'GET',
                headers:{
                    'accept': 'application/json',
                },
            }
        );

        const dataImg = await apiImageResponse.json();

        // fetch vehicle value from external API with vrn and API key
        const apiValueResponse = await fetch(`https://api.checkcardetails.co.uk/vehicledata/vehiclevaluation?apikey=${TEST_APP_ID}&vrm=${VehicleReg}`
            ,{
                method:'GET',
                headers:{
                    'accept': 'application/json',
                },
            }
        );

        const dataValue = await apiValueResponse.json();

        // fetch vehicle MOT from external API with vrn and API key
        const apiMOTResponse = await fetch(`https://api.checkcardetails.co.uk/vehicledata/mot?apikey=${TEST_APP_ID}&vrm=${VehicleReg}`
            ,{
                method:'GET',
                headers:{
                    'accept': 'application/json',
                },
            }
        );

        const dataMOT = await apiMOTResponse.json();

        // fetch vehicle history from external API with vrn and API key
        const apiHistoryResponse = await fetch(`https://api.checkcardetails.co.uk/vehicledata/vehicleregistration?apikey=${TEST_APP_ID}&vrm=${VehicleReg}`
            ,{
                method:'GET',
                headers:{
                    'accept': 'application/json',
                },
            }
        );

        const dataHistory = await apiHistoryResponse.json();

        // successful responses, return all data as JSON
        if (apiResponse.ok && apiImageResponse.ok && apiValueResponse.ok && apiMOTResponse.ok && apiHistoryResponse.ok) {
            const responseData = {
                datainfo,
                dataImg,
                dataValue,
                dataMOT,
                dataHistory
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

// export the Vehicle API Route
module.exports = router;