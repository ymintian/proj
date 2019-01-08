import firebase from 'firebase'
var config = { /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
    apiKey: "AIzaSyCzXfb6etEOUGLPdJtLPBvUCE9qHxNA4Is",
    authDomain: "test-6ce23.firebaseapp.com",
    databaseURL: "https://test-6ce23.firebaseio.com",
    projectId: "test-6ce23",
    storageBucket: "test-6ce23.appspot.com",
    messagingSenderId: "1097993840672"
};
var fire = firebase.initializeApp(config);
export default fire;
