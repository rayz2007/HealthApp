import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { HashRouter, Route, Link} from 'react-router-dom';
import { Container, Row, Col, Nav, NavItem, NavLink, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

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

    };
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
        
      </div>
    );
  }
}

export default App;
