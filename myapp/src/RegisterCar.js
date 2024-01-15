import React, {useEffect, useRef, useState} from 'react'
import {Form} from 'react-bootstrap'
import {Link} from 'react-router-dom'

import './RegisterCar_css.css'

export default function RegisterCar() {

    const [carData, setCarData] = useState([])
    const [makeOptions, setmakeOptions] = useState([])
    const [modelOptions, setmodelOptions] = useState([])

    const fuelOptions = ["Petrol", "Diesel"]
    const transmissionOptions = ["Manual", "Automatic"]

    const vehicleReg = useRef()
    const [vehicleMake, setvehicleMake] = useState('')
    const [vehicleModel, setvehicleModel] = useState('')
    const [vehicleFuel, setvehicleFuel] = useState('')
    const [vehicleTransmission, setvehicleTransmission] = useState('')

    const [selectedMake, setSelectedMake] = useState('');
    const [selectedModel, setSelectedModel] = useState([]);
    const [selectedFuel, setSelectedFuel] = useState('');
    const [selectedTransmission, setSelectedTransmission] = useState('');

    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [showButton, setShowButton] = useState(false)
    const [showSelectedButton, setShowSelectedButton] = useState(false)
    const [showOptions, setShowOptions] = useState(false)


    useEffect(() => {
        async function CarOp(){
            try{
                setError('');
                setMessage('')

                const username = 'MeetMyCar11';

                const where = encodeURIComponent(JSON.stringify({
                    "Make": {
                      "$exists": true
                    },
                    "Model": {
                      "$exists": true
                    }
                }));

                const apiOptionsResponse = await fetch(
                    `https://parseapi.back4app.com/classes/Carmodels_Car_Model_List?limit=9899&order=Make,Model&keys=Make,Model&where=${where}`,
                    {
                        headers:{
                            'X-Parse-Application-Id': 'YyUReDK3a2NOQvywkq6IAv2rTi6qmLM0ycX7hLuL',
                            'X-Parse-REST-API-Key': 'igMaxbtlPDn79NmWd2D3Rj3HTpQXYZPMpzYVfDxI',
                        }
                    }
                );

                if (apiOptionsResponse.ok) {
                    const data = await apiOptionsResponse.text();
                    const obj = JSON.parse(data)

                    setCarData(obj.results)

                    const makes = [...new Set(obj.results.map((car) => car.Make))]
                    const models = [...new Set(obj.results.map((car) => car.Model))]

                    setmakeOptions(makes)
                    setmodelOptions(models)

                } else {
                    setError('Cannot Find Car Make/Model')
                }

            } catch (error) {
                console.log(error)
                
            }
        }
        CarOp();
    }, []);


    const handleSelectCar= (event) => {
        const selectMake = event.target.value;
        setSelectedMake(selectMake);

        const filteredModels = carData.filter(car => car.Make === selectMake).map(car => car.Model);
        setmodelOptions([...new Set(filteredModels)]); 
    };

    const handleFindCar= () => {
        setMessage(false)
        setError(false)
        setShowOptions(true)
        setShowButton(false)
        setShowSelectedButton(true)
    };

    async function handleaddCar(e) {
        e.preventDefault()
        console.log("Add Button Pressed")
        // eslint-disable-next-line
        console.log("Added Car: " + "Make: "  + vehicleMake + " Model: "  + vehicleModel + " Fuel: "  
                        + vehicleFuel + " Transmission: "  + vehicleTransmission )
    }

    async function handleaddSelectedCar(e) {
        e.preventDefault()
        console.log("Selected Button Pressed")
        // eslint-disable-next-line
        console.log("Selected Car: " + "Make: "  + selectedMake + " Model: "  + selectedModel + " Fuel: "  
                        + selectedFuel + " Transmission: "  + selectedTransmission )
    }

    async function handleSearchVehicle(e){
        e.preventDefault()
        setShowButton(false)
        setShowSelectedButton(false)
        setShowOptions(false)

        try{
            setError('');
            setMessage('')

            const username = 'MeetMyCar11';

            // const apiVRNResponse = await fetch(
            //     `https://www.regcheck.org.uk/api/reg.asmx/Check?RegistrationNumber=${vehicleReg.current.value}&username=${username}`
            //     );

            // const apiVRNResponse = await fetch('https://uat.driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'x-api-key':'iQ6sc7eyoR4BD986W8BR5W99uBTCo5KxP7SVym50'
            //     },
            //     body: JSON.stringify({
            //         registrationNumber: 'AA19AAA'
            //     })
            // });

            if (apiVRNResponse.ok) {
                const data = await apiVRNResponse.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, 'text/xml');

                const VRN_vehicleMake = xmlDoc.querySelector('MakeDescription').textContent;
                setvehicleMake(VRN_vehicleMake)
                const VRN_vehicleModel = xmlDoc.querySelector('ModelDescription').textContent;
                setvehicleModel(VRN_vehicleModel)
                const VRN_vehicleFuel = xmlDoc.querySelector('FuelType').textContent;
                setvehicleFuel(VRN_vehicleFuel)
                const VRN_vehicleTransmission = xmlDoc.querySelector('Transmission').textContent;
                setvehicleTransmission(VRN_vehicleTransmission)

                setMessage(
                    <div>
                        <span>Make: {VRN_vehicleMake || 'No Make available.'} </span><br />
                        <span>Model: {VRN_vehicleModel || 'No Model available.'} </span><br />
                        <span>Fuel Type: {VRN_vehicleFuel || 'No Fuel available.'}</span><br />
                        <span>Transmission: {VRN_vehicleTransmission || 'No Transmission available.'} </span><br />
                    </div>
                    
                );
                setShowOptions(false)
                setShowButton(true)
                setShowSelectedButton(false)

            } else {
                setError("Failed To Find Vehicle");
                setMessage(false)
                setShowOptions(true)
                setShowSelectedButton(true)
            }

        } catch (error) {
            setError('Failed To Retrieve Vehicle Information');
            console.log(error)
            setShowOptions(true)
            setShowSelectedButton(true);
        }
    }


  return (
      <>
            <div className="Card">
                <header>
                    <h1 id="addVehicle_text">
                        Add Your Vehicle
                        <p id="slogan_text">Show Your Vehicle</p>
                    </h1>
                    <div id="red-corner"></div>
                </header>

                <form onSubmit={handleSearchVehicle} className='addVehicle_Form'>
                    <div className='vrn_row'>
                        <Form.Group id="vrn">
                            <Form.Control id="vrn_input" type="text" placeholder='Registration Number' ref={vehicleReg} required />
                        </Form.Group>
                    </div>

                    <p className="w-100 text-center mt-3 mb-1" id="error_Msg">{error}</p>

                    <button id="button" className="w-100 mt-2" type="submit">Search Car</button>

                    <p id='vehicleDetail'>{message}</p>
                </form>

                {showButton && (
                    <form className='addVehicle_Form' onSubmit={handleaddCar}>
                        <button id="button" className="w-100 mt-2" type="submit" onSubmit={handleaddCar}>Add Car</button>
                    </form>
                )}

                <form className='addVehicle_Form' onSubmit={handleaddSelectedCar}>
                    {showOptions && (<div>

                            <div className='select-space-between'>
                                <select onChange={handleSelectCar} value={selectedMake}>
                                    <option value="" disabled>Make</option>
                                    {makeOptions.map(make => (
                                        <option key={make} value={make}> {make} </option>
                                    ))}
                                </select>
                            </div>

                            <div className='select-space-between'>
                                <select onChange={(e) => setSelectedModel(e.target.value)} value={selectedModel} disabled={!selectedMake}>
                                    <option value="" disabled>Model</option>
                                    {modelOptions.map(model => ( 
                                        <option key={model} value={model}> {model} </option>
                                    ))}
                                </select>
                            </div>

                            <div className='select-space-between'>
                                <select onChange={(e) => setSelectedFuel(e.target.value)} value={selectedFuel} disabled={!selectedModel.length}>
                                    <option value="" disabled>Fuel</option>
                                    {fuelOptions.map(fuel => (
                                        <option key={fuel} value={fuel}> {fuel} </option>
                                    ))}
                                </select>
                            </div>

                            <div className='select-space-between'>
                                <select onChange={(e) => setSelectedTransmission(e.target.value)} value={selectedTransmission} disabled={!selectedModel.length}>
                                    <option value="" disabled>Transmission</option>
                                    {transmissionOptions.map(transmission => (
                                        <option key={transmission} value={transmission}> {transmission} </option>
                                    ))}
                                </select>
                            </div>
                            
                        </div>
                    )} 

                    {showSelectedButton && (
                        <button id="button" className="w-100 mt-2" type="submit" >Add Selected Car</button>
                    )}
                </form>

                

                

                
                <div id="findVehicle" className="w-100 text-center mt-2">
                    Can't find your car? <Link id='findlink' onClick={handleFindCar}> Find Here</Link>
                </div>
            </div>
        
      </>
    
  )
}