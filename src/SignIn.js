import React, { Component } from 'react';
import { ROUTES } from './constants';
import { Link, Redirect } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Header } from './Header';
import { Footer } from './Footer';
import './SignIn.css';

import './App.css';

export class SignIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            isLoggedIn: false
        }
    }

    componentDidMount() {
        this.authUnlisten = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                let email = user.email;
                this.setState({
                    email: email,
                    isLoggedIn: true
                })
            }
        });
    }

    componentWillUnmount() {
        this.authUnlisten();
    }

    pass() {
        return <Redirect to={ROUTES.Home} />
    }

    handleSignIn() {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => this.pass())
            .catch((err) => {
                this.setState({ errorMessage: err.message });
            });
    }

    handleChange(event) {
        let field = event.target.name; // which input
        let value = event.target.value; // what value

        let changes = {}; // object to hold changes
        changes[field] = value; // change this field
        this.setState(changes); // update state
    }

    render() {
        if (this.state.isLoggedIn === true) {
            return <Redirect to={ROUTES.Home} />
        }

        let forms = [{ class: "form-group-one-signin", label: "email-input", title: "Email", name: "email", type: "text", className: "Form-control", placeHolder: "[Email Address]" },
        { class: "form-group-two-signin", label: "password-input", title: "Password", name: "password", type: "password", className: "Form-control", placeHolder: "[Password]" },]
        
        let array = forms.map((d) => {
            return <div className={d.class}>
                <label className={d.label} htmlFor={d.name}>{d.title}</label>
                <input type={d.type}
                    className={d.className}
                    name={d.name}
                    placeholder={d.placeHolder}
                    onInput={(event) => { this.handleChange(event) }}>
                </input>
            </div>
        })

        return (
            <div>

            <div id="signin-image" role="img" alt ="signin image" aria-label="Textual Description">
            <h1 id="signin-title"><strong>Fitness Tracker</strong></h1> 
            </div>

                <Header />
                <div className="text">
                    <div>{array[0]}</div>
                    <div>{array[1]}</div>
                    <div onClick={() => this.handleSignIn()}>
                        <button type="submit" className="btn btn-primary" aria-label="Log In">SIGN IN</button>
                    </div>
                    <p>New to Fitness Tracker? <Link to={ROUTES.SignUp}> Sign Up! </Link> </p>
                </div>
                
                <Footer />
            </div>
        );
    }
}
