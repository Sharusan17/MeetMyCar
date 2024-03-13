import React from 'react'
import ToolBar from './ToolBar'
import TitleBar from './TitleBar'


import './Layout_css.css'

const Layout = ({children}) => {


  return (
    <div className='layout'>
        <ToolBar/>
        <TitleBar/>
        <div className='content'>
            {children}
        </div>
    </div>
  )
}
export default Layout

