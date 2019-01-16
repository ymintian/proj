import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import fire from './my_config';
import Test from './s';
import Header from './header.js';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ScrollToTop from "./ScrollToTop.js";


function BasicExample() {
  return (
    <Router>
      <ScrollToTop>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/table">Table</Link>
          </li>
        </ul>

        <hr />

        <Route exact path="/" component={App} />
        <Route path="/table" component={Table} />
        <Route path="/team/:id" component={Team} />
      </div>
    </ScrollToTop>
    </Router>
  );
}

class Table extends Component {
  constructor(props){
    super(props);
    this.state = {teams_images:[],competition:'PL',standing:[]};
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e){
    let xhr = new XMLHttpRequest();
    console.log('e',e.target.value);
    xhr.open("GET",`https://api.football-data.org/v2/competitions/${e.target.value}/standings`,false);
    xhr.setRequestHeader('X-Auth-Token', '7b2ac51349fd45cab94bd34a5e8db4a5');
    let arr;
    xhr.onreadystatechange = function () {
      if(xhr.readyState === 4 && xhr.status === 200) {
        arr = JSON.parse(xhr.responseText);
      }
    };
    xhr.send();
    console.log('a',arr);
    this.setState({competition: e.target.value,standing: arr.standings[0].table});
  }
  componentDidMount(){
    // fetch('https://api.football-data.org/v2/competitions/PL/teams',
    //   {
    //     headers: { 'X-Auth-Token': '7b2ac51349fd45cab94bd34a5e8db4a5' },
    //     method: "GET"
    //   })
    //   .then((res)=>{
    //     return res.json();
        
    //   })
    //   .then((r)=>{console.log(r.teams);this.setState({teams_images:r.teams});})
    //   .catch((er)=>{console.log("error:"+er)});
    // fetch('https://api.football-data.org/v2/competitions/PL/standings',
    //   {
    //     headers: { 'X-Auth-Token': '7b2ac51349fd45cab94bd34a5e8db4a5' },
    //     method: "GET"
    //   })
    //   .then((res)=>{
    //     return res.json();
    //   })
    //   .then((r)=>{
    //     // let competitions = r.competitions;
    //     // let ar = [];
    //     // competitions.forEach((item)=>{
    //     //   ar.push(<Competition name={item.name}/>);
    //     // });
    //     console.log(r.standings[0].table);
    //     this.setState({standing: r.standings[0].table});
    //     //this.setState({competitions: ar});
    //   })
    //   .catch((er)=>{console.log("error:"+er)});

    let xhr = new XMLHttpRequest();
    xhr.open("GET",`https://api.football-data.org/v2/competitions/${this.state.competition}/standings`,false);
    xhr.setRequestHeader('X-Auth-Token', '7b2ac51349fd45cab94bd34a5e8db4a5');
    let arr;
    xhr.onreadystatechange = function () {
      if(xhr.readyState === 4 && xhr.status === 200) {
        arr = JSON.parse(xhr.responseText);
      }
    };
    xhr.send();
    console.log(arr);
    this.setState({standing: arr.standings[0].table});
  }
  // shouldComponentUpdate(){
  //   let xhr = new XMLHttpRequest();
  //   xhr.open("GET",`https://api.football-data.org/v2/competitions/${this.state.competition}/standings`,false);
  //   xhr.setRequestHeader('X-Auth-Token', '7b2ac51349fd45cab94bd34a5e8db4a5');
  //   let arr;
  //   xhr.onreadystatechange = function () {
  //     if(xhr.readyState === 4 && xhr.status === 200) {
  //       arr = JSON.parse(xhr.responseText);
  //     }
  //   };
  //   xhr.send();
  //   console.log(arr);
  //   this.setState({standing: arr.standings[0].table});
  // }
  render(){
    // let l = this.state.teams_images.length;
    // let src = this.state.teams_images.slice(0,l);
    
    // let ar1 = [];
    // src.forEach((el,i)=>{
    //   ar1.push(<Img src={el.crestUrl} key={i}/>);
    // });
    // console.log('ar1',ar1);
    


    //let l = this.state.competitions.length;
    //let names = this.state.competitions.slice(0,l);
    let standing = this.state.standing.slice(0, this.state.standing.length);
    console.log(standing);
    return (
      <div>
        <div>
          <select className="league_select" onChange={this.handleChange} value={this.state.competition}>
            <option value="PL">English Premier League</option>
            <option value="PD">Spanish Primera Division</option>
            <option value="BL1">German Bundesliga</option>
            <option value="SA">Italian Seria A</option>
            <option value="FL1">French League 1</option>
            <option value="DED">Netherlands Eredevise</option>
          </select>
        </div>
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
    );
  }
}

class StandingRow extends Component {

  render(){
    let color = this.props.goalDifference < 0 ? "red" : "green";
    return (
      <tr>
        <td>{this.props.pos}</td>
        <td><Link to={`team/${this.props.teamId}`}><SmallTeamLogo src={this.props.logo} />{this.props.name}</Link></td>
        <td>{this.props.games}</td>
        <td>{this.props.won}</td>
        <td>{this.props.draw}</td>
        <td>{this.props.lost}</td>
        <td>{`${this.props.goalsFor} - ${this.props.goalsAgainst}`}</td>
        <td style={{color: `${color}`}}>{this.props.goalDifference}</td>
        <td>{this.props.points}</td>
      </tr>
    )
  }
}

class SmallTeamLogo extends Component {
  constructor(props){
    super(props);
  }
  render(){
    let src = this.props.src || 'https://www.freeiconspng.com/uploads/no-image-icon-21.png';
    //console.log(src);
    return (
      <img src={src} className="small_team_logo" />
    )
  }
}

