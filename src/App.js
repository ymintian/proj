import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import fire from './my_config';
import Test from './s';
import Header from './header.js';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


function BasicExample() {
  return (
    <Router>
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
    </Router>
  );
}



class Table extends Component {
  constructor(props){
    super(props);
    this.state = {teams_images:[],competitions:[],standing:[]};
  }
  componentWillMount(){
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
    fetch('https://api.football-data.org/v2/competitions/2003/standings',
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
        console.log(r.standings[0].table);
        this.setState({standing: r.standings[0].table});
        //this.setState({competitions: ar});
      })
      .catch((er)=>{console.log("error:"+er)});
  }
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
        <h2>Table</h2>
        <div>
          <table id="standing" style={{textAlign: "center",color: "#fff"}}>
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
                return <StandingRow key={i} teamId={row.team.id} pos={i+1} points={row.points} games={row.playedGames} goalsFor={row.goalsFor} goalsAgainst={row.goalsAgainst} goalDifference={row.goalDifference} name={row.team.name} won={row.won} draw={row.draw} lost={row.lost}  />;
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
        <td><Link to={`team/${this.props.teamId}`}>{this.props.name}</Link></td>
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

class Team extends Component {
  constructor(props){
    super(props);
    this.state = {teamInfo:[]};
  }
  componentWillMount(){
    let id = this.props.match.params.id;
    fetch(`https://api.football-data.org/v2/teams/${id}`,
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
        console.log(r);
        this.setState({teamInfo: r});
      })
      .catch((er)=>{console.log("error:"+er);this.setState({teamInfo:[]})});
  }
  
  render(){
    let teamInfo = Object.assign({}, this.state.teamInfo);
    
    console.log("5tregdf",teamInfo);
    if('errorCode' in teamInfo) 
      var info = 'team not found';
     else 
      var info = teamInfo;
  
    return <TeamInfo teamInfo={info}/>;
  }
}

class TeamInfo extends Component {

  render(){
    let info = this.props.teamInfo;
    let logo_src = info.crestUrl ? info.crestUrl : 'https://www.freeiconspng.com/uploads/no-image-icon-21.png';
    console.log(logo_src);
    if (typeof info == 'string') return <div>team not found</div>
    else  return (
      <TeamLogo logo_src={logo_src}/>
    )
  }
}

class TeamLogo extends Component {
  render(){
    
   return (
      <img src={this.props.logo_src} />
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
