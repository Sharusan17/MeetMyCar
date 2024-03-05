import React, {useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from './AuthContext'
import {Popup} from 'reactjs-popup'

import './Garage_css.css'

const Garage = () => {
    const {userid} = useParams()

    const [profileWins, setProfileWins] = useState([])
    const [profileLosts, setProfileLosts] = useState([])

    const [vehicle, setVehicle] = useState([])
    const [selectedVehicle, setSelectedVehicle] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const [openWinModal, setOpenWinModal] = useState(false)
    const [openLostModal, setOpenLostModal] = useState(false)
    const [confirmDeleteVehicle, setconfirmDeleteVehicle] = useState(false)
    const [showData, setData] = useState(true)

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

                    setProfileWins(data.userData.winPoints)
                    setProfileLosts(data.userData.lostPoints)
    
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
        setconfirmDeleteVehicle(false)
        setOpenModal(true)
        setData(true)
    }

    async function handleDelete(vehicleId){

        if (!confirmDeleteVehicle){
            setconfirmDeleteVehicle(true)
            return
        }

        setLoading(true)
        setError('')
        setMessage('')

        try{
            const firebaseUID = currentUser.uid;

            const response = await fetch(`http://localhost:3001/users/update?userfb=${encodeURIComponent(firebaseUID)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({vehicleIdRemove: vehicleId})
            });

            if (response.ok){
                console.log("Deleted Vehicle")
                setMessage("Vehicle Deleted")
                setOpenModal(false)
                setTimeout(() => {
                    window.location.reload(false);
                }, 1000)
            } else{
                const errorData = await response.json()
                setError("Failed To Delete Vehicle")
                console.error("Error Deleting Vehicle:", error)
                throw new Error(errorData.message)
            }
        }catch (error){
            console.error("Error Deleting Vehicle:", error)
            setError("Failed To Delete Vehicle")
        }finally{
            setLoading(false)
        }
    }

    return (
        <>
            <div className='showGarage'>        
                <header className='garageHeader'>
                    <h1 id="login_text">
                        Garage
                        <p id="slogan_text">Check Out Your Vehicles</p>
                    </h1>

                    <div className='showUserData'>
                        <div className='showUserDataNum'>
                            <p> <span>{vehicle.length}</span> Vehicles</p>
                            <p onClick={() => setOpenWinModal(true)}> <span>{profileWins.length}</span> Wins</p>
                            <p onClick={() => setOpenLostModal(true)}> <span>{profileLosts.length}</span> Losts</p>
                        </div>

                        <Link to="/registervehicle" className="btn btn-dark" id='checkbtn'> Add Vehicle</Link>  
                    </div>
                   
                </header>   

                <p className="w-100 text-center mt-3 mb-1" id="success_Msg">{message}</p>
                <p className="w-100 text-center mt-3 mb-1" id="error_Msg">{error}</p>

                <div className='Cards'>
                    {vehicle.map((vehicles, index) => (
                        <div key={index}  className='carCard' onClick={() => handleSelectCard(vehicles)}>
                                <div className='cardHeader'>
                                    <h3>{vehicles.vehicleData?.vehicleInfo?.VehicleRegistration?.MakeModel}</h3>
                                    <Link className='link' to={`/race/${userid}`}>{vehicles.vehicleData?.vrn}</Link>
                                </div>

                                <div className='cardImage'>
                                    <img src={vehicles.vehicleData?.image} alt='Vehicle'></img>
                                </div>

                                <div className='cardFooter'>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M13 19.92c1.8-.22 3.35-.97 4.65-2.27c1.3-1.3 2.05-2.85 2.27-4.65h-3c-.22 1-.68 1.84-1.38 2.54c-.7.7-1.54 1.16-2.54 1.38zM10 8h4l3 3h2.92c-.25-1.95-1.13-3.62-2.65-5C15.76 4.66 14 4 12 4c-2 0-3.76.66-5.27 2c-1.52 1.38-2.4 3.05-2.65 5H7zm1 11.92v-3c-1-.22-1.84-.68-2.54-1.38c-.7-.7-1.16-1.54-1.38-2.54h-3c.22 1.77.97 3.3 2.27 4.6c1.3 1.3 2.85 2.07 4.65 2.32M12 2c2.75 0 5.1 1 7.05 2.95C21 6.9 22 9.25 22 12s-1 5.1-2.95 7.05C17.1 21 14.75 22 12 22s-5.1-1-7.05-2.95C3 17.1 2 14.75 2 12s1-5.1 2.95-7.05C6.9 3 9.25 2 12 2"/></svg> 
                                        <p>{vehicles.vehicleData?.vehicleInfo?.VehicleRegistration?.TransmissionType}</p>
                                    </div>

                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 18S4 10 4 6s2-4 2-4h1s1 0 1 1s-1 1-1 3s3 4 3 7s-3 5-3 5m5-1c-1 0-4 2.5-4 2.5c-.3.2-.2.5 0 .8c0 0 1 1.8 3 1.8h6c1.1 0 2-.9 2-2v-1c0-1.1-.9-2-2-2h-5Z"/></svg>
                                        <p>{vehicles.vehicleData?.vehicleInfo?.VehicleRegistration?.SeatingCapacity} Seats</p>
                                    </div>
                                    
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 16 16"><path fill="currentColor" d="M1 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1 2 2v.5a.5.5 0 0 0 1 0V8h-.5a.5.5 0 0 1-.5-.5V4.375a.5.5 0 0 1 .5-.5h1.495c-.011-.476-.053-.894-.201-1.222a.97.97 0 0 0-.394-.458c-.184-.11-.464-.195-.9-.195a.5.5 0 0 1 0-1q.846-.002 1.412.336c.383.228.634.551.794.907c.295.655.294 1.465.294 2.081V7.5a.5.5 0 0 1-.5.5H15v4.5a1.5 1.5 0 0 1-3 0V12a1 1 0 0 0-1-1v4h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1zm2.5 0a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5z"/></svg>
                                        <p>{vehicles.vehicleData?.vehicleInfo?.VehicleRegistration?.FuelType}</p>
                                    </div>                        
                                </div>
                        </div>
                    ))}
                </div>   

                <Popup open={openModal} 
                        closeOnDocumentClick onClose={() => setOpenModal(false)} className='Popup'
                        overlayStyle={{
                            background: 'rgba(0, 0, 0, 0.2)', 
                            transition: 'background 0.5s ease-in-out',
                        }}
                >
                    <div className='Modal'>
                        {selectedVehicle ? (
                            <>
                                <div className='modalHeader'>
                                    <div>
                                        <h3>{selectedVehicle.vehicleData?.vehicleInfo?.VehicleRegistration?.MakeModel}</h3>
                                        <p className='raceTextGarage'>Race Me</p>
                                        <Link className='link' to={`/race/${userid}`}>{selectedVehicle.vehicleData?.vrn}</Link>
                                    </div>
                                    {showData ? (
                                        <>
                                            <button className="btn btn-dark" onClick={() => setData(false)}>History</button>
                                        </>
                                    ):  
                                        <>
                                            <button className="btn btn-dark" onClick={() => setData(true)}>Information</button>
                                        </>
                                    }
                                </div> 

                                <div className='modalImage'>
                                    <img src={selectedVehicle.vehicleData?.image} alt='Vehicle'></img>
                                </div>

                                <div className='modalData'>
                                    {showData ? (
                                        <>
                                            <div className='line'> 
                                                <span className='lineText'>Information</span>
                                            </div>

                                            <div className='dataInfo'>
                                                <div>
                                                    <h4 className='info_title'>Colour</h4>
                                                    <p className='info_data'>{selectedVehicle.vehicleData?.vehicleInfo?.VehicleRegistration?.Colour}</p>
                                                </div>
                                                <div>
                                                    <h4 className='info_title'>Year</h4>
                                                    <p className='info_data'>{selectedVehicle.vehicleData?.vehicleInfo?.VehicleRegistration?.YearOfManufacture}</p>
                                                </div>

                                                <div>
                                                    <h4 className='info_title'>Door</h4>
                                                    <p className='info_data'>{selectedVehicle.vehicleData?.vehicleInfo?.SmmtDetails?.NumberOfDoors}</p>
                                                </div>
                                                <div>
                                                    <h4 className='info_title'>Seat</h4>
                                                    <p className='info_data'>{selectedVehicle.vehicleData?.vehicleInfo?.VehicleRegistration?.SeatingCapacity}</p>
                                                </div>

                                                <div>
                                                    <h4 className='info_title'>Transmission</h4>
                                                    <p className='info_data'>{selectedVehicle.vehicleData?.vehicleInfo?.VehicleRegistration?.Transmission}</p>
                                                </div> 
                                                <div>
                                                    <h4 className='info_title'>Fuel</h4>
                                                    <p className='info_data'>{selectedVehicle.vehicleData?.vehicleInfo?.VehicleRegistration?.FuelType}</p>
                                                </div> 
                                            </div> 

                                            <div className='line'> 
                                                <span className='lineText'>Performance</span>
                                            </div>

                                            <div className='dataInfo'>
                                                <div>
                                                    <h4 className='info_title'>BrakeHorse</h4>
                                                    <p className='info_data'>{selectedVehicle.vehicleData?.vehicleInfo?.Performance?.Power?.Bhp} BHP</p>
                                                </div>
                                                <div>
                                                    <h4 className='info_title'>Torque</h4>
                                                    <p className='info_data'>{selectedVehicle.vehicleData?.vehicleInfo?.Performance?.Torque?.Nm} Nm</p>
                                                </div>

                                                <div>
                                                    <h4 className='info_title'>Max Speed</h4>
                                                    <p className='info_data'>{selectedVehicle.vehicleData?.vehicleInfo?.Performance?.MaxSpeed?.Mph} MPH</p>
                                                </div>
                                                <div>
                                                    <h4 className='info_title'>MPG</h4>
                                                    <p className='info_data'>{selectedVehicle.vehicleData?.vehicleInfo?.Consumption?.Combined?.Mpg}</p>
                                                </div>
                                            </div> 

                                            <div className='line'> 
                                                <span className='lineText'>Valuation</span>
                                            </div>

                                            <div className='dataValue'>
                                                <div>
                                                    <h4 className='info_title'>Auction</h4>
                                                    <p className='info_data'>£{selectedVehicle.vehicleData?.vehicleValue?.ValuationList?.Auction}</p>
                                                    <p className='info_change'> &#8595; {Math.round(((selectedVehicle.vehicleData?.vehicleValue?.ValuationList.OTR) - (selectedVehicle.vehicleData?.vehicleValue?.ValuationList?.Auction)) / (selectedVehicle.vehicleData?.vehicleValue?.ValuationList.OTR) * 100) }%</p>
                                                </div>
                                                <div>
                                                    <h4 className='info_title'>Trade</h4>
                                                    <p className='info_data'>£{selectedVehicle.vehicleData?.vehicleValue?.ValuationList?.TradeAverage}</p>
                                                    <p className='info_change'> &#8595; {Math.round(((selectedVehicle.vehicleData?.vehicleValue?.ValuationList?.OTR) - (selectedVehicle.vehicleData?.vehicleValue?.ValuationList?.TradeAverage)) / (selectedVehicle.vehicleData?.vehicleValue?.ValuationList.OTR) * 100) }%</p>
                                                </div>

                                                <div>
                                                    <h4 className='info_title'>Private</h4>
                                                    <p className='info_data'>£{selectedVehicle.vehicleData?.vehicleValue?.ValuationList?.PrivateAverage}</p>
                                                    <p className='info_change'> &#8595; {Math.round(((selectedVehicle.vehicleData?.vehicleValue?.ValuationList?.OTR) - (selectedVehicle.vehicleData?.vehicleValue?.ValuationList?.PrivateAverage)) / (selectedVehicle.vehicleData?.vehicleValue?.ValuationList.OTR) * 100) }%</p>
                                                </div>
                                            </div>
                                            <div className='dataValueFooter'>
                                                <p>*Compared To OTR(On The Road) Price*</p>
                                            </div>
                                        </>
                                    ): 
                                        <>
                                            <div className='dataCheckList'>
                                                <div className='dataCheck'>
                                                    <label> MOT </label>
                                                    <span>{selectedVehicle.vehicleData?.vehicleHistory?.mot?.motStatus === 'Valid' ? '✅' : '❌'}</span>
                                                </div>
                                                
                                                <div className='dataCheck'>
                                                    <label> TAX </label>
                                                    <span>{selectedVehicle.vehicleData?.vehicleHistory?.tax?.taxStatus === 'Taxed' ? '✅' : '❌'}</span>
                                                </div>
                                            </div>

                                            <div className='line'> 
                                                <span className='lineText'>MOT</span>
                                            </div>

                                            <div className='historyInfo'>
                                                <div className='dataMOT'>
                                                    <div className='motHeader'>
                                                        <p>Days: <span>{selectedVehicle.vehicleData?.vehicleMOT?.mot?.days}</span></p>
                                                        <p>Due: <span>{selectedVehicle.vehicleData?.vehicleMOT?.mot?.motDueDate}</span></p>
                                                    </div>

                                                    <div className='motContainer'>
                                                        {selectedVehicle.vehicleData?.vehicleMOT?.motHistory.map((mot, index) => (

                                                            <div key={index} className='motList'>
                                                                <div className='motRow'>
                                                                    <h4 className='mot_test'>{mot.testResult}</h4>
                                                                    <p className='mot_num'> {mot.motTestNumber}</p>
                                                                </div>
                                                                <div className='motRow'>
                                                                    <h4 className='mot_mile'>Mileage: <span>{mot.odometerValue}</span></h4>
                                                                    <p className='mot_date'>{mot.completedDate}</p>
                                                                </div>

                                                                {mot.rfrAndComments?.map((motFailed, f_index) => (

                                                                    <div key={f_index}>
                                                                        <h4 className='mot_fail_type'>{motFailed.type}</h4>
                                                                        <p className='mot_fail_text'>{motFailed.text}</p>
                                                                    </div>
                                                                ))}
                                                                <div className='motLine'> </div>

                                                            </div>
                                                        ))} 
                                                    </div>  
                                                </div>

                                                <div className='line'> 
                                                    <span className='lineText'>Change</span>
                                                </div>

                                                <div className='dataValue'>
                                                    <div>
                                                        <h4 className='info_title'>Owners</h4>
                                                        <p className='change_data'>{selectedVehicle.vehicleData?.vehicleInfo?.VehicleHistory.V5CCertificateCount}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className='info_title'>Plate</h4>
                                                        <p className='change_data'>{selectedVehicle.vehicleData?.vehicleInfo?.VehicleHistory.PlateChangeCount}</p>
                                                    </div>

                                                    <div>
                                                        <h4 className='info_title'>Colour</h4>
                                                        <p className='change_data'>{selectedVehicle.vehicleData?.vehicleInfo?.VehicleHistory.ColourChangeDetails.NumberOfPreviousColours}</p>
                                                    </div>
                                                </div>

                                                <div className='line'> 
                                                    <span className='lineText'>Tax Price</span>
                                                </div>

                                                <div className='motHeader'>
                                                        <p>Days: <span>{selectedVehicle.vehicleData?.vehicleHistory?.tax?.days}</span></p>
                                                        <p>Due: <span>{selectedVehicle.vehicleData?.vehicleHistory?.tax?.taxDueDate}</span></p>
                                                    </div>

                                                <div className='dataValue'>
                                                    <div>
                                                        <h4 className='info_title'>6 Months</h4>
                                                        <p className='change_data'>{selectedVehicle.vehicleData?.vehicleInfo?.vedRate?.Standard?.SixMonth || 0}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className='info_title'>12 Months</h4>
                                                        <p className='change_data'>{selectedVehicle.vehicleData?.vehicleInfo?.vedRate?.Standard?.TwelveMonth}</p>
                                                    </div>
                                                </div>


                                            </div> 
                                        </>
                                    }
                                </div>

                                {confirmDeleteVehicle ? (
                                        <>
                                            <button disabled={loading}  className="btn btn-outline-danger w-100 mt-1" variant="danger" onClick={() => handleDelete(selectedVehicle.vehicleData?._id)}>Confirm Delete</button>
                                        </>
                                    ) :(
                                        <>
                                            <button disabled={loading}  className="btn btn-outline-dark w-100 mt-1" type="submit"  onClick={() => handleDelete(selectedVehicle.vehicleData?._id)}>Delete Vehicle</button>
                                        </>
                                )}
                            </>
                        ) : <p>Loading....</p>}
                    </div>
                </Popup> 

                <Popup open={openWinModal} closeOnDocumentClick onClose={() => setOpenWinModal(false)} className='Popup'>
                    <div className='FollowModal'>
                        <div className='modalFollowHeader'>
                            <div>
                                <h3>Wins</h3>
                            </div>
                        </div> 

                        <div className='line'></div>

                        <div className='modalFollowData'>
                            {profileWins.map((profileWin, index) => (
                                <div key={index} >
                                    <p>{profileWin.vrn}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Popup>

                <Popup open={openLostModal} closeOnDocumentClick onClose={() => setOpenLostModal(false)} className='Popup'>
                    <div className='FollowModal'>
                        <div className='modalFollowHeader'>
                            <div>
                                <h3>Losts</h3>
                            </div>
                        </div> 

                        <div className='line'></div>

                        <div className='modalFollowData'>
                            {profileLosts.map((profileLost, index) => (
                                <div key={index} >
                                    <p>{profileLost.vrn}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Popup>      
            </div>
        </>
    )
}

export default Garage
