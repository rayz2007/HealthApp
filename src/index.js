import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';


var config = {
    apiKey: "AIzaSyA7yTPLobAKgsjLti44a22WCrtXrXiAkKA",
    authDomain: "fitness-tracker-b9bb3.firebaseapp.com",
    databaseURL: "https://fitness-tracker-b9bb3.firebaseio.com",
    projectId: "fitness-tracker-b9bb3",
    storageBucket: "fitness-tracker-b9bb3.appspot.com",
    messagingSenderId: "1059127201149"
};

firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
