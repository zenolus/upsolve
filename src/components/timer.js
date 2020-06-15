import React, { useState } from 'react'
import { IconContext } from 'react-icons'
import { GiCancel } from 'react-icons/gi'
import { AiOutlineSend, AiOutlineFileDone, AiOutlineRead } from 'react-icons/ai'
import '../css/timer.css'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import request from 'request'

let timeTaken = 0

const renderTime = ({ remainingTime }) => {
  if(remainingTime === 0){
    return <div className = "timer" style = {{color: "whitesmoke", fontSize: "25px"}}>
      You can read the editorial now!
      <IconContext.Provider value = {{color: "#98FF98", size: "1.25em"}}><AiOutlineRead style = {{paddingLeft: "10px"}}/></IconContext.Provider>
    </div>;
  }
  timeTaken = timeTaken+1
  const min = Math.floor(remainingTime / 60)
  const sec = remainingTime - 60 * min
  return(
    <div className = "timer">
      <div className="value"><span className = "num">{min}</span><strong className = "numside">M</strong> : <span className = "num">{sec < 10 ? "0"+sec : sec}</span><strong className = "numside">S</strong></div>
    </div>
  );
};

const start = (setPlaying, setShowPlay, problem) => {
  setPlaying(true)
  setShowPlay(false)
  window.open(`https://codeforces.com/contest/${problem["contestId"]}/problem/${problem["index"]}`, "_blank")
}

const verify = (handle, cid, index, setPlaying) => {
  request(`https://upsolve.herokuapp.com/verify/${handle}/${cid}/${index}`, (err, res, body) => {
    const data = JSON.parse(res.body)
    if(data["errorMessage"] !== undefined)
      window.alert(data["errorMessage"])
    else if(data["verified"]){
      setPlaying(false)
    }
    else window.alert("AC submission not found!")
  })
}

const Timer = props => {

  timeTaken = 0
  const [playing, setPlaying] = useState(false)
  const [showPlay, setShowPlay] = useState(true)

  return(
    <div className = "timerDiv">
      <div>
        <IconContext.Provider value = {{size: "1.5em", color: "#ff5e6c"}}>
          <span style = {{cursor: "pointer", padding: "10px"}} onClick = {props.stopTimer}><GiCancel /></span>
        </IconContext.Provider>
      </div>
      <div className = "problemStatistics">
        <div>
          <table><tbody>
            <tr>
              <td className = "field">Problem Name: </td>
              <td className = "value">
                <a href = {`https://codeforces.com/contest/${props.problem["contestId"]}/problem/${props.problem["index"]}`} target="_blank" rel="noopener noreferrer">
                  {props.problem["name"]} ({props.problem["contestId"]}{props.problem["index"]})
                </a>
              </td>
            </tr>
            <tr>
              <td className = "field">Problem Tags: </td>
              <td className = "value" style = {{color: "#F6AA4D"}}>{props.problem["tags"].map((tag, idx) => (tag + (idx+1 < props.problem["tags"].length ? " | " : "")))}</td>
            </tr>
            <tr>
              <td className = "field">Solved by: </td>
              <td className = "value">{props.problem["solvedBy"]}</td>
            </tr>
            <tr>
              <td className = "field">Recommendation Score: </td>
              <td className = "value">{props.problem["score"]}</td>
            </tr>
          </tbody></table>
        </div>
        <div style = {{padding: "10px"}}>
          <CountdownCircleTimer
            isPlaying = {playing}
            size = {200}
            duration={props.problem["practiceTime"] * 60}
            isLinearGradient
            trailColor = "#28323C"
            colors={[["#F6AA4D"], ["#FF5E6C"]]}
            onComplete={() => {
              setPlaying(false)
              return [false, 1000]
            }}
          >
            {renderTime}
          </CountdownCircleTimer>
        </div>
        <span>
          <IconContext.Provider value = {{color: "#ff5e6c", size: "2em"}}>
            {showPlay ? <AiOutlineSend onClick = {() => start(setPlaying, setShowPlay, props.problem)} style = {{cursor: "pointer"}} /> : null}
            {playing ? <AiOutlineFileDone onClick = {() => verify(props.handle, props.problem["contestId"], props.problem["index"], setPlaying)} style = {{cursor: "pointer"}} /> : null}
          </IconContext.Provider>
        </span>
      </div>
    </div>
  )
}

export default Timer