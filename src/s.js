import React, { Component } from 'react';
import firebase from 'firebase';
import './custom.css';
// export let i = 20;
// console.log("iiii"+i);
// let r = 5;
// console.log('rrrr'+r);

class Test extends Component {
    constructor(props){
        super(props);
    }
    handleClick(e){
        e.preventDefault();
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((res)=>{console.log("SUCCESS",res)})
            .catch((error)=>{
                console.log('ERROR',error);
            });
    }
    render (){
        return(
            <div className="signUpContainer">
                <form>
                    <input id='email' placeholder="email"/>
                    <input id='password' type="password" placeholder="password"/>
                    <button id='signUpBtn' onClick={this.handleClick}>sign up</button>
                </form>
            </div>
        );
    }
}

export default Test;