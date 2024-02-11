import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import {Popup} from 'reactjs-popup'

import './Garage_css.css'

const Garage = () => {

    const [vehicle, setVehicle] = useState([])
    const [selectedVehicle, setSelectedVehicle] = useState('')
    const [openModal, setOpenModal] = useState(false)
    
    const {currentUser} = useAuth()
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchUserData(){
            try{
                setError('')

                const firebaseUID = currentUser.uid;
    
                const response = await fetch(`http://localhost:3001/users/details?userfb=${encodeURIComponent(firebaseUID)}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });
    
                if (response.ok){
                    const data = await response.json()

                    const vehicleData = await Promise.all(data.userData.vehicles.map(async (vehicle) => {
                        if(vehicle?.vehicleId){
                            const VehicleReponse = await fetch(`http://localhost:3001/vehicles/view?vehicleId=${encodeURIComponent(vehicle.vehicleId)}`, {
                                method: 'GET',
                                headers: {
                                    'accept': 'application/json',
                                },
                            });

                            if(VehicleReponse.ok){
                                const vehicle_Data = await VehicleReponse.json()
                                return vehicle_Data
                            } else{
                                console.error("Error Fetching Vehicle Data:", error)
                                setError("Error Fetching Your Vehicles. Try Again Later")
                                return null
                            }
                        }
                    }))

                    const vehicleWithData = vehicleData.filter(vehicle => vehicle !== null)
                    setVehicle(vehicleWithData)
    
                    console.log("Fetched User Details")
                    return data
                } else{
                    const errorData = await response.json()
                    throw new Error(errorData.message)
                }
            }catch (error){
                console.error("Error Fetching User Data:", error)
                setError("Error Fetching User. Try Again Later")
            }
        }
        fetchUserData();
    }, [currentUser.uid]);

    const handleSelectCard = (vehicle) => {
        console.log("Selected:", vehicle)
        setSelectedVehicle(vehicle)
        setOpenModal(true)
    }

    return (
        <>
            <div className='showGarage'>        
                <header className='garageHeader'>
                    <h1 id="login_text">
                        Garage
                        <p id="slogan_text">Check Out Your Vehicles</p>
                    </h1>

                    <Link to="/registervehicle" className="btn btn-dark"> Add Vehicle</Link>
                </header>   

                <p className="w-100 text-center mt-3 mb-1" id="error_Msg">{error}</p>

                <div className='Cards'>
                    {vehicle.map((vehicles, index) => (
                        <div key={index}  className='carCard' onClick={() => handleSelectCard(vehicles)}>
                                <div className='cardHeader'>
                                    <h3>{vehicles.vehicleData?.vehicleInfo.VehicleRegistration.MakeModel}</h3>
                                    <p>{vehicles.vehicleData?.vrn}</p>
                                </div>

                                <div className='cardImage'>
                                    <img src={vehicles.vehicleData?.image} alt='Vehicle'></img>
                                </div>

                                <div className='cardFooter'>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M13 19.92c1.8-.22 3.35-.97 4.65-2.27c1.3-1.3 2.05-2.85 2.27-4.65h-3c-.22 1-.68 1.84-1.38 2.54c-.7.7-1.54 1.16-2.54 1.38zM10 8h4l3 3h2.92c-.25-1.95-1.13-3.62-2.65-5C15.76 4.66 14 4 12 4c-2 0-3.76.66-5.27 2c-1.52 1.38-2.4 3.05-2.65 5H7zm1 11.92v-3c-1-.22-1.84-.68-2.54-1.38c-.7-.7-1.16-1.54-1.38-2.54h-3c.22 1.77.97 3.3 2.27 4.6c1.3 1.3 2.85 2.07 4.65 2.32M12 2c2.75 0 5.1 1 7.05 2.95C21 6.9 22 9.25 22 12s-1 5.1-2.95 7.05C17.1 21 14.75 22 12 22s-5.1-1-7.05-2.95C3 17.1 2 14.75 2 12s1-5.1 2.95-7.05C6.9 3 9.25 2 12 2"/></svg> 
                                        <p>{vehicles.vehicleData?.vehicleInfo.VehicleRegistration.TransmissionType}</p>
                                    </div>

                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 18S4 10 4 6s2-4 2-4h1s1 0 1 1s-1 1-1 3s3 4 3 7s-3 5-3 5m5-1c-1 0-4 2.5-4 2.5c-.3.2-.2.5 0 .8c0 0 1 1.8 3 1.8h6c1.1 0 2-.9 2-2v-1c0-1.1-.9-2-2-2h-5Z"/></svg>
                                        <p>{vehicles.vehicleData?.vehicleInfo.VehicleRegistration.SeatingCapacity} Seats</p>
                                    </div>
                                    
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 16 16"><path fill="currentColor" d="M1 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1 2 2v.5a.5.5 0 0 0 1 0V8h-.5a.5.5 0 0 1-.5-.5V4.375a.5.5 0 0 1 .5-.5h1.495c-.011-.476-.053-.894-.201-1.222a.97.97 0 0 0-.394-.458c-.184-.11-.464-.195-.9-.195a.5.5 0 0 1 0-1q.846-.002 1.412.336c.383.228.634.551.794.907c.295.655.294 1.465.294 2.081V7.5a.5.5 0 0 1-.5.5H15v4.5a1.5 1.5 0 0 1-3 0V12a1 1 0 0 0-1-1v4h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1zm2.5 0a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5z"/></svg>
                                        <p>{vehicles.vehicleData?.vehicleInfo.VehicleRegistration.FuelType}</p>
                                    </div>                        
                                </div>
                        </div>
                    ))}
                </div>   

                <Popup open={openModal} closeOnDocumentClick onClose={() => setOpenModal(false)}>
                    <div className='Modal'>
                        {selectedVehicle ? (
                            <>
                                <h2>{selectedVehicle.vehicleData?.vehicleInfo.VehicleRegistration.MakeModel}</h2>
                            </>
                        ) : <p>Loading....</p>}
                    </div>
                </Popup>      
            </div>
        </>
    )
}

export default Garage