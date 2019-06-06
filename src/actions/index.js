import firebase from 'firebase';


export function getUser(text) {
    let user = firebase.auth().currentUser;

    return { type: "GET_USER", user }
}