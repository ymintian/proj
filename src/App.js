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
      </div>
    </Router>
  );
}



class Table extends Component {
  constructor(props){
    super(props);
    this.state = {teams_images:[]};
  }
  componentWillMount(){
    fetch('http://api.football-data.org/v2/competitions/PL/teams',
      {
        headers: { 'X-Auth-Token': '7b2ac51349fd45cab94bd34a5e8db4a5' },
        method: "GET"
      })
      .then((res)=>{
        return res.json();
        
      })
      .then((r)=>{console.log(r.teams);this.setState({teams_images:r.teams});})
      .catch((er)=>{console.log("error:"+er)});
  }
  render(){
    let l = this.state.teams_images.length;
    let src = this.state.teams_images.slice(0,l);
    
    let ar1 = [];
    src.forEach((el,i)=>{
      ar1.push(<Img src={el.crestUrl} key={i}/>);
    });
    console.log('ar1',ar1);
    return (
      <div>
        <h2>EPL Table</h2>
        <div>{ar1}</div>
      </div>
    );
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
