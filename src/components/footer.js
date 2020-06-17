import React from 'react'
import { IconContext } from 'react-icons'
import { RiPatreonLine } from 'react-icons/ri'
import '../css/bars.css'

const Footer = () => {
  return (
    <div className = "footer">
      <IconContext.Provider value = {{size: "1.75em", color: "#E85B46"}}>
        <a href = "https://www.patreon.com/upsolve" title = "Your support matters a lot!" target = "_blank" rel="noopener noreferrer" ><RiPatreonLine /></a>
      </IconContext.Provider>
    </div>
  )
}

export default Footer