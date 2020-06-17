import React, { useState } from 'react'
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import '../css/card.css'
import { IconContext } from 'react-icons';
import { RiTimerLine } from 'react-icons/ri'
import { IoMdDoneAll } from 'react-icons/io'
import { MdSnooze } from 'react-icons/md'
import request from 'request';
require('dotenv').config()

const rankColor = difficulty => {
  if(difficulty === "easy") return "#F6AA4D"
  else if(difficulty === "medium") return "#E03737"
  else if(difficulty === "hard")  return "#3E7BE6"
}

const Card = props => {
  const [showActions, setShowActions] = useState(false)
  const [active, setActive] = useState(false)
  const [hide, setHide] = useState(false)
  const [hideAnim, setAnim] = useState(false)
  const handleSkip = () => {
    const choice = window.confirm(`Are you sure you want to skip the problem ${props.problem["name"]}? It will be considered as one of the problems that you were able to solve. This action can not be reverted!`)
    if(choice){
      const pid = props.problem["contestId"]+props.problem["index"]
      request(`${process.env.REACT_APP_SERVER}/skip/${props.handle}/${pid}`, (err, res, body) => {
        const data = JSON.parse(res.body)
        if(data["errorMessage"] !== undefined)  window.alert(data["errorMessage"])
        else{
          setAnim(true)
          setTimeout(() => setHide(true), 300)
        }
      })
    }
  }

  const handleSnooze = () => {
    const choice = window.confirm(`Snoozing problem: ${props.problem["name"]}\nIt will be available again after 48 hours!`)
    if(choice){
      const pid = props.problem["contestId"]+props.problem["index"]
      request(`${process.env.REACT_APP_SERVER}/later/${props.handle}/${pid}`, (err, res, body) => {
        const data = JSON.parse(res.body)
        if(data["errorMessage"] !== undefined)  window.alert(data["errorMessage"])
        else{
          setAnim(true)
          setTimeout(() => setHide(true), 300)
        }
      })
    }
  }

  const checkSolved = () => {
    if(props.problem["solved"] && !hideAnim){
      setAnim(true)
      setHide(true)
    }
  }

  return(
    hide ? null :
    <tr key = {props.problem["name"]} className = {(hideAnim?"hiddenCard ":"")}>
      {checkSolved()}
      <div className = {"card " + props.difficulty} onMouseEnter = {() => {setShowActions(true); setTimeout(() => setActive(true), 1000)}} onMouseLeave = {() => {setShowActions(false); setTimeout(() => setActive(false), 1000)}}>
        <span style = {{float: "left", width: (showActions ? "60%" : "100%")}}>
          <a href = {active ? `https://codeforces.com/contest/${props.problem["contestId"]}/problem/${props.problem["index"]}` : "#"} target={active ? "_blank" : null} rel="noopener noreferrer">{props.problem["name"]}</a>
          {!showActions ? null :
            <NotificationBadge count={props.problem["rating"]} style = {{backgroundColor: rankColor(props.difficulty), color: "#1d1e22", top: "0", right: "0"}} effect={Effect.ROTATE_X}/>
          }
        </span>
        {!showActions ? null :
          <span className = "actions">
            <IconContext.Provider value = {{size: "1.25em", color: "whitesmoke"}}>
              <span title = "Timer" style = {{padding: "3px", cursor: "pointer"}} onClick = {() => props.startTimer(props.problem, props.difficulty)}>
                <RiTimerLine />
              </span>
              <span title = "Skip" style = {{padding: "3px", cursor: "pointer"}} onClick = {handleSkip}>
                <IoMdDoneAll />
              </span>
              <span title = "Solve later" style = {{padding: "3px", cursor: "pointer"}} onClick = {handleSnooze}>
                <MdSnooze />
              </span>
            </IconContext.Provider>
          </span>
        }
      </div>
    </tr>
  )
}

export default Card