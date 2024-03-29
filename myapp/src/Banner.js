import React, { useEffect, useState } from 'react'
import './Banner_css.css'
import defaultPicSrc from './banner.jpg'; 

const Banner = ({imageSrc}) => {

  const [text, setText] = useState('')

  // Effect through each sentence, letter by letter, and loops to show a typing effect
  useEffect(() => {
    // Array of sentences to display
    const sentences = ["  👋 Join the MMC family and rev up your passion - we're eager to welcome you on board",
                      "  🏎️ Connect, drive and meet with fellow car enthusiasts across the globe - it's time to make your mark"]
    let sentenceIndex = 0
    let index = 0
    const timeoutId = setInterval(() => {
      setText((text) => text + sentences[sentenceIndex].charAt(index))
      index++
      if (index === sentences[sentenceIndex].length){
        setTimeout(() => {
          setText('')
          sentenceIndex++
          // If reached the end of sentences array, start from the beginning (loop)
          if (sentenceIndex === sentences.length) {
            sentenceIndex = 0
          }
          index=0
          // every 3 seconds
        }, 3000)
      }
      // every 75 milliseconds
    } ,75)
    
    return () => clearInterval(timeoutId)
  }, [])

  return (
    <>
      <div className='Banner'>
          <div className='Title'>
            <h1>MeetMyCar <span>Made For Enthusiasts | Driven By Enthusiasts</span> </h1>
          </div>
          {/* Displays image on left side of screen */}
          <img className='image' src={imageSrc || defaultPicSrc} alt='Vehicle'></img>
          <div className='Footer'>
            <p>{text}</p>
          </div>
      </div>
    </>
  )
}
export default Banner