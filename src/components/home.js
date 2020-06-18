import React, { Component } from 'react'
import '../css/home.css'
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import { FaUserCircle } from 'react-icons/fa'
import { MdDoNotDisturbOn } from 'react-icons/md'
import { GoSettings } from 'react-icons/go'
import { RiRefreshLine } from 'react-icons/ri'
import { IconContext } from 'react-icons';
import Card from './card.js'
import Timer from './timer';
import { withCookies } from 'react-cookie'
require('dotenv').config()
const request = require('request')

const rankColor = rating => {
  if(rating < 1200) return "#BFBAB2"
  else if(rating < 1400) return "#98FF98"
  else if(rating < 1600) return "#86FFF8"
  else if(rating < 1900) return "#3E7BE6"
  else if(rating < 2100) return "#EE6FEE"
  else if(rating < 2400) return "#F6AA4D"
  else return "#E03737"
}

class Home extends Component{
  constructor(props) {
    super(props);
    this.state = {
      userHandle : "abc",
      userRating : 0,
      userFName : "",
      userLName : "",
      userRank : "",
      userPic : "",
      userOrg : "",
      problemData : {},
      hideSearch : false,
      counts : { easy : 3, medium : 5, hard : 2 },
      mainTransition : false,
      showStopwatch : false,
      timedProblem : {},
      openForm : true,
    }
  }
  
  handleHandleQuery = event => {
    this.setState({problemData : {}, hideSearch : false})
    const url = `${process.env.REACT_APP_SERVER}/suggest/${this.state.userHandle}/${this.state.counts.easy}/${this.state.counts.medium}/${this.state.counts.hard}` + (this.state.ratingLow ? `/${this.state.ratingLow}/${this.state.ratingHigh}` : ``)
    request(url, (error, response, body) => {
      const data = JSON.parse(response.body)
      if(data["errorMessage"] !== undefined){
        window.alert(data["errorMessage"])
        this.setState({userHandle: "", problemData: {}, hideSearch: false})
      }
      else{
        for(var key in data)  this.setState({[key] : data[key]})
        this.setState({hideSearch: true, mainTransition: true})
        this.props.cookies.set('userHandle', this.state.userHandle, { path: '/', maxAge: 86400000 })
      }
    })
    if(event) event.preventDefault()
  }

  handleHiddenQuery = event => event.preventDefault()

  handleHandleChange = event => this.setState({userHandle: event.target.value})

  handleReset = () => {
    this.setState({hideSearch: false})
    setTimeout(() => this.setState({userHandle: "", userFName: "", userLName: "", userRating: 0, problemData: {}, userRank: "", userPic: "", userOrg: ""}), 1000)
    this.props.cookies.remove('userHandle', { path: '/' })
  }

  startTimer = (problem, diff) => {
    const dProb = problem
    dProb["difficulty"] = diff
    this.setState({showStopwatch: true, timedProblem: dProb})
  }

  stopTimer = () => this.setState({showStopwatch: false})

  solved = (diff, cid, index) => this.state.problemData[diff].forEach((prob, idx) => {
    if(prob["contestId"] === cid && prob["index"] === index){
      const newData = this.state.problemData
      newData[diff][idx]["solved"] = true
      this.setState({problemData: newData})
    }
  })

  componentDidMount(){
    setTimeout(() => this.setState({openForm : false}), 1000)
    this.setState({userHandle : this.props.cookies.get('userHandle') || ""}, () => (this.state.userHandle !== "") ? this.handleHandleQuery() : null)
  }

