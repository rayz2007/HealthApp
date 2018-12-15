import React, { Component } from 'react';
import './App.css';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { FormGroup, Label } from 'reactstrap';
import { ROUTES } from './constants';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Redirect, Link } from 'react-router-dom';
import './Settings.css';

export class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            gender: '',
            email: '',
            subEmail: '',
            weight: 0,
            height: 0,
            age: 0,
            cal: 0
        }
        this.cancel = this.cancel.bind(this)
    }

    componentWillMount() {
        this.authUnlisten = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    email: user.email,
                    subEmail: user.email.substr(0, user.email.indexOf('@'))
                })

                let reference = firebase.database().ref('Profile/' + this.state.subEmail + '/Author');
                reference.on('value', (snapshot) => {
                    let settings = snapshot.val();

                    if (settings != null) {
                        this.setState({
                            name: settings.Name,
                            gender: settings.Gender,
                            weight: settings.Weight,
                            height: settings.Height,
                            age: settings.Age,
                            cal: settings.Calories
                        })
                    }

                })
            }
        })
    }

    componentWillUnmount() {
        this.authUnlisten();
    }

    handleChange(event) {
        let field = event.target.name; // which input
        let value = event.target.value; // what value

        let changes = {}; // object to hold changes
        changes[field] = value; // change this field
        this.setState(changes); // update state
    }

    updateSettings() {
        let reference = firebase.database().ref('Profile/' + this.state.subEmail + '/Author');
        reference.on('value', (snapshot) => {
            let settings = snapshot.val();

            if (this.state.name !== undefined && this.state.name !== settings.Name) {
                reference.child('Name').set(this.state.Name)
            } else {
                this.setState({
                    name: settings.Name
                })
            }
            if (this.state.age !== undefined && this.state.age !== settings.Age) {
                reference.child('Age').set(this.state.age)
            } else {
                this.setState({
                    age: settings.Age
                })
            }
            if (this.state.gender !== undefined && this.state.gender !== settings.Gender) {
                reference.child('Gender').set(this.state.gender)
            } else {
                this.setState({
                    gender: settings.Gender
                })
            }
            if (this.state.weight !== undefined && this.state.weight !== settings.Weight) {
                reference.child('Weight').set(this.state.weight)
            } else {
                this.setState({
                    weight: settings.Weight
                })
            }
            if (this.state.height !== undefined && this.state.height !== settings.Height) {
                reference.child('Height').set(this.state.height)
            } else {
                this.setState({
                    height: settings.Height
                })
            }

            let height = Number(this.state.height) * 2.54;

            let weight = Number(this.state.weight) / 2.2;
            if (this.state.gender === "male") {
                let result = 66.47 + (13.75 * weight) + (5.0 * height - (6.75 * Number(this.state.age)));
                reference.child('Calories').set(Math.round(result))
                this.setState({
                    cal: Math.round(result)
                });

            } else if (this.state.gender === "female") {
                let result = 665.09 + (9.56 * weight) + (1.84 * height - (4.67 * Number(this.state.age)));
                reference.child('Calories').set(Math.round(result))
                this.setState({
                    cal: Math.round(result)
                });
            }
        })
    }

    cancel() {
        return <Redirect to={ROUTES.SignIn} />
    }

    render() {
        
        let forms = [{ setting: "name-settings", label: "name-label", attribute: "Name", type: "string", className: "form-control", name: 'name', placeholder: this.state.name, title: 'Name' },
        { setting: 'age-settings', label: 'age-label', attribute: 'Age', type: 'number', className: 'form-control', name: 'age', min: '0', step: '1.0', placeholder: this.state.age, title: 'Age' },
        { setting: 'weight-settings', label: 'weight-label', attribute: 'Weight', type: 'number', className: 'form-control', name: 'weight', min: '0', step: '0.01', placeholder: this.state.weight, title: 'Weight' },
        { setting: 'height-settings', label: 'height-label', attribute: 'Height', type: 'number', className: 'form-control', name: 'height', min: '0', step: '1.0', placeholder: this.state.height, title: 'Height' }
        ]

        let birthSex = [{ for:"female", title: "Female"}, 
                        { for:"male", title: "Male"}]
    
        let gender = birthSex.map((d, i) => {
            return <div>
                <FormGroup check>
                    <Label for= {d.for}>{d.title}</Label>
                    <input type="radio"
                        className="form-control"
                        value={d.for}
                        name="gender"
                        onChange={(event) => { this.handleChange(event) }}>
                    </input>
                </FormGroup>
            </div >
        })

        let array = forms.map((d, i) => {
            return <div className={d.class}>
                <div className={d.setting}>
                    <label className={d.label} htmlFor={d.attribute}>{d.title}</label>
                    <input type={d.type}
                        className={d.className}
                        name={d.name}
                        min={d.min}
                        step={d.step}
                        placeholder={d.placeholder}
                        onChange={(event) => { this.handleChange(event) }}>
                    </input>
                </div>
            </div>
        })


        return (
            <div>
                <Navigation />
                <Header />
                <div className='text'>
                    <div>{array[0]}</div>
                    <div>{array[1]}</div>
                    <div>{array[2]}</div>
                    <div>{array[3]}</div>
                    <div className="gender-settings">
                        <label className="gender-label" htmlFor="gender">Birth Sex</label>
                        <div>{gender[0]}</div>
                        <div>{gender[1]}</div>
                    </div>
                    <div className="save" onClick={() => this.updateSettings()}>
                         <button id="save-button">SAVE</button>
                     </div>
                    <div onClick={() => this.cancel() }>
                        <Link to={ROUTES.SignIn}><button className="btn btn-default" type="button">CANCEL</button></Link>
                    </div>
                    <p>Base metabolic rate: <span id="totalCals">{this.state.cal}</span> kcal per day</p>
                </div>
                <Footer />
            </div >
        )
    }
}