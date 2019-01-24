/* eslint-disable default-case */
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './custom.css';
import fire from './my_config';
import firebase, {auth} from 'firebase';
import { BrowserRouter as Router, Redirect, Route, Link } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.js";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Basic from "./components/Basic.js";
import Table from "./components/Table.js";
import Team from "./components/Team.js";
import TeamScoreboard from "./components/TeamScoreboard.js";

class App extends Component {
  constructor(props){
    super(props);
    //console.log('user from state',firebase.auth().currentUser);
    let d = async()=>{ let a = await firebase.auth().currentUser; //console.log('fsdfsd',a) 
  }
    d();
    //console.log(4480);
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
      //console.log('user from onAuthStateChanged',user);
          if (user) {
            this.setState({ user });
            let db = firebase.database().ref(`users/${user.uid}`);
            //console.log('db',db);
            let bool;
            db.on('value', (snapshot)=>{
                //console.log('db value',snapshot);
                if(!snapshot.val()) {this.setState({ userSubscribe: false });return null};
                bool = snapshot.val().subscribe;
                //console.log('bool from promise',bool);
                this.setState({ userSubscribe: bool });
            });
          }
          else {
            this.setState({user: null});
          } 
    })
    

    setTimeout(()=>{this.setState({isLoading: false})}, 2000);

  }
  handleSignUp(e){
        e.preventDefault();
        let email = document.getElementById('email');
        let password = document.getElementById('password');
        let signUpContainer = document.getElementById('signUp-container');
        firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
            .then((res)=>{
                //console.log("SUCCESS",res); 
                email.value = '';
                password.value = '';
                signUpContainer.querySelector('.err_message').style.color = "green";
                signUpContainer.querySelector('.err_message').innerHTML = "Sign up successful";
            })
            .catch((error)=>{
                let err = error.message;
                signUpContainer.querySelector('.err_message').innerHTML = err;
                //console.log('ERROR',error);
            });
    }
    handleLogOut(e){
      firebase.auth().signOut().then(()=>{this.setState({user:null})}).catch(err=>{alert(err)});
    }
    handleSubscribe(e){
      //console.log('subscribe event',e);
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
                //console.log("SUCCESS",res); 
                login_btn.querySelector('.err_message').style.color = "green";
                login_btn.querySelector('.err_message').innerHTML = "Login successful";
                this.setState({user:res});
                //window.location.href = "/table";
                //window.location.reload();
            })
            .catch((error)=>{
                let err = error.message;
                login_btn.querySelector('.err_message').innerHTML = err;
                //console.log('ERROR',error);
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
            <Route exact path="/" render={()=> <Basic user={user} isLoading={this.state.isLoading} handleLogIn={this.handleLogIn} handleLogOut={this.handleLogOut} handleClose={this.handleClose} handleSwitch={this.handleSwitch} handleSignUp={this.handleSignUp}/> } />
            <Route path="/table" render={()=> <Table user={user} isLoading={this.state.isLoading} handleSubscribe={this.handleSubscribe} userSubscribe={userSubscribe} /> } />
            <Route exact path="/team/:id" component={Team} />
            <Route exact path="/team/:id/matches" component={TeamScoreboard} />  
          </ScrollToTop>
      </Router>
    );
  }
}


export default App;
