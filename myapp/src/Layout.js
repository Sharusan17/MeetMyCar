import React from 'react'
import ToolBar from './ToolBar'
import TitleBar from './TitleBar'


import './Layout_css.css'

const Layout = ({children}) => {


  return (
    <div className='layout'>
        {/* Render ToolBar Component */}
        <ToolBar/>
        {/* Render TitleBar Component */}
        <TitleBar/>
        {/* Render Children Component */}
        <div className='content'>
            {children}
        </div>
    </div>
  )
}
export default Layout