class Team extends Component {
  constructor(props){
    super(props);
    this.state = {teamInfo:[]};
  }
  componentWillMount(){
    // let id = this.props.match.params.id;
    // fetch(`https://api.football-data.org/v2/teams/${id}`,
    //   {
    //     headers: { 'X-Auth-Token': '7b2ac51349fd45cab94bd34a5e8db4a5' },
    //     method: "GET"
    //   })
    //   .then((res)=>{
    //     return res.json();
    //   })
    //   .then((r)=>{
    //     // let competitions = r.competitions;
    //     // let ar = [];
    //     // competitions.forEach((item)=>{
    //     //   ar.push(<Competition name={item.name}/>);
    //     // });
    //     console.log(r);
    //     this.setState({teamInfo: r});
    //   })
    //   .catch((er)=>{console.log("error:"+er);this.setState({teamInfo:[]})});


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
    console.log('gfdg',arr);
    this.setState({teamInfo: arr});


  }
  
  render(){
    let teamInfo = Object.assign({}, this.state.teamInfo);
    
    console.log("5tregdf",teamInfo);
    if('errorCode' in teamInfo) 
      var info = 'team not found';
     else 
      var info = teamInfo;
  
    return <TeamInfo teamInfo={info} />;
  }
}

class TeamInfo extends Component {
  constructor(props){
    super(props);
  }
  render(){
    let info = this.props.teamInfo;
    let logo_src = info.crestUrl ? info.crestUrl : 'https://www.freeiconspng.com/uploads/no-image-icon-21.png';
    console.log(logo_src);
    if (typeof info == 'string') return <div>team not found</div>
    else  return (
      <div className="team_info">
        <TeamLogo logo_src={logo_src}/>
        <TeamMainInfo info={info}/>
        <TeamSquad squad={info.squad}/>
      </div>
    )
  }
}


function parseColor(str){
  console.log('str',str);
  let arr = str.split('/').map((c)=> {
    let arr = c.trim().toLowerCase().split(" ");
    let l = arr.length;
    console.log(arr);
    return l > 1 ? arr[1] : arr[0];
  });
  return arr;
};

class TeamMainInfo extends Component {
  constructor(props){
    super(props);
  }
  render(){
    let info = this.props.info;
    let country = Object.assign({},info.area);
    
    console.log('info', info);
    let colors = parseColor(info.clubColors).map((color,i)=>{
      return <span key={i} style={{display:"inline-block",height: "20px",width: "20px", background:`${color}`}}></span>
    });
    
   return (
      <div>
        <h3>{info.name}</h3>
        <p>{country.name}</p>
        <p>{colors}</p>
        <p>{info.founded}</p>
        <p>{info.venue}</p>
        <p><a href={info.website} target="_blank">{info.website}</a></p>
        <p>{info.email}</p>
        <p>{info.phone}</p>
        <p>{info.address}</p>
      </div>
    )
  }
}

class TeamSquad extends Component {
  constructor(props){
    super(props);
  }
  render(){
   let players = this.props.squad.map((player)=>{
    return <PlayerRow key={player.id} player_info={player}/>;
   });

   return (
      <div>
        <h2 className="squad_head">Squad</h2>
        <table className="squad_table">
          <thead>
            <tr>
              <td>№</td>
              <td>name</td>
              <td>position</td>
              <td>age</td>
              <td>nationality</td>
            </tr>
          </thead>
          <tbody>
            {players}
          </tbody>
        </table>
      </div>
    )
  }
}

class PlayerRow extends Component {
  constructor(props){
    super(props);
  }
  render(){
   let player_info = this.props.player_info;
   let shirtNumber = player_info.shirtNumber || "#";
   let position = player_info.position || player_info.role.replace("_"," ");
   if(player_info.dateOfBirth) var ageInMs = Date.parse(new Date()) - Date.parse(new Date(player_info.dateOfBirth.split("T")[0]));
   else {console.log('player',player_info.dateOfBirth);var ageInMs = null;}
   let age = ageInMs ? Math.floor(ageInMs/(365*24*3600*1000)) : '-';
   return (
      <tr>
        <td>{shirtNumber}</td>
        <td>{player_info.name}</td>
        <td>{position}</td>
        <td>{age}</td>
        <td>{player_info.nationality}</td>
      </tr>
    )
  }
}


class TeamLogo extends Component {
  constructor(props){
    super(props);
  }
  render(){
    
   return (
      <div className="team_logo">
        <img src={this.props.logo_src} />
      </div>
    )
  }
}

class Competition extends Component {
  render(){
    return (
      <p>{this.props.name}</p>
    )
  }
}


class Img extends Component {
  render(){
    return (
      <div className="team_img_container">
        <img src={this.props.src}/>
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] }; // <- set up react state
  }
  componentWillMount(){
    /* Create reference to messages in Firebase Database */
    let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);
    messagesRef.on('child_added', snapshot => {
      /* Update React state when message is added at Firebase Database */
      let message = { text: snapshot.val(), id: snapshot.key };
      this.setState({ messages: [message].concat(this.state.messages) });
    })
  }
  addMessage(e){
    e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the message to Firebase */
    fire.database().ref('messages').push( this.inputEl.value );
    this.inputEl.value = ''; // <- clear the input
  }
  render() {
    return (
      <div style={{height:"100%"}}>
        <Header/>
        <div className='fl'>
          {/* <form onSubmit={this.addMessage.bind(this)}>
            <input type="text" ref={ el => this.inputEl = el }/>
            <input type="submit"/>
            <ul>
              {
                this.state.messages.map( message => <li key={message.id}>{message.text}</li> )
              }
            </ul>
          </form> */}
        <Test/>
        </div>
      </div>
    );
  }
}

export default BasicExample;
