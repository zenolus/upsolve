import React, { useState } from 'react'
import { IconContext } from 'react-icons'
import { RiPatreonLine, RiUserHeartLine } from 'react-icons/ri'
import '../css/bars.css'

const request = require('request')

const Footer = ({setComp}) => {
  const [userCount, setUC] = useState(0)
  request(`${process.env.REACT_APP_SERVER}/usercount`, (err, res, body) => {
    const data = JSON.parse(res.body)
    setUC(data.count)
  })
  return (
    <div className = "footer">
      <div className = "uCount">
        <IconContext.Provider value = {{size: "1.75em", color: "#E20047"}}>
          <RiUserHeartLine /> <span style = {{position: "relative", top: "-5px"}}>{userCount}</span>
        </IconContext.Provider> 
      </div>

      <div className = "tabs">
        
      </div>
      
      <div className = "patreon">
        <IconContext.Provider value = {{size: "1.75em", color: "#E85B46"}}>
          <a href = "https://www.patreon.com/upsolve" title = "Your support matters a lot!" target = "_blank" rel="noopener noreferrer" ><RiPatreonLine /></a>
        </IconContext.Provider>
      </div>
    </div>
  )
}

export default Footer