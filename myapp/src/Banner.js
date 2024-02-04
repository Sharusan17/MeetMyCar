import React, { useEffect, useState } from 'react'
import './Banner_css.css'
import defaultPicSrc from './banner.jpg'; 

const Banner = ({imageSrc}) => {

  const [text, setText] = useState('')

  useEffect(() => {
    const sentence = "- 👋 Join the MMC family and rev up your passion - we're eager to welcome you on board "
    let index = 0
    const timeoutId = setInterval(() => {
      setText((text) => text + sentence.charAt(index))
      index++
      if (index === sentence.length) clearInterval(timeoutId)
    } ,75)

    return () => clearInterval(timeoutId)
  }, [])

  return (
    <>
      <div className='Banner'>
          <div className='Title'>
            <h1>MeetMyCar <span>Car Social Media</span> </h1>
          </div>
          <img className='image' src={imageSrc || defaultPicSrc} alt='Vehicle Image'></img>
          <div className='Footer'>
            <p>{text}</p>
          </div>
      </div>
      
    </>
    
  )
}
export default Banner