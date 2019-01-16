import React, { Component } from 'react';
import firebase, {auth} from 'firebase';
import './custom.css';
// export let i = 20;
// console.log("iiii"+i);
// let r = 5;
// console.log('rrrr'+r);

class Test extends Component {
    constructor(props){
        super(props);
        this.state = {user:null};
    }
    componentDidMount() {
      auth().onAuthStateChanged((user) => {
            if (user) {
              this.setState({ user });
            } 
      })
    }
    handleClick(e){
        e.preventDefault();
        let email = document.getElementById('email');
        let password = document.getElementById('password');
        firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
            .then((res)=>{
                console.log("SUCCESS",res); 
                email.value = '';
                password.value = '';
            })
            .catch((error)=>{
                console.log('ERROR',error);
            });
    }
    handleLogin(e){
        e.preventDefault();
        let email = document.getElementById('email');
        let password = document.getElementById('password');
        firebase.auth().signInWithEmailAndPassword(email.value, password.value)
            .then((res)=>{
                console.log("SUCCESS",res); 
                window.location.reload();
            })
            .catch((error)=>{
                console.log('ERROR',error);
            });
    }
    render (){
        console.log(this.state.user);
        let user = this.state.user;
        return(
            <div className="signUpContainer">
                { user ? <span>log out</span> : <span>please log in</span> }
                <form>
                    <input id='email' placeholder="email"/>
                    <input id='password' type="password" placeholder="password"/>
                    <button id='signUpBtn' onClick={this.handleClick}>sign up</button>
                    <button id='loginBtn' onClick={this.handleLogin}>log in</button>
                </form>
            </div>
        );
    }
}

export default Test;