import React, { Component } from 'react';
import './App.css';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { ROUTES } from './constants';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Doughnut } from 'react-chartjs-2';
import { Header } from './Header';
import { Footer } from './Footer';
import { Navigation } from './Navigation';
import { ExerciseTable } from './ExerciseTable';
import './Exercise.css';

export class Exercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exercise: 'sleep for 0 minutes',
      exercises: [],
      email: "",
      data: {
        labels: [

        ],
        datasets: [{
          data: [],
          backgroundColor: [
          ],
          hoverBackgroundColor: [
          ]
        }]
      },
      totalCalories: 0
    };
    this.handleClick = this.handleClick.bind(this);
    this.changeExercise = this.changeExercise.bind(this);
  }

  changeExercise(event) {
    this.setState({ exercise: event.target.value });
  }

  updateCalories(event) {
    let currentCals = this.state.totalCalories;
    currentCals += event.target.value;
    this.setState({ totalCalories: currentCals });
  }

  handleClick(e) {
    e.preventDefault();
    this.fetchData();
  }

  componentDidMount() {
    this.authUnlisten = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          email: user.email
        })
      } else {
        return this.props.history.push(ROUTES.SignIn);
      }
    });
  }

  fetchData() {
    return fetch('https://trackapi.nutritionix.com/v2/natural/exercise', {
      method: 'post',
      headers: {
        'x-app-id': 'bfbe68de',
        'x-app-key': '956c67f76ec3a67a0db5f5ab7f998b33',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'query': this.state.exercise,
        'gender': 'female',
        'weight_kg': 72.5,
        'height_cm': 167.64,
        'age': 30
      })
    })
      .then(function (response) {
        return response.json();
      })
      .then(data => {
        this.setState({ exercises: data.exercises });
        let currLabels = this.state.data.labels;
        let currCalories = 0;
        let currData = this.state.data.datasets[0].data;
        let currColors = this.state.data.datasets[0].backgroundColor;
        //let newColr = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
        this.state.exercises.forEach(function (element) {
          let newColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
          currLabels.push(element.name);
          currCalories += element.nf_calories;
          currData.push(element.nf_calories);
          currColors.push(newColor);
        });
        this.setState({
          data: {
            labels: currLabels,
            datasets: [{
              data: currData,
              backgroundColor: ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
                '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
                '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
                '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
                '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
                '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'],
              hoverBackgroundColor: ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
                '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
                '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
                '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
                '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
                '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF']
            }]
          }
        });
        this.setState({ totalCalories: currCalories });
        let email = this.state.email;
        let subEmail = email.substr(0, email.indexOf('@'));
        let reference = firebase.database().ref('Profile/' + subEmail + '/Exercises');
        reference.push({
            exercise: this.state.exercise,
            calories: this.state.totalCalories
        });


      })
      .catch(function (error) {
        console.error(error);
      });
  }

  render() {
    return (
      <div>
        <Navigation />
        <Header />

      <div id="activity-image" role="img" aria-label="Textual Description" alt="activity image"></div>

        <div className='text'>
        <h1> How active were you today? </h1>

        <p>This chart acts as both an exercise diary and calorie tracker that allow users to easily input 
          the exercise and calories that they perform. </p> 

          <p> The input box requires users to write in <strong> natural
          language</strong> format. For example, you can simply type in <i>"Ran for 20 minutes and boxed for an hour"</i> and we will calculate the result for you. </p> 
          <p>The exercise and calories burned
          for each exercise that the user records will be put into the table below. </p>
          <p>There will be a <strong>doughnut chart</strong> that gets created at the bottom of the page when the user enters their exercises in order 
          to show a visualiztion of the duration of exercises that a user inputs in that current session.</p>
          <p>
          Although the visualization will not be saved everyday, the chart will still contain every entry that the user
          has inputted. This is because we think this data may be valuable for users as they can reflect and compare on 
          their past exercises and possibly even notice trends over time. The table allows users to filter through each column by typing 
          out what they are searching for and or changing the order of each column by clicking on the column titles. 
        </p>
          <BigForm click={this.handleClick} update={this.changeExercise} />
          <ExerciseTable />
          <Doughnut data={this.state.data} />
        </div>
        <Footer />
      </div>
    );
  }
}

class BigForm extends Component {
  render() {
    return (
      <FormGroup>
        <Label for="exerciseText">Tell me how you exercised below! </Label>
        <InputArea update={this.props.update} />
        <Button onClick={this.props.click}>SUBMIT</Button>
      </FormGroup>
    );
  }
}

class InputArea extends Component {
  render() {
    return (
      <Input type="textarea" name="text" id="exerciseText" onChange={this.props.update} placeholder='sleep for 0 minutes' />
    );
  }
}