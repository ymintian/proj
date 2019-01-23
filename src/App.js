import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import fire from './my_config';
import Test from './s';
import Header from './header.js';
import firebase, {auth} from 'firebase';
import { BrowserRouter as Router, Redirect, Route, Link } from "react-router-dom";
import ScrollToTop from "./ScrollToTop.js";


class Basic extends Component {
  constructor(props){
    super(props);
    console.log('user from state',firebase.auth().currentUser);
    let d = async()=>{ let a = await firebase.auth().currentUser; console.log('fsdfsd',a) }
    d();
    console.log(4480);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.state = {user: firebase.auth().currentUser, isLoading:true, userSubscribe:true};
  }
  componentWillMount(){
    firebase.auth().onAuthStateChanged((user) => {
      console.log('user from onAuthStateChanged',user);
          if (user) {
            this.setState({ user });
            let db = firebase.database().ref(`users/${user.uid}`);
            console.log('db',db);
            let bool;
            db.on('value', (snapshot)=>{
                console.log('db value',snapshot);
                if(!snapshot.val()) {this.setState({ userSubscribe: false });return null};
                bool = snapshot.val().subscribe;
                console.log('bool from promise',bool);
                this.setState({ userSubscribe: bool });
            });
          }
          else {
            this.setState({user: null});
          } 
    })
    

    setTimeout(()=>{this.setState({isLoading: false})}, 2000);

    // async function a() {let us = await firebase.auth().currentUser;return us};
    // let user = a();
    // console.log('user from componentWillMount 1',user);
    // this.setState({user});
    // console.log('user from componentWillMount 2',user);
  }
  handleSignUp(e){
        e.preventDefault();
        let email = document.getElementById('email');
        let password = document.getElementById('password');
        let signUpContainer = document.getElementById('signUp-container');
        firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
            .then((res)=>{
                console.log("SUCCESS",res); 
                email.value = '';
                password.value = '';
                signUpContainer.querySelector('.err_message').style.color = "green";
                signUpContainer.querySelector('.err_message').innerHTML = "Sign up successful";
            })
            .catch((error)=>{
                let err = error.message;
                signUpContainer.querySelector('.err_message').innerHTML = err;
                console.log('ERROR',error);
            });
    }
    handleLogOut(e){
      firebase.auth().signOut().then(()=>{this.setState({user:null})}).catch(err=>{alert(err)});
    }
    handleSubscribe(e){
      console.log('subscribe event',e);
      let user_email = this.state.user.email;
      let uid = this.state.user.uid;
      firebase.database().ref(`users/${uid}`).set({subscribe: true,email: user_email});
    }
    handleLogIn(e){
        e.preventDefault();
        let email = document.getElementById('email_input');
        let password = document.getElementById('password_input');
        let login_btn = document.querySelector('#login-button');
        firebase.auth().signInWithEmailAndPassword(email.value, password.value)
            .then((res)=>{
                console.log("SUCCESS",res); 
                login_btn.querySelector('.err_message').style.color = "green";
                login_btn.querySelector('.err_message').innerHTML = "Login successful";
                this.setState({user:res});
                //window.location.href = "/table";
                //window.location.reload();
            })
            .catch((error)=>{
                let err = error.message;
                login_btn.querySelector('.err_message').innerHTML = err;
                console.log('ERROR',error);
            });
    }
    handleSwitch(e){
      e.preventDefault();
      let signUpForm = document.getElementById("signUp-container");
      signUpForm.style.top = "0";
      signUpForm.style.opacity = "1";
    }

    handleClose(e){
      let signUpForm = document.getElementById("signUp-container");
      signUpForm.style.top = "-100%";
      signUpForm.style.opacity = "0";
    }
  render(){
    let user = this.state.user;
    let userSubscribe = this.state.userSubscribe;
    return (
      <Router>
        <ScrollToTop>
          <Route exact path="/" render={()=> <App user={user} isLoading={this.state.isLoading} handleLogIn={this.handleLogIn} handleLogOut={this.handleLogOut} handleClose={this.handleClose} handleSwitch={this.handleSwitch} handleSignUp={this.handleSignUp}/> } />
          <Route path="/table" render={()=> <Table user={user} isLoading={this.state.isLoading} handleSubscribe={this.handleSubscribe} userSubscribe={userSubscribe} /> } />
          <Route exact path="/team/:id" component={Team} />
          <Route exact path="/team/:id/matches" component={TeamScoreboard} />
        </ScrollToTop>
      </Router>
    );
  }
}

