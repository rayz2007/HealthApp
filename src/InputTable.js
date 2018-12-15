import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { DataTable } from './DataTable';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './InputTable.css';

export class InputTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            meal: "",
            calories: 0,
            value: "Snack",
            today: ""
        }
    }

    componentDidMount() {
        this.authUnlisten = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    email: user.email
                })
            }
        })
    }

    componentWillUnmount() {
        this.authUnlisten();
    }

    handleSubmit() {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth();
        let yyyy = today.getFullYear();

        today = [mm + 1] + '/' + dd + '/' + yyyy;

        let email = this.state.email;
        let subEmail = email.substr(0, email.indexOf('@'));

        // Add elements that user inputted into firebase database 
        let reference = firebase.database().ref('Profile/' + subEmail + '/Meals');
        reference.push({
            date: today,
            mealType: this.state.value,
            meal: this.state.meal,
            calories: this.state.calories
        })

        this.setState({
            value: "Snack"
        })

        // document.getElementById("meal").value = "";
        // document.getElementById("calories").value = "";
        // document.getElementById("mealType").value = this.state.value;
    }

    handleChange(event) {
        let field = event.target.name; // which input
        let value = event.target.value; // what value

        let changes = {}; // object to hold changes
        changes[field] = value; // change this field
        this.setState(changes); // update state
    }

    render() {

        let forms = [{ title: "Meal:", divClassName: "flex-start", type: "text", className: "form-control", id: "meal", name: "meal", placeholder: "[Meal]" },
        { title: "Calories:", divClassName: "flex-start", type: "number", className: "form-control", id: "calories", name: "calories", placeholder: "0" }]


        let array = forms.map((d) => {
            return <div className={d.divClassName}>
                <p>{d.title}</p>
                <input type={d.type}
                    className={d.className}
                    id={d.id}
                    name={d.name}
                    placeholder={d.placeholder}
                    onInput={(event) => { this.handleChange(event) }}>
                </input>
            </div>
        })

        return (
            <div>
                <Navigation />
                <Header />

                <div id="food-image" role="img" aria-label="Textual Description" alt="food image"></div>

                <div className='text'>
                <h1>Food Diary</h1>
                    <p>This chart acts as both a food diary and calorie tracker that allow users to easily input
                        the food and calories that they consume everyday. Users can add any snacks and meals
                        that they ate and the calories that go with it. The total calories that the
                        user has eaten everyday will appear at the bottom right corner of the chart including the "leftover
                        calories" that the user has in order to maintain their basic metabolic rate for that day.
                        These calculations will restart everyday, while still allowing users to see and reflect on their
                        previous food entries. This chart allows users to filter every column by typing
                        out what they are searching for and or change how the chart has been sorted through by clicking on the
                        column titles. The user is also allowed to delete and edit the meal name and calories on whichever row they choose
                        to edit.</p>

                    <p>NOTE: Users may need to scroll left on mobile devices to view the entire table.</p>
                    <div className="flex-start">
                        <h3> Pick a Meal Type: </h3>
                        <select
                            id="mealType"
                            value={this.state.value}
                            onChange={event =>
                                this.setState({
                                    value: event.target.value
                                })}>
                            <option value="Snack">Snack</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                            <option value="Dessert">Dessert</option>
                        </select>
                    </div>
                    <div>{array[0]}</div>
                    <div>{array[1]}</div>
                    <div onClick={event => this.handleSubmit(event)}>
                        <button type="submit" className="btn btn-default" aria-label="Submit">SUBMIT</button>
                    </div>

                    <DataTable />
                </div>

                <Footer />
            </div>
        )
    }
}