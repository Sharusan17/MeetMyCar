import React, {useEffect, useRef, useState} from 'react'
import {Form} from 'react-bootstrap'
import {Link} from 'react-router-dom'

import './RegisterVehicle_css.css'

export default function RegisterVehicle({updateImage}) {

    const [carData, setCarData] = useState([])
    const [makeOptions, setmakeOptions] = useState([])
    const [modelOptions, setmodelOptions] = useState([])

    const fuelOptions = ["Petrol", "Diesel", "Hybrid", "Electric"]
    const transmissionOptions = ["Manual", "Automatic", "Semi-Auto"]

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
            setError('');
            setMessage('')

            fetch('http://localhost:3001/vehicle/list')
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Network response was not ok');
                    }
                })
                .then(data => {
                    // console.log("API Data: ", data);

                    setCarData(data.results);

                    const makes = [...new Set(data.results.map(car => car.Make))];
                    const models = [...new Set(data.results.map(car => car.Model))];

                    // console.log("Make", makes);

                    setmakeOptions(makes);
                    setmodelOptions(models);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
        CarOp();
    }, []); 

    const handleSelectCar= (e) => {
        const selectMake = e.target.value;
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
        console.log(`Added Car: Make ${vehicleMake} Model: ${vehicleModel} 
                        Fuel: ${vehicleFuel} Transmission: ${vehicleTransmission}`)
    }

    async function handleaddSelectedCar(e) {
        e.preventDefault()
        console.log("Selected Button Pressed")
        console.log(`Selected Car: Make ${selectedMake} Model: ${selectedModel} 
                        Fuel: ${selectedFuel} Transmission: ${selectedTransmission}`)
    }

    async function handleSearchVehicle(e){
        e.preventDefault()
        setShowButton(false)
        setShowSelectedButton(false)
        setShowOptions(false)

        setError('');
        setMessage('')

        const vehicleRegValue = vehicleReg.current.value;
        
        fetch(`http://localhost:3001/vehicle/search?vrn=${encodeURIComponent(vehicleRegValue)}`)
            .then(response => {
                if (response.ok) {
                    return response.json();

                } else {
                    setError("Failed To Find Vehicle");
                    setMessage(false)
                    setShowOptions(true)
                    setShowSelectedButton(true)
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                // console.log("API Data: ", data);
                // console.log(data.VehicleRegistration.Make)

                const VRN_vehicleMake = data.datainfo.VehicleRegistration.Make;
                setvehicleMake(VRN_vehicleMake)
                const VRN_vehicleModel = data.datainfo.VehicleRegistration.Model;
                setvehicleModel(VRN_vehicleModel)
                const VRN_vehicleFuel = data.datainfo.VehicleRegistration.FuelType;
                setvehicleFuel(VRN_vehicleFuel)
                const VRN_vehicleTransmission = data.datainfo.VehicleRegistration.TransmissionType;
                setvehicleTransmission(VRN_vehicleTransmission)

                updateImage(data.dataImg.VehicleImages.ImageDetailsList[0].ImageUrl)

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

            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Failed To Retrieve Vehicle Information');
                console.log(error)
                setShowOptions(true)
                setShowSelectedButton(true);
            });
    }

    
  return (
      <>
            <div className="Card">
                <header>
                    <h1 id="addVehicle_text">
                        Add Your Vehicle
                        <p id="slogan_text">Show Your Vehicle</p>
                    </h1>
                </header>

                <form onSubmit={handleSearchVehicle} className='addVehicle_Form'>
                    <div className='vrn_row'>
                        <Form.Group id="vrn">
                            <Form.Control id="vrn_input" type="text" placeholder='Registration Number' ref={vehicleReg} required />
                        </Form.Group>
                    </div>

                    <p className="w-100 text-center mt-3 mb-1" id="error_Msg">{error}</p>

                    <button id="button" className="w-100 mt-2" type="submit">Search Vehicle</button>

                    <p id='vehicleDetail'>{message}</p>
                </form>

                {showButton && (
                    <form className='addVehicle_Form' onSubmit={handleaddCar}>
                        <button id="button" className="w-100 mt-2" type="submit" onSubmit={handleaddCar}>Add Vehicle</button>
                    </form>
                )}

                <form className='addVehicle_Form' onSubmit={handleaddSelectedCar}>
                    {showOptions && (<div>

                            <div className='select-space-between'>
                                <select onChange={handleSelectCar} value={selectedMake} required>
                                    <option value="" disabled>Make</option>
                                    {makeOptions.map(make => (
                                        <option key={make} value={make}> {make} </option>
                                    ))}
                                </select>
                            </div>

                            <div className='select-space-between'>
                                <select onChange={(e) => setSelectedModel(e.target.value)} value={selectedModel} disabled={!selectedMake} required>
                                    <option value="" disabled >Model</option>
                                    {modelOptions.map(model => ( 
                                        <option key={model} value={model}> {model} </option>
                                    ))}
                                </select>
                            </div>

                            <div className='select-space-between'>
                                <select onChange={(e) => setSelectedFuel(e.target.value)} value={selectedFuel} disabled={!selectedModel.length} required>
                                    <option value="" disabled >Fuel</option>
                                    {fuelOptions.map(fuel => (
                                        <option key={fuel} value={fuel}> {fuel} </option>
                                    ))}
                                </select>
                            </div>

                            <div className='select-space-between'>
                                <select onChange={(e) => setSelectedTransmission(e.target.value)} value={selectedTransmission} disabled={!selectedModel.length} required>
                                    <option value="" disabled>Transmission</option>
                                    {transmissionOptions.map(transmission => (
                                        <option key={transmission} value={transmission}> {transmission} </option>
                                    ))}
                                </select>
                            </div>
                            
                        </div>
                    )} 

                    {showSelectedButton && (
                        <button id="button" className="w-100 mt-2" type="submit" >Add Selected Vehicle</button>
                    )}
                </form>

                
                <div id="findVehicle" className="w-100 text-center mt-2">
                    Can't find your car? <Link id='findlink' onClick={handleFindCar}> Find Here</Link>
                </div>
            </div>
        
      </>
    
  )
}