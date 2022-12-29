import { IconContext } from 'react-icons'
import { RiPatreonLine } from 'react-icons/ri'
import Select from 'react-select'
import '../css/bars.css'
import Home from './home.js'
import Team from './team.js'
import Swot from './swot.js'
import { pure } from 'recompose'

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
  return (
    <div className = "footer">
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