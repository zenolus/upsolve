import React from 'react'
import '../css/bars.css'

const TopBar = () => {
  return(
    <div className = "header">
      <a href = "/" style = {{textDecoration: "none"}}>
        <img className = "hicon" src = {require('../favicon.png')}/>
        <span className = "htext"><span style = {{color: "#98FF98"}}><span className = "high">U</span>P</span><span className = "high">S</span>OLVE</span>
      </a>
    </div>
  )
}

export default TopBar