// let user = firebase.auth().currentUser;
// console.log('user from main code',user);

class Table extends Component {
  constructor(props){
    super(props);
    this.state = {teams_images:null,competition:'PL',standing:null};
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
    console.log('render method');
    if(!this.state.standing) {
      console.log('no standing',this.state.standing,this.props.user);
      return null;
    } 
    console.log('prop user from Table', this.props.user);
    //let l = this.state.competitions.length;
    //let names = this.state.competitions.slice(0,l);
    let standing = this.state.standing.slice(0, this.state.standing.length);
    let user = this.props.user;
    let isLoading = this.props.isLoading;
    
    console.log('user from Table',user);
    
    console.log(standing);
    return isLoading ? <Loader /> : user ? (
      <div>
        <h2 className="home_link"><Link to='/'>Home</Link></h2>
        <div>
          <select className="league_select" onChange={this.handleChange} value={this.state.competition}>
            <option value="PL">English Premier League</option>
            <option value="PD" disabled={!this.props.userSubscribe}>Spanish Primera Division</option>
            <option value="BL1" disabled={!this.props.userSubscribe}>German Bundesliga</option>
            <option value="SA" disabled={!this.props.userSubscribe}>Italian Seria A</option>
            <option value="FL1" disabled={!this.props.userSubscribe}>French League 1</option>
            <option value="DED" disabled={!this.props.userSubscribe}>Netherlands Eredevise</option>
          </select>
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
    this.state = {teamInfo:null,matches:null};
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
    console.log('teaminfo',arr);
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
        // let competitions = r.competitions;
        // let ar = [];
        // competitions.forEach((item)=>{
        //   ar.push(<Competition name={item.name}/>);
        // });
        console.log('matches',r);
        this.setState({matches:r});
      })
      .catch((er)=>{console.log("error:"+er);});


  }
  
  render(){
    if(!this.state.teamInfo) return (<div><h3>Team not found</h3><Link to="/">Go home</Link></div>);
    let teamInfo = Object.assign({}, this.state.teamInfo);
    let matches = Object.assign({}, this.state.matches);
    
    console.log("5tregdf",teamInfo);
    if('errorCode' in teamInfo) 
      var info = 'team not found';
     else 
      var info = teamInfo;
  
    return <TeamInfo teamInfo={info} matches={matches} />;
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
        <TeamMainInfo info={info} matches={this.props.matches}/>
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
        <ScoreBtn matches={this.props.matches} info={info} />
      </div>
    )
  }
}

class ScoreBtn extends Component {
  constructor(props){
    super(props);
    //this.handleClick = this.handleClick.bind(this);
  }
  // handleClick(e){
  //   console.log('scores click',e);
  //   let id = this.props.info.id;
  //   let matches = this.props.matches;
  //   return <Redirect to={{pathname:`/team/${id}/matches`,state:matches}} />
  // }
  render(){
    let id = this.props.info.id;
    let matches = this.props.matches;
    return <div id="see_scores"><Link to={{pathname:`/team/${id}/matches`, state:{matches: matches,id: id}}}>See scores</Link></div>
  }
}

