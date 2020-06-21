import React, { Component } from 'react'
import '../css/home.css'
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import { FaUserCircle } from 'react-icons/fa'
import { MdDoNotDisturbOn } from 'react-icons/md'
import { IconContext } from 'react-icons';
import { withCookies } from 'react-cookie'
import { Pie, HorizontalBar } from 'react-chartjs-2';
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

const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

class Swot extends Component{
  constructor(props) {
    super(props);
    this.state = {
      userHandle : "",
      userRating : 0,
      hideSearch : false,
      mainTransition : false,
      openForm : true,
    }
  }
  
  handleHandleQuery = event => {
    this.setState({hideSearch : false})
    const url = `${process.env.REACT_APP_SERVER}/swot/${this.state.userHandle}`
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
    setTimeout(() => this.setState({userHandle: "", userRating: 0}), 1000)
    this.props.cookies.remove('userHandle', { path: '/' })
  }

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
        
        {!this.state.mainTransition ? null :
        <div className = {"mainArea " + (this.state.hideSearch ? "show-main" : "hidden-main")} id = "#main">
          
          <div className = "userInfo">
            <span className = "user">
              <table><tbody><tr>
              <td><a href = {`http://codeforces.com/profile/${this.state.userHandle}`} target="_blank" rel="noopener noreferrer" style = {{color: rankColor(this.state.userRating), textDecoration: "none"}}>{this.state.userHandle}</a></td>
              <td className = "ratingBadge"><NotificationBadge count={this.state.userRating} style = {{backgroundColor: rankColor(this.state.userRating), color: "#1d1e22", top: "0", right: "0"}} effect={Effect.SCALE}/></td>
              </tr></tbody></table>
              <span title = "Change user" className = "reset-button" onClick = {this.handleReset}>
                <IconContext.Provider value = {{color: "#ff5e6c", size: "2em"}}><MdDoNotDisturbOn /></IconContext.Provider>
              </span>
            </span>
          </div>
          
          <div className = "swot">
            <h3>Strengths</h3>
            <span className = "justify">
              {this.state.swot.sort((a, b) => b["points"] - a["points"]).slice(0, 5).map((tag, idx) => 
                  <td style = {{color: "#98FF98"}}>
                    {tag.tag}
                  </td>
              )}
            </span>
            <h3>Weaknesses</h3>
            <span className = "justify">
              {this.state.swot.sort((a, b) => a["points"] - b["points"]).slice(0, 5).map((tag, idx) => 
                  <td style = {{color: "#E03737"}}>
                    {tag.tag}
                  </td>
              )}
            </span>
          </div>

          <h2>Topic-wise AC solution count</h2>
          <div className = "hbar">
            <HorizontalBar
              width = {Math.min(600, window.innerWidth)}
              height = {400}
              options={{
                maintainAspectRatio: false
              }}
              data = {{
                labels: this.state.swot.sort((a, b) => b.count - a.count).filter(tag => tag.count >= 5).map(tag => tag.tag),
                datasets: [{
                  label: "Solved Problems",
                  data: this.state.swot.sort((a, b) => b.count - a.count).filter(tag => tag.count >= 5).map(tag => tag.count),
                  backgroundColor: 'rgba(255,99,132,0.2)',
                  borderColor: 'rgba(255,99,132,1)',
                  borderWidth: 1,
                  hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                  hoverBorderColor: 'rgba(255,99,132,1)',
                }]
              }}
              legend = {{display: false}} redraw
            />
          </div>
          <h2>Problem distribution for current rating slab</h2>
          <div className = "pie">
            <Pie 
              data = {{
                labels: this.state.slab.map(tag => tag.name),
                datasets: [{
                  data: this.state.slab.map(tag => tag.count),
                  backgroundColor: this.state.slab.map(() => getRandomColor()),
                }]
              }} 
              legend = {{
                "display": window.innerWidth > 600,
                "position": "bottom",
                "fullWidth": false,
                "reverse": true,
                "labels": {
                  "fontColor": "rgb(255, 99, 132)"
                }
              }} redraw
            />
            <small>Problem distribution slab refers to the rating range for which you qualify!</small><br/>
            <small>Only tags with 50+ problems are shown. Tap on the sections to see counts.</small>
          </div>
        </div>}
      </div>
    )
  }
}

export default withCookies(Swot)