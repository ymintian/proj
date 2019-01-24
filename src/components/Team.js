import React, { Component } from 'react';
import  {Link} from "react-router-dom";
import TeamInfo from './TeamInfo.js';

class Team extends Component {
  constructor(props){
    super(props);
    this.state = {teamInfo:null,matches:null};
  }
  componentWillMount(){
    let xhr = new XMLHttpRequest();
    let id = this.props.match.params.id;
    
    xhr.open("GET",`https://api.football-data.org/v2/teams/${id}`,false);
    xhr.setRequestHeader('X-Auth-Token', '7b2ac51349fd45cab94bd34a5e8db4a5');
    let arr;
    
    xhr.onreadystatechange = function () {
      if(xhr.readyState === 4 && xhr.status === 200) {
        arr = JSON.parse(xhr.responseText);
      }
    };
    xhr.send();
    //console.log('teaminfo',arr);
    this.setState({teamInfo: arr});

    fetch(`https://api.football-data.org/v2/teams/${id}/matches`,
      {
        headers: { 'X-Auth-Token': '7b2ac51349fd45cab94bd34a5e8db4a5' },
        method: "GET"
      })
      .then((res)=>{
        return res.json();
      })
      .then((r)=>{
        this.setState({matches:r});
      })
      .catch((er)=>{
        //console.log("error:"+er);
    });


  }
  
  render(){
    if(!this.state.teamInfo) return (<div><h3>Team not found</h3><Link to="/">Go home</Link></div>);
    let teamInfo = Object.assign({}, this.state.teamInfo);
    let matches = Object.assign({}, this.state.matches);
    
    if('errorCode' in teamInfo) 
      var info = 'team not found';
     else 
      var info = teamInfo;
  
    return (<div> <h2 className="home_link"><Link to='/'>Home</Link></h2><TeamInfo teamInfo={info} matches={matches} /></div>)
  }
}

export default Team;