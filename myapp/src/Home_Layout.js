import React, {useState} from 'react'
import Banner from './Banner'
import RegisterVehicle from './RegisterVehicle'

import './Home_Layout_css.css'

const Home_Layout = ({children}) => {

  const [vehicleImage, setVehicleImage] = useState('')

  const updateImage = (img) =>{
    setVehicleImage(img)
  }

  return (
    <div className='banner-layout'>
        <Banner  imageSrc={vehicleImage}/>
        <div className='forms'>
          <RegisterVehicle updateImage={updateImage} />
          {children}
        </div>
    </div>
  )
}
export default Home_Layout

