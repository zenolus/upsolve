import React, { useState } from 'react'
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import '../css/card.css'
import { IconContext } from 'react-icons';
import { RiTimerLine } from 'react-icons/ri'
import { IoMdDoneAll } from 'react-icons/io'
import { MdSnooze } from 'react-icons/md'

const rankColor = difficulty => {
  if(difficulty === "easy") return "#F6AA4D"
  else if(difficulty === "medium") return "#E03737"
  else return "#3E7BE6"
}

const Card = props => {
  const [showActions, setShowActions] = useState(false)
  const [active, setActive] = useState(false)
  const [hide, setHide] = useState(false)
  const [hideAnim, setAnim] = useState(false)
  const handleSkip = () => {
    const choice = window.confirm("Are you sure you want to skip this question? It can't be reverted!")
    if(choice){
      setAnim(true)
      setTimeout(() => setHide(true), 300)
    }
  }

  return(
    hide ? null :
    <tr key = {props.problem["name"]} className = {(hideAnim?"hiddenCard ":"")}>
      <div className = {"card " + props.difficulty} onMouseEnter = {() => {setShowActions(true); setTimeout(() => setActive(true), 1000)}} onMouseLeave = {() => {setShowActions(false); setTimeout(() => setActive(false), 1000)}}>
        <span style = {{float: "left", width: (showActions ? "60%" : "100%")}}>
          <a href = {active ? `https://codeforces.com/contest/${props.problem["contestId"]}/problem/${props.problem["index"]}` : "#"} target={active ? "_blank" : null} rel="noopener noreferrer">{props.problem["name"]}</a>
          {!showActions ? null :
            <NotificationBadge count={props.problem["rating"]} style = {{backgroundColor: rankColor(props.difficulty), color: "#1d1e22", top: "0", right: "0"}} effect={Effect.ROTATE_X}/>
          }
        </span>
        {!showActions ? null :
          <span style = {{float: "right", width: "40%"}}>
            <IconContext.Provider value = {{size: "1.25em", color: "whitesmoke"}}>
              <span style = {{padding: "3px", cursor: "pointer"}} onClick = {() => props.startTimer(props.problem)}>
                <RiTimerLine />
              </span>
              <span style = {{padding: "3px", cursor: "pointer"}} onClick = {handleSkip}>
                <IoMdDoneAll />
              </span>
              <span style = {{padding: "3px"}}><MdSnooze /></span>
            </IconContext.Provider>
          </span>
        }
      </div>
    </tr>
  )
}

export default Card