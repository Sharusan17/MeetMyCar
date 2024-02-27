import React, {useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from './AuthContext'
import {Popup} from 'reactjs-popup'

import './CompareSpecs_css.css'

const CompareSpecs = () => {
    const {userid} = useParams()
    const {currentUser} = useAuth()

    const [currentUserId, setCurrentUserId] = useState('')
    const [currentUserName, setCurrentUserName] = useState('')
    const [currentUserProfile, setCurrentUserProfile] = useState('')
    const [currentUservehicle, setCurrentUserVehicle] = useState([])

    const [selectedMyVehicle, setSelectedMyVehicle] = useState('')

    const [profileUserId, setProfileUserId] = useState('')
    const [profileUserName, setProfileUserName] = useState('')
    const [profileUserProfile, setProfileUserProfile] = useState('')
    const [profileUservehicle, setProfileUserVehicle] = useState([])

    const [selectedProfileVehicle, setSelectedProfileVehicle] = useState('')

    const [startRace, setStartRace] = useState(false)
    const [specData, setSpecData] = useState([
        {specName: 'Ready', time:2000},
        {specName: 'Set', time:1500},
        {specName: 'Go', time:1000},
        {specName: 'Speed', vehicle1: '', vehicle2: '', time:1500},
        {specName: 'Torque', vehicle1: '', vehicle2: '', time:1500},
        {specName: 'RPM', vehicle1: '', vehicle2: '', time:1500},
        {specName: 'BHP', vehicle1: '', vehicle2: '', time:1500},
        {specName: 'MPG', vehicle1: '', vehicle2: '', time:1750},

    ])

    const [specIndex, setSpecIndex] = useState(0)
    const [vehicle1Large, setVehicle1Large] = useState(null)
    const [currentV1Position, setVehicle1Position] = useState(0)
    const [currentV2Position, setVehicle2Position] = useState(0)

    const [currentV1SpeedFactor, setV1RaceSpeedFactor] = useState(0)
    const [currentV2SpeedFactor, setV2RaceSpeedFactor] = useState(0)

    const [vehicle1Points, setVehicle1Point] = useState(0)
    const [vehicle2Points, setVehicle2Point] = useState(0)

    const [openModal, setOpenModal] = useState(false)
    const [pointsUpdate, setPointsUpdated] = useState(false)

    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchCurrentUserData(){
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

                    setCurrentUserId(data.userData._id)
                    setCurrentUserName(data.userData.username)
                    setCurrentUserProfile(data.userData.profilePicture)

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
                    setCurrentUserVehicle(vehicleWithData)

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
        async function fetchProfileUserData(){
            try{
                setError('')
    
                const response = await fetch(`http://localhost:3001/users/details?userid=${encodeURIComponent(userid)}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });

                if (response.ok){
                    const data = await response.json()

                    setProfileUserId(data.userData._id)
                    setProfileUserName(data.userData.username)
                    setProfileUserProfile(data.userData.profilePicture)

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
                                console.error("Error Fetching Profile's Vehicle Data:", error)
                                setError("Error Fetching Profile's Vehicles. Try Again Later")
                                return null
                            }
                        }
                    }))

                    const vehicleWithData = vehicleData.filter(vehicle => vehicle !== null)
                    setProfileUserVehicle(vehicleWithData)

                    console.log("Fetched Profile's User Details")
                    return data
                } else{
                    const errorData = await response.json()
                    setError("Failed To Fetch Profile's User Data")
                    throw new Error(errorData.message)
                }
            }catch (error){
                console.error("Error Fetching Profile's User Data:", error)
                setError("Failed To Fetch Profile's User Data")
            }
        }
        fetchProfileUserData();
    }, []);

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
                        setOpenModal(true)
                        if (!pointsUpdate){
                            updatePoints()
                            setPointsUpdated(true)
                        }
                        return prevIndex
                    }
                })
            } ,specData[specIndex].time)
            return () => clearInterval(nextSpecId)
        }
    }, [specData, specIndex])

    useEffect(() => {
        const raceIntervalId = setInterval( () => {
            if(specIndex >= 2){
                setVehicle1Position(prevPosition => prevPosition + (100 + currentV1SpeedFactor))
                setVehicle2Position(prevPosition => prevPosition + (100 + currentV2SpeedFactor))
            } 
        } ,1000)
        return () => clearInterval(raceIntervalId)
    }, [currentV1SpeedFactor, currentV2SpeedFactor, specIndex])

    const checkSpec = (currentSpec) => {
        setVehicle1Large(null)
        if (parseFloat(currentSpec.vehicle1) > parseFloat(currentSpec.vehicle2)){
            console.log("Vehicle 1 Spec is larger")
            setVehicle1Large(true)
            setVehicle1Point(vehicle1Points+1)
            setV1RaceSpeedFactor((vehicle1Points+1)*75)
        } 
        if (parseFloat(currentSpec.vehicle2) > parseFloat(currentSpec.vehicle1)){
            console.log("Vehicle 2 Spec is larger")
            setVehicle1Large(false)
            setVehicle2Point(vehicle2Points+1)
            setV2RaceSpeedFactor((vehicle2Points+1)*75)
        }
        if (parseFloat(currentSpec.vehicle1) === parseFloat(currentSpec.vehicle2)){
            console.log("Vehicle 2 Spec is larger")
            setVehicle1Large(null)
            setVehicle1Point(vehicle1Points+1)
            setVehicle2Point(vehicle2Points+1)
        }        
    }

    function handleSelectMyVehicle(e){
        const vehicle_Id= e.target.value;
        const selectVehicle = currentUservehicle.find(v => v.vehicleData._id === vehicle_Id)
        setSelectedMyVehicle(selectVehicle);
    };

    function handleSelectProfileVehicle(e){
        const vehicle_Id= e.target.value;
        const selectVehicle = profileUservehicle.find(v => v.vehicleData._id === vehicle_Id)
        setSelectedProfileVehicle(selectVehicle);
    };

    function updateSpec(){
        if (selectedMyVehicle && selectedProfileVehicle){
            const updateSpecData = specData.map((spec) => {
                if(spec.specName === 'Speed') {
                    return {
                        ...spec,
                        vehicle1: selectedMyVehicle?.vehicleData.vehicleInfo.Performance.MaxSpeed.Mph,
                        vehicle2: selectedProfileVehicle?.vehicleData.vehicleInfo.Performance.MaxSpeed.Mph
                    }
                }
                else if(spec.specName === 'Torque') {
                    return {
                        ...spec,
                        vehicle1: selectedMyVehicle?.vehicleData.vehicleInfo.Performance.Torque.Nm,
                        vehicle2: selectedProfileVehicle?.vehicleData.vehicleInfo.Performance.Torque.Nm
                    }
                }
                else if(spec.specName === 'RPM') {
                    return {
                        ...spec,
                        vehicle1: selectedMyVehicle?.vehicleData.vehicleInfo.Performance.Torque.Rpm,
                        vehicle2: selectedProfileVehicle?.vehicleData.vehicleInfo.Performance.Torque.Rpm
                    }
                }
                else if(spec.specName === 'BHP') {
                    return {
                        ...spec,
                        vehicle1: selectedMyVehicle?.vehicleData.vehicleInfo.Performance.Power.Bhp,
                        vehicle2: selectedProfileVehicle?.vehicleData.vehicleInfo.Performance.Power.Bhp
                    }
                }
                else if(spec.specName === 'MPG') {
                    return {
                        ...spec,
                        vehicle1: selectedMyVehicle?.vehicleData.vehicleInfo.Consumption.Combined.Mpg,
                        vehicle2: selectedProfileVehicle?.vehicleData.vehicleInfo.Consumption.Combined.Mpg
                    }
                }
                return spec
            })
            setSpecData(updateSpecData)
            setSpecIndex(0)
            setVehicle1Position(0)
            setVehicle2Position(0)
            setVehicle1Point(0)
            setVehicle2Point(0)
            setOpenModal(false)
            setPointsUpdated(false)
            setStartRace(true)
        } else{
            setError('Choose Both Vehicles To Start The Race')
        }
    }

    async function updatePoints(){

        setError('')

        try{
            const firebaseUID = currentUser.uid;
            let response
            let pointsProfileResponse

            if (vehicle1Points > vehicle2Points){
                response = await fetch(`http://localhost:3001/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({winVRNPoints: selectedProfileVehicle.vehicleData._id, 
                            winUserPoints: selectedProfileVehicle.vehicleData.user._id,
                            winVRN: selectedProfileVehicle.vehicleData.vrn})
                    
                });

                if (!response.ok){
                    const errorData = await response.json()
                    setError("Failed To Update User's Points")
                    console.error("Error Updating User's Points:", error)
                    throw new Error(errorData.message)  
                }

                pointsProfileResponse = await fetch(`http://localhost:3001/users/update?userid=${encodeURIComponent(userid)}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({lostVRNPoints: selectedMyVehicle.vehicleData._id,
                             lostUserPoints: selectedMyVehicle.vehicleData.user._id,
                             lostVRN:selectedMyVehicle.vehicleData.vrn})
                });

                if (!pointsProfileResponse.ok){
                    const errorData = await response.json()
                    setError("Failed To Update Profile's Points")
                    console.error("Error Updating Profile's Points:", error)
                    throw new Error(errorData.message)  
                }
            } 

            else if (vehicle2Points > vehicle1Points){
                response = await fetch(`http://localhost:3001/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({lostVRNPoints: selectedProfileVehicle.vehicleData._id, 
                            lostUserPoints: selectedProfileVehicle.vehicleData.user._id,
                            lostVRN:selectedProfileVehicle.vehicleData.vrn})
                });

                if (!response.ok){
                    const errorData = await response.json()
                    setError("Failed To Update User's Points")
                    console.error("Error Updating User's Points:", error)
                    throw new Error(errorData.message)  
                }

                pointsProfileResponse = await fetch(`http://localhost:3001/users/update?userid=${encodeURIComponent(userid)}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({winVRNPoints: selectedMyVehicle.vehicleData._id, 
                            winUserPoints: selectedMyVehicle.vehicleData.user._id,
                            winVRN: selectedMyVehicle.vehicleData.vrn})
                });

                if (!pointsProfileResponse.ok){
                    const errorData = await response.json()
                    setError("Failed To Update Profile's Points")
                    console.error("Error Updating Profile's Points:", error)
                    throw new Error(errorData.message)  
                }
            }

            console.log("Points Updated")

        }catch (error){
            console.error("Error Updating Points:", error)
            setError("Failed To Update Points")
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

                    <Link to="" className="btn btn-dark" id='addvehiclebtn'> Race Other Vehicle</Link>
                </header>   

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
                            <Link to={`/profile/${currentUserId}`} className='vehicleUserName'>{currentUserName}</Link>
                        </div>
                            
                        <p className='vehicleName'>{selectedMyVehicle?.vehicleData?.vehicleHistory?.make} {selectedMyVehicle?.vehicleData?.vehicleHistory?.model}</p>
                        <select className='vehicleVRN' onChange={handleSelectMyVehicle} value={selectedMyVehicle?.vehicleData?._id} required>
                            <option value="" disabled>VRN</option>
                            {currentUservehicle.map(vehicle => ( 
                                <option key={vehicle?.vehicleData?._id} value={vehicle?.vehicleData?._id}> {vehicle?.vehicleData?.vrn} </option>
                            ))}
                        </select>
                    </div>

                    <div className='vehicle2User'>
                        <div className='vehicleUserRow'>
                            {currentUserProfile && (
                                <img className='vehicleUserProfile'
                                    src={`http://localhost:3001/${profileUserProfile}`} 
                                    alt="Profile"
                                />
                            )}
                            <Link to={`/profile/${profileUserId}`} className='vehicleUserName'>{profileUserName}</Link>
                        </div>                        
                        
                         <p className='vehicleName'>{selectedProfileVehicle?.vehicleData?.vehicleHistory?.make} {selectedProfileVehicle?.vehicleData?.vehicleHistory?.model}</p>
                        <select className='vehicleVRN' onChange={handleSelectProfileVehicle} value={selectedProfileVehicle?.vehicleData?._id} required>
                            <option value="" disabled>VRN</option>
                            {profileUservehicle.map(vehicle => ( 
                                <option key={vehicle?.vehicleData?._id} value={vehicle?.vehicleData?._id}> {vehicle?.vehicleData?.vrn} </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='RaceTrack'>
                    {startRace ? (
                        <>
                            <div className='compareSpecData'>
                                <div className='compareSpecDataRow'>
                                    <p className={vehicle1Large === true ? 'green' : vehicle1Large === false ? 'red' : 'green'}>{specData[specIndex].vehicle1}</p>
                                    <h4 className={specData[specIndex].specName === 'Ready' ? 'red' : specData[specIndex].specName === 'Set' ? 'orange' : specData[specIndex].specName === 'Go' ? 'green' : ''}>{specData[specIndex].specName}</h4>
                                    <p className={vehicle1Large === false ? 'green' : vehicle1Large === true ? 'red' : 'green'}>{specData[specIndex].vehicle2}</p>
                                </div>
                            </div>

                            <div className='compareRace'>
                                <div className="vehicle1Race" style={{ transform: `translateX(${currentV1Position}px)` }}>
                                    <img src={selectedMyVehicle?.vehicleData?.image}></img>
                                </div>

                                <div className="vehicle2Race" style={{ transform: `translateX(${currentV2Position}px)` }}>
                                <img src={selectedProfileVehicle?.vehicleData?.image}></img>
                                </div>
                            </div>

                            <Popup open={openModal} closeOnDocumentClick onClose={() => setOpenModal(false)} className='Popsup'>
                                <div className='Modal'>
                                    <div className='compareBanner'>
                                        {vehicle1Points > vehicle2Points ? (
                                            <>
                                                <div className='winBanner'>
                                                    <h1 className='textBanner'> Winner</h1>
                                                    <p className='subTextBanner'>Nice One, Keep This UP</p>
                                                </div>
                                            </>
                                        ) : vehicle1Points < vehicle2Points ? (
                                            <>
                                                <div className='lostBanner'>
                                                    <h1 className='textBanner'> Loser</h1>
                                                    <p className='subTextBanner'>Good Luck On Next Time</p>
                                                </div>                                
                                            </>
                                            ) : (
                                                <>
                                                    <div className='drawBanner'>
                                                        <h1 className='textBanner'> Draw</h1>
                                                        <p className='subTextBanner'>Seems Like It's upto The Driver</p>
                                                    </div>                                
                                                </>
                                        )}
                                    </div>
                                    <div className='compareHead'>
                                        <div className='vehicle1Header'>
                                            <h3>{selectedMyVehicle?.vehicleData?.vrn}</h3>
                                            <img src={selectedMyVehicle?.vehicleData?.image}></img>
                                            <h3>{selectedMyVehicle?.vehicleData?.vehicleHistory?.make} {selectedMyVehicle?.vehicleData?.vehicleHistory?.model}</h3>
                                        </div>

                                        <p>VS</p>

                                        <div className='vehicle2Header'>
                                            <h3>{selectedProfileVehicle?.vehicleData?.vrn}</h3>
                                            <img src={selectedProfileVehicle?.vehicleData?.image}></img>
                                            <h3>{selectedProfileVehicle?.vehicleData?.vehicleHistory?.make} {selectedProfileVehicle?.vehicleData?.vehicleHistory?.model}</h3>
                                        </div>
                                    </div>

                                    <div className='compareData'>
                                        {/* Slice to remove the ready, set, go in the specData*/}
                                        {specData.slice(3).map((specs, index) => (
                                            <div key={index} className='compareDataRow'>
                                                <p className={specs.vehicle1 > specs.vehicle2 ? 'green' : specs.vehicle2 > specs.vehicle1 ? 'red' : ''}>{specs.vehicle1}</p>
                                                <h4 className={specs.vehicle1 > specs.vehicle2 ? 'green' : specs.vehicle2 > specs.vehicle1 ? 'red' : ''}>{specs.specName}</h4>
                                                <p className={specs.vehicle2 > specs.vehicle1 ? 'green' : specs.vehicle1 > specs.vehicle2 ? 'red' : ''}>{specs.vehicle2}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {vehicle1Points > vehicle2Points ? (
                                        <>
                                            <button className="btn btn-outline-success w-100 mt-1" onClick={() => window.location.reload()}>Race Again</button>
                                        </>
                                    ) : vehicle1Points < vehicle2Points ? (
                                        <>
                                            <button className="btn btn-outline-danger w-100 mt-1" onClick={() => window.location.reload()}>Race Again</button>
                                        </>
                                        ) : (
                                            <>
                                            <button className="btn btn-outline-dark w-100 mt-1" onClick={() => window.location.reload()}>Race Again</button>
                                        </>
                                    )}
                                </div> 
                            </Popup>
                        </>
                    ) : (
                        <>
                            <div className='compareSpecData'>
                                {selectedMyVehicle&&selectedProfileVehicle ? (
                                    <button className='btn btn-dark' id='racebtn' onClick={updateSpec}> Ready To Race</button>
                                ) : (
                                    <p className="w-100 text-center mt-3 mb-1" id="success_Msg">Choose Both Vehicles To Start The Race</p>
                                )}
                            </div>
                        </>
                    )}

                </div>
                
            </div>
        </>
    )
}

export default CompareSpecs
