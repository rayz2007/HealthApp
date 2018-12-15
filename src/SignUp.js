import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Header } from './Header';
import { Footer } from './Footer';
import { FormGroup, Label } from 'reactstrap';
import { ROUTES } from './constants';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Redirect, Link } from 'react-router-dom';

export class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            age: 0,
            height: 0,
            gender: "",
            cal: 0,
            weight: 0,
            isLoggedIn: false
        }
        this.cancel = this.cancel.bind(this)
    }


    componentWillMount() {
        this.authUnlisten = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    isLoggedIn: true
                })
            }
        });
    }

    componentWillUnmount() {
        this.authUnlisten();
    }

    handleSignUp() {
        if (this.state.email === '' || this.state.password === '' || this.state.fullName === ''
            || this.state.userName === '' || this.state.weight === '' || this.state.weight.includes("e")) {
            return;
        } else {
            firebase.auth().createUserWithEmailAndPassword(this.state.email,
                this.state.password)
                .then(this.handleAdd())
                .catch()
        }
    }

    handleChange(event) {
        let field = event.target.name; // which input
        let value = event.target.value; // what value

        let changes = {}; // object to hold changes
        changes[field] = value; // change this field
        this.setState(changes); // update state)
    }

    handleAdd() {
        let email = this.state.email;
        let subEmail = email.substr(0, email.indexOf('@'));


        let height = Number(this.state.height) * 2.54;
        let weight = Number(this.state.weight) / 2.2;
        let result;
        if (this.state.gender === "male") {
            result = Math.round(66.47 + (13.75 * weight) + (5.0 * height - (6.75 * Number(this.state.age))));
        } else if (this.state.gender === "female") {
            result = Math.round(665.09 + (9.56 * weight) + (1.84 * height - (4.67 * Number(this.state.age))));
        }

        let reference = firebase.database().ref('Profile/');
        let newData = {
            Author: {
                Name: this.state.name,
                Age: this.state.age,
                Gender: this.state.gender,
                Calories: result,
                Weight: this.state.weight,
                Height: this.state.height
            }
        }
        reference.child(subEmail).set(newData)
    }

    cancel() {
        return <Redirect to={ROUTES.SignIn} />
    }

    render() {
        if (this.state.isLoggedIn === true) {
            return <Redirect to={ROUTES.Home} />
        }

        let forms = [{ className: "email-label", attribute: "email", title: "Email", type: "text", },
        { className: "password-label", attribute: "password", title: "Password - must be at least 6 characters long", type: "password" },
        { className: "name-label", attribute: 'name', title: "Full Name", type: 'text' },
        { className: "age-label", attribute: "age", title: "Age", type: 'number', min: '0', step: '1.0' },
        { className: "weight-label", attribute: "weight", title: "Weight (lbs)", type: 'number', min: '0', step: '0.01' },
        { className: "height-label", attribute: "height", title: "Height (inches)", type: 'number', min: '0', step: '1.0' }]

        let array = forms.map((d, i) => {
            return <div>
                <label className={d.className} htmlFor={d.attribute}>{d.title}</label>
                <input type={d.type}
                    className="form-control"
                    required
                    name={d.attribute}
                    min={d.min}
                    step={d.step}
                    onChange={(event) => { this.handleChange(event) }}>
                </input>
            </div>
        })

        let birthSex = [{ for: "female", title: "Female" },
        { for: "male", title: "Male" }]

        let gender = birthSex.map((d, i) => {
            return <div>
                <FormGroup check>
                    <Label for={d.for}>{d.title}</Label>
                    <input type="radio"
                        className="form-control"
                        value={d.for}
                        name="gender"
                        onChange={(event) => { this.handleChange(event) }}>
                    </input>
                </FormGroup>
            </div >
        })

        return (
            <div>
                <Header />
                <div className="text">
                    <p>Please fill out this entire form in order to have access to Fitness Tracker!</p>
                    <div>{array[0]}</div>
                    <div>{array[1]}</div>
                    <div>{array[2]}</div>
                    <div>{array[3]}</div>
                    <label className="gender-label" htmlFor="gender">Birth Sex</label>
                        <div>{gender[0]}</div>
                        <div>{gender[1]}</div>
                    <div>{array[4]}</div>
                    <div>
                        {array[5]}
                        <p>NOTE: 12 inches = 1 foot</p>
                    </div>
                    <div onClick={() => this.handleSignUp()}>
                        <button type="submit" className="btn btn-primary">CREATE AN ACCOUNT</button>
                    </div>
                    <div onClick={() => this.cancel()}>
                        <Link to={ROUTES.SignIn}><button className="btn btn-default" type="button">CANCEL</button></Link>
                    </div>
                </div>
                <Footer />
            </div >
        );
    }
}