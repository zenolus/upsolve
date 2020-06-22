import React, { useState, useEffect } from 'react'
import { IconContext } from 'react-icons'
import { RiPatreonLine, RiUserHeartLine } from 'react-icons/ri'
import Select from 'react-select'
import '../css/bars.css'
import Home from './home.js'
import Team from './team.js'
import Swot from './swot.js'
import { pure } from 'recompose'
const request = require('request')

const dropOptions = [
  { value : <Home />, label : "Home" },
  { value : <Team />, label : "Team Practice" },
  { value : <Swot />, label : "Analysis" },
]

const selectStyles = {
  menu: base => ({
    ...base,
    backgroundColor: "#1d1e22",
    color: "whitesmoke"
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#28323C" : "transparent"
  }),
  control: styles => ({
    ...styles,
    backgroundColor: "#1d1e22"
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: "whitesmoke",
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    transform: 'rotate(180deg)'
  })
}

const Footer = ({setComp}) => {
  const [userCount, setUC] = useState(0)
  useEffect(() => {
    request(`${process.env.REACT_APP_SERVER}/usercount`, (err, res, body) => {
      const data = JSON.parse(res.body)
      setUC(data.count)
    })
  }, [setUC])
  return (
    <div className = "footer">
      <div className = "uCount">
        <IconContext.Provider value = {{size: "1.75em", color: "#E20047"}}>
          <RiUserHeartLine /> <span style = {{position: "relative", top: "-5px"}}>{userCount}</span>
        </IconContext.Provider> 
      </div>

      <div className = "tabs">
        <Select
          styles = {selectStyles}
          className = "select-tab"
          name = "tab"
          options = {dropOptions}
          isSearchable = {false}
          defaultValue = {dropOptions[0]}
          onChange = {event => setComp(event.value)}
          menuPlacement = "top"
          dropdownI
          />
      </div>
      
      <div className = "patreon">
        <IconContext.Provider value = {{size: "1.75em", color: "#E85B46"}}>
          <a href = "https://www.patreon.com/upsolve" title = "Your support matters a lot!" target = "_blank" rel="noopener noreferrer" ><RiPatreonLine /></a>
        </IconContext.Provider>
      </div>
    </div>
  )
}

export default pure(Footer)