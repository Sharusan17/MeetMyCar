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

    const [selectedVehicle, setSelectedVehicle] = useState('')

    const [startRace, setStartRace] = useState(false)

    const [specData, setSpecData] = useState([
        {specName: 'Ready', time:2000},
        {specName: 'Set', time:1500},
        {specName: 'Go', time:1000},
        {specName: 'Engine', vehicle1: '200', vehicle2: '110', time:1500},
        {specName: 'Torque', vehicle1: '300', vehicle2: '200', time:1500},
        {specName: 'BHP', vehicle1: '250.0', vehicle2: '250.0', time:1750},
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

    const [error, setError] = useState('')

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
                    setCurrentUserVehicle(data.userData.vehicles)

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
                        setOpenModal(true)
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

    function handleSelectVehicle(e){
        const vehicle_Id= e.target.value;
        const selectVehicle = currentUservehicle.find(v => v.vehicleId === vehicle_Id)
        setSelectedVehicle(selectVehicle);
    };

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
                        <select className='vehicleVRN' onChange={handleSelectVehicle} value={selectedVehicle.vehicleId} required>
                            <option value="" disabled>VRN</option>
                            {currentUservehicle.map(vehicle => ( 
                                <option key={vehicle.vehicleId} value={vehicle.vehicleId}> {vehicle.vrn} </option>
                            ))}
                        </select>
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
                                    <img src='https://cdn2.vdicheck.com/VehicleImages/Image.ashx?Id=D00E0F25-5089-4986-BB9E-4CFA5AA0E51C'></img>
                                </div>

                                <div className="vehicle2Race" style={{ transform: `translateX(${currentV2Position}px)` }}>
                                <img src='https://cdn2.vdicheck.com/VehicleImages/Image.ashx?Id=D00E0F25-5089-4986-BB9E-4CFA5AA0E51C'></img>
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
                                <button className='btn btn-dark' id='racebtn' onClick={() => setStartRace(true)}> Ready To Race</button>
                            </div>
                        </>
                    )}

                </div>
                
            </div>
        </>
    )
}

export default CompareSpecs
