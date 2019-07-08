import React, { Component } from 'react';
import  {Link} from "react-router-dom";
import Loader from './Loader.js';
import StandingRow from './StandingRow.js';
import {withRouter} from 'react-router';
import {store} from '../index.js';


class Table extends Component {
  constructor(props){
    super(props);
    this.state = {teams_images:null,competition:'PL',standing:null};
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e){
    let xhr = new XMLHttpRequest();
    //console.log('e',e.target.value);
    xhr.open("GET",`https://api.football-data.org/v2/competitions/${e.target.value}/standings?season=2018`,false);
    xhr.setRequestHeader('X-Auth-Token', '7b2ac51349fd45cab94bd34a5e8db4a5');
    let arr;
    xhr.onreadystatechange = function () {
      if(xhr.readyState === 4 && xhr.status === 200) {
        arr = JSON.parse(xhr.responseText);
      }
    };
    xhr.send();
    //console.log('a',arr);
    this.setState({competition: e.target.value,standing: arr.standings[0].table});
  }
  
  componentDidMount(){

    fetch(`https://api.football-data.org/v2/competitions/${this.state.competition}/standings?season=2018`,{
      headers:{
        'X-Auth-Token': '7b2ac51349fd45cab94bd34a5e8db4a5'
      }
    })
    .then((data) => data.json())
    .then((json) => {
      console.log("fetch response", json);
      this.setState({standing: json.standings[0].table})
    });
    
  

  }
  
  render(){
    
    if(!this.state.standing) {
      return null;
    } 
    console.log("STATE TABLE from store",store.getState())
    let standing = this.state.standing.slice(0, this.state.standing.length);
    let user = this.props.user;
    let isLoading = this.props.isLoading;
    
    
    return isLoading ? <Loader /> : user ? (
      <div>
        <h2 className="home_link"><Link to='/'>Home</Link></h2>
        <div>
        {this.props.userSubscribe ? (
          <select className="league_select" onChange={this.handleChange} value={this.state.competition}>
            <option value="PL">English Premier League</option>
            <option value="PD">Spanish Primera Division</option>
            <option value="BL1">German Bundesliga</option>
            <option value="SA">Italian Seria A</option>
            <option value="FL1">French League 1</option>
            <option value="DED">Netherlands Eredevise</option>
        </select>
        ) : (
          <select className="league_select" onChange={this.handleChange} value={this.state.competition}>
            <option value="PL">English Premier League</option>
        </select> )
        }
        </div>
        { this.props.userSubscribe ? null : (<div className="subscription_container"><p>Subscribe for opening more competitions</p><button onClick={this.props.handleSubscribe}>Subscribe</button></div>) }
        <h2 className="standing_head">Table</h2>
        <div>
          <table id="standing">
            <thead>
              <tr>
                <td>#</td>
                <td>team</td>
                <td>games</td>
                <td>won</td>
                <td>draw</td>
                <td>lost</td>
                <td>goals</td>
                <td>goals diff</td>
                <td>pts</td>
              </tr>
            </thead>
            <tbody>
            {
              standing.map((row,i)=>{
                return <StandingRow key={i} teamId={row.team.id} pos={i+1} points={row.points} games={row.playedGames} goalsFor={row.goalsFor} goalsAgainst={row.goalsAgainst} goalDifference={row.goalDifference} name={row.team.name} won={row.won} draw={row.draw} lost={row.lost} logo={row.team.crestUrl}  />;
              })
            }
            </tbody>
          </table>
        </div>
      </div>
    ) : (<div className="notice"><h3>You need to sign in to view this page</h3><Link to="/">Go home</Link></div>)
  }
}

export default withRouter(Table);