  render(){
    return (
      <div className = "home"> 
        
        <form onSubmit = {this.state.hideSearch ? this.handleHiddenQuery : this.handleHandleQuery} onMouseEnter = {() => this.setState({openForm: true})} onMouseLeave = {() => this.setState({openForm: false})}>
          <div className = {`handle-box ` + (this.state.openForm ? "open " : "") + (this.state.hideSearch ? "hidden-handle" : "show-handle")}>
            <input className = "handle-input" spellCheck = {false} required name = "handle" disabled = {this.state.hideSearch} value = {this.state.userHandle} onChange = {this.handleHandleChange} placeholder = "Codeforces Handle" />
            <button type = "submit" className = "handle-button">
              <IconContext.Provider value = {{color: "whitesmoke", size: "2em"}}><FaUserCircle /></IconContext.Provider>
            </button>
          </div>
        </form>
        
        {!this.state.mainTransition || this.state.showStopwatch ? null :
        <div className = {"mainArea " + (this.state.hideSearch ? "show-main" : "hidden-main")} id = "#main">
          
          <div className = "userInfo">
            <img className = "profile-pic" src = {`https:${this.state.userPic}`} alt = {this.state.userHandle} />
            <span className = "user">
              <table><tbody><tr>
              <td>{this.state.userFName} <a href = {`http://codeforces.com/profile/${this.state.userHandle}`} target="_blank" rel="noopener noreferrer" style = {{color: rankColor(this.state.userRating), textDecoration: "none"}}>{this.state.userHandle}</a> {this.state.userLName}</td>
              <td className = "ratingBadge"><NotificationBadge count={this.state.userRating} style = {{backgroundColor: rankColor(this.state.userRating), color: "#1d1e22", top: "0", right: "0"}} effect={Effect.SCALE}/></td>
              </tr></tbody></table>
              <span title = "Change user" className = "reset-button" onClick = {this.handleReset}>
                <IconContext.Provider value = {{color: "#ff5e6c", size: "2em"}}><MdDoNotDisturbOn /></IconContext.Provider>
              </span>
            </span>
            <span className = "organization" style = {{fontSize: "15px"}}>{this.state.userOrg}</span>
          </div>

          {(this.state.problemData.easy === undefined) ? null : <>
            <h2>UpSolve from your last contest</h2>
            <div className = "upsolveDiv">
              {this.state.problemData.upsolve.map(problem => (
                <Card handle = {this.state.userHandle} problem = {problem} difficulty = "upsolve" startTimer = {this.startTimer} />
              ))}
            </div>
            <div>
              <h2>Suggested Practice problems
              <a href = "#settings" className = "seticon"><IconContext.Provider value = {{size: "1em", color: "#98FF98"}}>
                <GoSettings />
              </IconContext.Provider></a></h2>
            </div>
            {this.state.counts.easy+this.state.counts.medium+this.state.counts.hard > 0 && this.state.ratingLow <= this.state.ratingHigh? 
            <div className = "problemSuggestions">
              <span className = "problemSpan">
                {this.state.problemData.easy.map(problem => (
                  <Card handle = {this.state.userHandle} problem = {problem} difficulty = "easy" startTimer = {this.startTimer} />
                ))}</span>
              <span className = "problemSpan">
                {this.state.problemData.medium.map(problem => (
                  <Card handle = {this.state.userHandle} problem = {problem} difficulty = "medium" startTimer = {this.startTimer} />
                ))}</span>
              <span className = "problemSpan">
                {this.state.problemData.hard.map(problem => (
                  <Card handle = {this.state.userHandle} problem = {problem} difficulty = "hard" startTimer = {this.startTimer} />
                ))}</span>
            </div>
            :
            <div><h3>No Problems Found! Seems like you have mastered this range of problems!</h3></div>
            }</>
            }
        </div>}

        {!this.state.showStopwatch ? null :
          <Timer problem = {this.state.timedProblem} solved = {this.solved} stopTimer = {this.stopTimer} handle = {this.state.userHandle}/>
        }

        <div id="settings" className="popup">
          <a href="#main" className="close">&times;</a>
          <h3>Settings</h3>
          Rating Range :&nbsp;
          <input className = "setinp" type = "number" step = "100" name = "low" required value = {this.state.ratingLow} onChange = {e => this.setState({ratingLow: e.target.value})} />
          -
          <input className = "setinp" type = "number" step = "100" name = "high" required value = {this.state.ratingHigh} onChange = {e => this.setState({ratingHigh: e.target.value})} />
          <hr />
          Problem Counts :&nbsp;
          <input className = "setinp" type = "number" name = "easy" required value = {this.state.counts.easy} onChange = {e => this.setState({counts: {...this.state.counts, easy : e.target.value}})} />
          <input className = "setinp" type = "number" name = "medium" required value = {this.state.counts.medium} onChange = {e => this.setState({counts: {...this.state.counts, medium : e.target.value}})} />
          <input className = "setinp" type = "number" name = "hard" required value = {this.state.counts.hard} onChange = {e => this.setState({counts: {...this.state.counts, hard : e.target.value}})} />
          <hr />
          <div style = {{cursor: "pointer"}} onClick = {() => {this.handleHandleQuery(); window.history.replaceState(null, null, "#main")}}><IconContext.Provider value = {{size: "2em", color: "#F6AA4D"}}>
            <RiRefreshLine />
          </IconContext.Provider></div>
          <div style = {{fontSize: "14px"}}>Click on the Refresh Icon to load</div>
        </div>
      </div>
    )
  }
}

export default withCookies(Home)