import React, {useState} from 'react'
import Banner from './Banner'

import './Home_Layout_css.css'

const Home_Layout = ({children}) => {

  const [vehicleImage, setVehicleImage] = useState('')

  // updates the vehicle image, from the selected vehicle chosen in the garage
  const updateImage = (img) =>{
    setVehicleImage(img)
  }

  // Clone and pass the updateImage state as a prop to each child component
  const childrenProps = React.Children.map(children, child => 
    React.cloneElement(child, { updateImage })
  );

  return (
    <div className='banner-layout'>
        {/* Render the Banner component with the current vehicle image */}
        <Banner  imageSrc={vehicleImage}/>
        <div className='forms'>
          {childrenProps}
        </div>
    </div>
  )
}
export default Home_Layout

