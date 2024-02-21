import React, {useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from './AuthContext'

import './CompareSpecs_css.css'

const CompareSpecs = () => {
    const {userid} = useParams()
    const {currentUser} = useAuth()

    const [currentUserId, setCurrentUserId] = useState('')
    const [currentUserName, setCurrentUserName] = useState('')
    const [currentUserProfile, setCurrentUserProfile] = useState('')
    const [currentUserFollowing, setCurrentUserFollowing] = useState('')

    const [vehicle, setVehicle] = useState([])
    const [selectedVehicle, setSelectedVehicle] = useState('')

    const [specData, setSpecData] = useState([
        {specName: 'Ready', time:2000},
        {specName: 'Set', time:1500},
        {specName: 'Go', time:750},
        {specName: 'Engine', vehicle1: '120', vehicle2: '110', time:1500},
        {specName: 'Torque', vehicle1: '210', vehicle2: '1000', time:1500},
        {specName: 'BHP', vehicle1: '250.5', vehicle2: '250.0', time:1500},
    ])

    const [specIndex, setSpecIndex] = useState(0)
    const [vehicle1Large, setVehicle1Large] = useState(null)

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchCurrentUserData(){
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

                    setCurrentUserId(data.userData._id)
                    setCurrentUserName(data.userData.username)
                    setCurrentUserProfile(data.userData.profilePicture)
                    setCurrentUserFollowing(data.userData.following)

                    console.log("Fetched Current User Details")
                    return data
                } else{
                    const errorData = await response.json()
                    setError("Failed To Fetch Current User Data")
                    throw new Error(errorData.message)
                }
            }catch (error){
                console.error("Error Fetching Current User Data:", error)
                setError("Failed To Fetch Current User Data")
            }
        }
        fetchCurrentUserData();
    }, [currentUser.uid]); 

    useEffect(() => {
        if (specIndex < specData.length){

            if (specData[specIndex] && specData[specIndex].vehicle1 && specData[specIndex].vehicle2){
                checkSpec(specData[specIndex])
            }
            
            const nextSpecId = setInterval( () => {
                setSpecIndex((prevIndex) => {
                    if (prevIndex + 1 < specData.length){
                        return prevIndex + 1
                    } else{
                        clearInterval(nextSpecId)
                        return prevIndex
                    }
                })
            } ,specData[specIndex].time)
            return () => clearInterval(nextSpecId)
        }
    }, [specData, specIndex])

    const checkSpec = (currentSpec) => {
        setVehicle1Large(null)
        if (parseFloat(currentSpec.vehicle1) > parseFloat(currentSpec.vehicle2)){
            console.log("Vehicle 1 Spec is larger")
            setVehicle1Large(true)
        } 
        if (parseFloat(currentSpec.vehicle2) > parseFloat(currentSpec.vehicle1)){
            console.log("Vehicle 2 Spec is larger")
            setVehicle1Large(false)
        }
        if (parseFloat(currentSpec.vehicle2) == parseFloat(currentSpec.vehicle1)){
            console.log("Vehicle 2 Spec is larger")
            setVehicle1Large(null)
        }        
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

                <div className='compareUser'>
                    <div className='vehicle1User'>
                        <div className='vehicleUserRow'>
                            {currentUserProfile && (
                                <img className='vehicleUserProfile'
                                    src={`http://localhost:3001/${currentUserProfile}`} 
                                    alt="Profile"
                                />
                            )}
                            <p className='vehicleUserName'>hellolast</p>
                        </div>
                        
                        <p className='vehicleName'>BMW 4 Series</p>
                        <p className='vehicleVRN'>EA64 SYJ</p>
                    </div>

                    <div className='vehicle2User'>
                        <div className='vehicleUserRow'>
                            {currentUserProfile && (
                                <img className='vehicleUserProfile'
                                    src={`http://localhost:3001/${currentUserProfile}`} 
                                    alt="Profile"
                                />
                            )}
                            <p className='vehicleUserName'>hellolast</p>
                        </div>                        
                        
                        <p className='vehicleName'>Mercedes Benz</p>
                        <p className='vehicleVRN'>DA67 KJY</p>
                    </div>
                </div>
                
                <div className='compareSpecData'>
                    <div className='compareSpecDataRow'>
                        <p className={vehicle1Large === true ? 'green' : vehicle1Large === false ? 'red' : 'green'}>{specData[specIndex]?.vehicle1}</p>
                        <h4>{specData[specIndex]?.specName}</h4>
                        <p className={vehicle1Large === false ? 'green' : vehicle1Large === true ? 'red' : 'green'}>{specData[specIndex]?.vehicle2}</p>
                    </div>
                </div>

                <div className='compareRace'>
                    <div className="vehicle1Race" style={{ transform: `translateX(0%)` }}>
                        <img src='https://cdn2.vdicheck.com/VehicleImages/Image.ashx?Id=C46C4C00-94D3-4447-8BBD-F9A22FE46948'></img>
                    </div>

                    <div className="vehicle2Race" style={{ transform: `translateX(0%)` }}>
                    <img src='https://cdn2.vdicheck.com/VehicleImages/Image.ashx?Id=C46C4C00-94D3-4447-8BBD-F9A22FE46948'></img>
                    </div>
                </div>

                {/* <div className='CompareContainer'>
                    <div className='compareHead'>
                        <div className='vehicle1Header'>
                            <h3>EA64SYJ</h3>
                            <img src='https://cdn2.vdicheck.com/VehicleImages/Image.ashx?Id=61867749-220D-465D-8457-5B623D83879F'></img>
                            <h3>Mercedes Benz</h3>
                        </div>

                        <p>VS</p>

                        <div className='vehicle2Header'>
                            <h3>DG55LJK</h3>
                            <img src='https://cdn2.vdicheck.com/VehicleImages/Image.ashx?Id=61867749-220D-465D-8457-5B623D83879F'></img>
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
                </div> */}
            </div>
        </>
    )
}

export default CompareSpecs