class TeamScoreboard extends Component {
  constructor(props){
    super(props);
  }
  render(){
    let games_arr = this.props.location.state.matches.matches;
    let id = this.props.location.state.id;
    console.log('scoreboard',games_arr);
    let games = games_arr.map((game)=>{

      let date = game.utcDate.split("T")[0];
      if(game.status == 'SCHEDULED') return <tr><td>{date}</td><td>{game.homeTeam.name}</td><td>-:-</td><td>{game.awayTeam.name}</td><td>-</td></tr> 
      let team = id == game.homeTeam.id ? 'homeTeam' : 'awayTeam';
      let opponent = team == 'homeTeam' ? 'awayTeam' : 'homeTeam';
      let res = game.score.fullTime[team] >= game.score.fullTime[opponent] ? 
      (game.score.fullTime[team] == game.score.fullTime[opponent] ? "D" : "W") : "L";
      let color = '';
      switch(res){
        case 'D':
          color = "blue";
          break;
        case 'L':
          color = 'red';
          break;
        case 'W':
          color = 'green';
          break;
      }
      let styles = {color:`${color}`,fontWeight: "700"};
      console.log('styles',styles);
      return <tr><td>{date}</td><td>{game.homeTeam.name}</td><td>{game.score.fullTime.homeTeam}:{game.score.fullTime.awayTeam}</td><td>{game.awayTeam.name}</td><td style={styles}>{res}</td></tr>;
    });
    return (
      <div>
        <h2 className="scores_head">Scores</h2>
        <table className="scores_table">
          <tbody>
            {games}
          </tbody>
        </table>
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
    this.state = { messages: [] }; 
  }
  componentWillMount(){
    /* Create reference to messages in Firebase Database */
    // let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);
    // messagesRef.on('child_added', snapshot => {
    //   /* Update React state when message is added at Firebase Database */
    //   let message = { text: snapshot.val(), id: snapshot.key };
    //   this.setState({ messages: [message].concat(this.state.messages) });
    // })
    
  }
  addMessage(e){
    e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the message to Firebase */
    fire.database().ref('messages').push( this.inputEl.value );
    this.inputEl.value = ''; // <- clear the input
  }

  /*render() {
    return (
      <div style={{height:"100%"}}>
        <Header/>
        <div className='fl'>
          { <form onSubmit={this.addMessage.bind(this)}>
            <input type="text" ref={ el => this.inputEl = el }/>
            <input type="submit"/>
            <ul>
              {
                this.state.messages.map( message => <li key={message.id}>{message.text}</li> )
              }
            </ul>
          </form> }
        <Test/>
        </div>
      </div>
    );
  }*/

  render(){
    console.log("APP");
    return !this.props.user ? ( this.props.isLoading ? <Loader /> : (

<div className="container">
  <div id="login" className="login">
    <div className="login-icon-field">
      <svg className="login-icon" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="5.0 -10.0 100.0 135.0" enableBackground="new 0 0 100 100" xmlSpace="preserve" height="160px" width="160px">
        <g>
          <path fill="#fff" className="ball-path" d="M93.853,50C93.853,25.471,74.181,5.515,50,5.515C25.819,5.515,6.147,25.471,6.147,50  S25.819,94.485,50,94.485c16.206,0,31.035-9.036,38.698-23.575l0.118-0.193l-0.014-0.009C92.107,64.361,93.853,57.204,93.853,50z   M51.941,7.896c-0.248-0.213-0.52-0.408-0.814-0.586c1.072,0.029,2.145,0.099,3.21,0.21C53.422,7.647,52.582,7.784,51.941,7.896z   M63.378,25.518l-2.597,16.013c-0.018-0.001-0.037-0.002-0.053-0.001l-0.113,0.009c-1.551,0.221-12.914,4.092-16.522,5.33  L30.442,35.902c1.224-6.101,3.005-13.031,3.917-13.943c1.26-1.26,11.494-6.129,16.433-6.129c0.532,0,0.984,0.058,1.323,0.165  C53.438,16.615,58.712,21.214,63.378,25.518z M40.063,66.207c0.752-3.58,3.125-14.789,3.898-17.415l0.246-0.085  c5.741-1.973,14.807-5.012,16.506-5.381c0.474,0.203,1.705,1.083,3.318,2.372c2.84,2.455,6.587,5.934,8.811,8.092  c0.466,0.53,0.836,0.995,1.079,1.343c1.355,3.559-1.241,10.932-2.488,14.475l-0.702,1.973c-0.252,0.202-0.639,0.505-1.883,1.038  c-4.051,1.732-12.558,4.122-15.767,4.433c-2.607-1.262-8.454-6.657-11.28-9.264C41.077,67.123,40.447,66.541,40.063,66.207z   M79.154,25.547l-0.315,0.725c-2.622-0.969-5.798-1.42-9.981-1.42c-1.158,0-2.216,0.033-3.15,0.062l-0.282,0.013l-0.088-0.018  c-1.217-1.131-10.343-9.581-12.536-10.556l-0.072-0.028c-0.191-0.064-0.402-0.115-0.657-0.158c0.226-1.659,0.555-3.708,0.708-4.645  c1.715-0.31,4.847-0.803,7.441-0.803c0.215,0,0.427,0.003,0.594,0.004c7.007,1.893,13.462,5.641,18.669,10.838  C80.469,21.834,79.675,24.074,79.154,25.547z M32.434,21.742c-1.535,3.144-3.253,11.391-3.771,13.991  c-1.339,0.945-7.472,5.443-12.355,11.849c-0.695-0.328-4.078-2.016-6.109-4.651l-0.064-0.254c-0.365-1.432-0.865-3.392,0.652-8.163  c0.675-1.754,1.477-3.486,2.384-5.149L26.56,18.576C28.268,19.356,31.16,20.743,32.434,21.742z M15.835,49.296  c2.606,11.039,4.235,14.948,5.99,17.551c-1.586,2.345-2.771,8.614-2.988,9.826c-0.764-0.233-1.693-0.717-2.764-1.443  C10.742,67.864,7.924,59.14,7.924,50c0-0.919,0.032-1.882,0.097-2.863c0.394-0.944,0.938-1.664,1.618-2.141  C11.01,46.561,14.088,48.701,15.835,49.296z M23.025,68.287c0.535,0.09,1.249,0.181,2.016,0.258  c1.015,0.198,2.228,0.298,3.606,0.298c0.341,0,0.685-0.006,1.022-0.017c0.407,0.009,0.82,0.014,1.236,0.014  c2.451,0,5.867-0.174,8.319-0.999c0.347,0.313,0.819,0.748,1.37,1.256c2.956,2.728,8.425,7.775,11.391,9.388  c-0.397,2.361-1.68,6.473-2.412,8.722c-0.45,1.011-1.873,1.536-4.465,1.652l-12.634-0.349c-4.34-1.211-10.267-8.291-12.07-10.764  C20.693,75.55,21.722,70.32,23.025,68.287z M36.919,90.514c1.643,0.072,3.893,0.169,6.144,0.169c3.585,0,6.07-0.243,7.59-0.743  c0.082,0.043,0.24,0.122,0.549,0.27c2.437,0.881,4.69,1.309,6.888,1.309c0.831,0,1.629-0.061,2.391-0.155  c-3.415,0.893-6.929,1.345-10.482,1.345c-4.542,0-9.017-0.741-13.318-2.205C36.76,90.507,36.839,90.51,36.919,90.514z   M72.516,86.059c2.798-2.577,4.374-5.359,4.96-6.394l0.069-0.121c0.292-0.214,0.742-0.538,1.297-0.937  c1.495-1.076,3.654-2.63,5.596-4.098C81.256,79.099,77.18,83.045,72.516,86.059z M72.501,72.021c0.1-0.342,0.333-1.039,0.608-1.82  c1.319-3.745,3.76-10.68,2.697-14.954c3.718-1.677,8.955-7.223,10.242-8.906c4.067,1.432,5.277,7.773,5.324,7.999  c-0.222,3.551-1.828,9.292-3.128,13.463c-0.329,0.725-0.687,1.459-1.045,2.15c-0.539,0.652-3.049,2.461-5.706,4.377  c-1.648,1.188-3.351,2.415-4.711,3.458c-1.068-1.421-2.946-3.859-4.303-5.283C72.475,72.503,72.393,72.389,72.501,72.021z   M92.076,50c0,0.192-0.002,0.383-0.005,0.573c-0.877-2.121-2.383-4.557-4.877-5.686c-0.204-2.906-1.801-12.047-6.574-18.138  c0.052-0.171,0.134-0.4,0.204-0.598c0.044-0.124,0.091-0.253,0.141-0.388c0.357-0.973,0.832-2.267,0.787-3.754  C88.414,29.787,92.076,39.704,92.076,50z M29.533,12.697l-2.941,3.271l-10.22,8.394C19.905,19.602,24.419,15.601,29.533,12.697z"/>
          <animateTransform 
            id="spin" 
            attributeName="transform"
            type="rotate"
            dur="2s"
            from="0 50 50"
            to="360 50 50"
            repeatCount=".4"
            fill="freeze"
          />
        </g>
      </svg>
    </div>
    <div className="login-form">
      <div className="username-row row">
        <label for="email_input">
        <svg version="1.1" className="user-icon" x="0px" y="0px"
        viewBox="-255 347 100 100" xmlSpace="preserve" height="36px" width="30px">
          <path className="user-path" d="
          M-203.7,350.3c-6.8,0-12.4,6.2-12.4,13.8c0,4.5,2.4,8.6,5.4,11.1c0,0,2.2,1.6,1.9,3.7c-0.2,1.3-1.7,2.8-2.4,2.8c-0.7,0-6.2,0-6.2,0
          c-6.8,0-12.3,5.6-12.3,12.3v2.9v14.6c0,0.8,0.7,1.5,1.5,1.5h10.5h1h13.1h13.1h1h10.6c0.8,0,1.5-0.7,1.5-1.5v-14.6v-2.9
          c0-6.8-5.6-12.3-12.3-12.3c0,0-5.5,0-6.2,0c-0.8,0-2.3-1.6-2.4-2.8c-0.4-2.1,1.9-3.7,1.9-3.7c2.9-2.5,5.4-6.5,5.4-11.1
          C-191.3,356.5-196.9,350.3-203.7,350.3L-203.7,350.3z"/>
        </svg>
        </label>
        <input type="text" id="email_input" autoComplete="off" className="username-input" placeholder="email"></input>
      </div>
      <div className="password-row row">
        <label for="password_input">
        <svg version="1.1" className="password-icon" x="0px" y="0px"
        viewBox="-255 347 100 100" height="36px" width="30px">
          <path className="key-path" d="M-191.5,347.8c-11.9,0-21.6,9.7-21.6,21.6c0,4,1.1,7.8,3.1,11.1l-26.5,26.2l-0.9,10h10.6l3.8-5.7l6.1-1.1
          l1.6-6.7l7.1-0.3l0.6-7.2l7.2-6.6c2.8,1.3,5.8,2,9.1,2c11.9,0,21.6-9.7,21.6-21.6C-169.9,357.4-179.6,347.8-191.5,347.8z"/>
        </svg>
        </label>
        <input type="password" id="password_input" className="password-input" className="input" placeholder="Password"></input>
      </div>
    </div>
    <div className="call-to-action">
      <button id="login-button" type="button" onClick={this.props.handleLogIn}>Log In<span className="err_message"></span></button>
      <p>Don't have an account? <a onClick={this.props.handleSwitch}>Sign Up</a></p>
    </div>
  </div>
  <div id="signUp-container">
    <form>
      <input type="text" id="email" placeholder="email"/>
      <input type="password" id="password" placeholder="password"/>
      <button id="signUp-btn" onClick={this.props.handleSignUp}>Sign Up<span className="err_message"></span></button>
      <span id="close-form" onClick={this.props.handleClose}>X</span>
    </form>
    
  </div>
</div>)
    )  : (<div><h3 className="user_greeting">Hi, {this.props.user.email}</h3><Link to="/table" className="go_to">Go to competitions</Link><button id="logout" onClick={this.props.handleLogOut}>Log out</button></div>)
  }
}

class Loader extends Component {
  render(){
    return <img src='https://thumbs.gfycat.com/ValidAdventurousFallowdeer-size_restricted.gif' className="img_loader" />;
  }
}

export default Basic;
