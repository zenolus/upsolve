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
  return(
    <div className = {"card " + props.difficulty} onMouseEnter = {() => setShowActions(true)} onMouseLeave = {() => setShowActions(false)}>
      <span style = {{float: "left", width: (showActions ? "60%" : "100%")}}>
        <a href = {`https://codeforces.com/contest/${props.problem["contestId"]}/problem/${props.problem["index"]}`} target="_blank" rel="noopener noreferrer">{props.problem["name"]}</a>
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
            <span style = {{padding: "3px"}}><IoMdDoneAll /></span>
            <span style = {{padding: "3px"}}><MdSnooze /></span>
          </IconContext.Provider>
        </span>
      }
    </div>
  )
}

export default Card