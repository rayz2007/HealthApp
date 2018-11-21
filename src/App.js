import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { HashRouter, Route, Link} from 'react-router-dom';
import { Container, Row, Col, Nav, NavItem, NavLink, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, Button, Form, FormGroup, Label, Input, FormText, Table } from 'reactstrap';
import 'whatwg-fetch';
import _ from 'lodash';

class App extends Component {
  
  render() {
    return (
      <HashRouter>
        <div className="container">
          <Route exact path="/" component={ Home } />
          <Route path="/calories" component={ Calorie } />
          <Route path="/exercise" component={ Exercise } />
        </div>
      </HashRouter>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink tag={Link} to="/" active>Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/calories">Calories</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/exercise">Exercise</NavLink>
          </NavItem>
        </Nav>
        <div className="section">
         <h1>Project Idea/Inspiration: Exercise/Nutrition</h1>
          <p>
              Nutrition and exercise are very important aspects of life. 
              Any healthy individual would be mindful of how they eat, and exercise on a daily basis. 
              However, many individuals today struggle to maintain a healthy lifestyle, 
              neglecting either their nutrition or exercise. 
              With many suffering with the consequences of an unhealthy lifestyle, 
              the need for proper information on how to take care of oneself is very helpful. 
              There is so much information on the internet for proper exercise and nutrition,
              but it is very scattered and many people struggle to find information that is very simple and easy to consume. 
          </p>
          <p>
              I have a strong interest in exercise and I would love to have somewhere to track my goals as well as 
              learn more about how to continue. 
              There are many sites that help with tracking health goals. Many help with tracking calories, workouts, and weight. 
              However, I feel that there is a lack of user-friendly sites that can 
              allow users to accurately track their goals based on their own body and needs. 
              There are many factors that go into fitness goals, and a web app that would allow users to easily 
              input their information and see detailed, 
              but well-designed information to get them on track would be great. 
              Some people might also want to come up with workout routines that are specific to certain areas of the body, 
              or with other specific goals. 
              These are all issues that could be solved with a good web application. 
          </p>
        </div>
      </div>
    );
  }
}

class Calorie extends Component {
  constructor(props) {
    super(props);
    this.state = {
        gender: "",
        age: 0,
        height: 0,
        weight: 0,
        calories : 0
    };
    this.changeNum = this.changeNum.bind(this);
    this.changeGender= this.changeGender.bind(this);
    this.changeAge = this.changeAge.bind(this);
    this.changeHeight = this.changeHeight.bind(this);
    this.changeWeight = this.changeWeight.bind(this);
    this.calculate = this.calculate.bind(this);
  }  
  changeNum(event) {
 
  }
  changeCals() {
    console.log(this.state.age);
    console.log(this.changeGender(3));
  }
  changeGender(event) {
    this.setState({gender: event.target.id});
  }
  changeAge(event) {
    this.setState({age: event.target.value});
  }
  changeHeight(event) {
    this.setState({height: event.target.value});
  }
  changeWeight(event) {
    this.setState({weight: event.target.value});
  }
  calculate(event) {
    let result;
    let height = this.state.height * 2.54;
    let weight = this.state.weight / 2.2;
    if (this.state.gender === "male") {
      result = 66.47 + (13.75 * weight) + (5.0 * height - (6.75 * this.state.age));
    } else if (this.state.gender === "female") {
      result = 665.09 + (9.56 * weight) + (1.84 * height - (4.67 * this.state.age));
    }
    this.setState({calories: Math.round(result)});
  }
  render() {
    return(
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink tag={Link} to="/">Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/calories" active>Calories</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/exercise">Exercise</NavLink>
          </NavItem>
        </Nav>

        <Form>
          <FormGroup check>
            <Input type="radio" name="gender" id="female" onChange={this.changeGender}/>
            <Label for="female">female</Label>
          </FormGroup>
          <FormGroup check>
            <Input type="radio" name="gender" id="male" onChange={this.changeGender}/>
            <Label for="male">male</Label>
          </FormGroup>
          <FormGroup>
            <Label for="age">Age:
              <Input id="age" type="number" onChange={this.changeAge}/>
                      years
            </Label>
          </FormGroup>
          <FormGroup>
            <Label for="height">Height:
              <Input id="height" type="number" onChange={this.changeHeight}/>
                      in inches (12 inches=1 foot)
            </Label>
          </FormGroup>
          <FormGroup>
            <Label for="weight">Weight:
              <Input id="weight" type="number" onChange={this.changeWeight}/>
                      in pounds
            </Label>
          </FormGroup>
          <Button onClick={this.calculate}>Submit</Button>
          <FormGroup>
            <Label for="total">
              <output id="total">
                  Base metabolic rate: <span id="totalCals">{this.state.calories}</span> kcal per day
              </output>
            </Label>
          </FormGroup>
          
        </Form>
      </div>      
    );
  }
}

class Exercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCals : 0,
      exercise : 'jumproped for 30 minutes',
      exercises: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.changeExercise = this.changeExercise.bind(this);
  }

  changeExercise(event) {
    this.setState({exercise: event.target.value});
  }

  handleClick(e) {
    e.preventDefault();
    this.fetchData();
  }

  componentDidMount() {
    this.fetchData();
  }


  fetchData(){
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
    .then(function(response) {
      return response.json();
    })
    .then(data => {
      this.setState({exercises: data.exercises});
    })
    .catch(function(error) {
      console.error(error);
    }); 
  }



  render() {
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink tag={Link} to="/">Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/calories">Calories</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/exercise" active>Exercise</NavLink>
          </NavItem>
        </Nav>

        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="exerciseText">Tell me how you exercised</Label>
                <InputArea update={this.changeExercise}/>
              </FormGroup>
              <Button onClick={this.handleClick}>Submit</Button>
            </Col>
            <Col md={6}>
              <Label for="total">
                Total Calories Burned: 
                <output id="total">
                    <span id="totalCals">{this.state.totalCals}</span> 
                </output>       
              </Label>
            </Col>
          </Row>
        </Form>
        <Table>
          <thead>
            <tr>
              <th>Exercise Name</th>
              <th>Duration</th>
              <th>Calories Burned</th>
            </tr>
          </thead>
          <Tablerow exercises={this.state.exercises}/>
        </Table>
      </div>
    );
  }
}

class InputArea extends Component {
  render() {
    return(
      <Input type="textarea" name="text" id="exerciseText" onChange={this.props.update} placeholder='walked for 30 minutes'/>
    );
  }
}

class Tablerow extends Component {
  render() {
    let totalExercises = this.props.exercises;
    let exList = totalExercises.map(element => {
      return(
        <tr key={element}>
          <td>{element.name}</td>
          <td>{element.duration_min}</td>
          <td>{element.nf_calories}</td>
        </tr>
      );
    });
    return(
      <tbody>
        {exList}
      </tbody>
    );
  }
}

export default App;
