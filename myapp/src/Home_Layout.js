import React from 'react'
import Banner from './Banner'

import './Home_Layout_css.css'

const Home_Layout = ({children}) => {

  return (
    <div className='banner-layout'>
        <Banner />
        <div className='forms'>
            {children}
        </div>
    </div>
  )
}
export default Home_Layout

