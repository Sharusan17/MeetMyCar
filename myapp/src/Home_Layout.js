import React, {useState} from 'react'
import Banner from './Banner'

import './Home_Layout_css.css'

const Home_Layout = ({children}) => {

  const [vehicleImage, setVehicleImage] = useState('')

  const updateImage = (img) =>{
    setVehicleImage(img)
  }

  const childrenProps = React.Children.map(children, child => 
    React.cloneElement(child, { updateImage })
  );

  return (
    <div className='banner-layout'>
        <Banner  imageSrc={vehicleImage}/>
        <div className='forms'>
          {childrenProps}
        </div>
    </div>
  )
}
export default Home_Layout

