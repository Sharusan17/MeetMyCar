import React, {useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from './AuthContext'

import './CompareSpecs_css.css'

const CompareSpecs = () => {
    const {userid} = useParams()

    const [vehicle, setVehicle] = useState([])
    const [selectedVehicle, setSelectedVehicle] = useState('')

    const {currentUser} = useAuth()

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchUserData(){
            try{
                setError('')

                const firebaseUID = currentUser.uid;
    
                let userQuery

                if(userid){
                    userQuery = `userid=${encodeURIComponent(userid)}`
                } else{
                    userQuery = `userfb=${encodeURIComponent(firebaseUID)}`
                }

                console.log(userQuery)
    
                const response = await fetch(`http://localhost:3001/users/details?${userQuery}`, {
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
    }

    return (
        <>
            <div className='compareVehicle'>        
                <header className='garageHeader'>
                    <h1 id="login_text">
                        Compare
                        <p id="slogan_text">Check Out Which Vehicle Is Better</p>
                    </h1>

                    <Link to="" className="btn btn-dark" id='addvehiclebtn'> Compare Other Vehicle</Link>
                </header>   

                <p className="w-100 text-center mt-3 mb-1" id="success_Msg">{message}</p>
                <p className="w-100 text-center mt-3 mb-1" id="error_Msg">{error}</p>

                <div className='CompareContainer'>
                    <div className='compareHead'>
                        <div className='vehicle1Header'>
                            <h3>EA64SYJ</h3>
                            <img src='https://cdn2.vdicheck.com/VehicleImages/Image.ashx?Id=61867749-220D-465D-8457-5B623D83879F'></img>
                            <h3>Mercedes Benz</h3>
                        </div>

                        <p>VS</p>

                        <div className='vehicle2Header'>
                            <h3>DG55LJK</h3>
                            <img></img>
                            <h3>BMW 4-Series</h3>
                        </div>
                    </div>

                    <div className='compareData'>
                        <div className='compareDataRow'>
                            <p>120</p>
                            <h4>Engine</h4>
                            <p>110</p>
                        </div>

                        <div className='compareDataRow'>
                            <p>120</p>
                            <h4>Power</h4>
                            <p>110</p>
                        </div>

                        <div className='compareDataRow'>
                            <p>120</p>
                            <h4>Price</h4>
                            <p>110</p>
                        </div>

                        <div className='compareDataRow'>
                            <p>120</p>
                            <h4>Top Speed</h4>
                            <p>110</p>
                        </div>

                        <div className='compareDataRow'>
                            <p>120</p>
                            <h4>MPG</h4>
                            <p>110</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompareSpecs
