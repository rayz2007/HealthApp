import React, { Component } from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { ROUTES } from './constants';
import { SignIn } from './SignIn'
import { Home } from './Home'
import { Exercise } from './Exercise'
import { InputTable } from './InputTable'
import { Settings } from './Settings'
import { SignUp } from './SignUp'
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';


class App extends Component {
  render() {
    return (
      <div>

        <Router>
          <Switch>
            <Route exact path={ROUTES.SignIn} component={SignIn} />
            <Route path={ROUTES.SignUp} component={SignUp} />
            <Route path={ROUTES.Home} component={Home} />
            <Route path={ROUTES.Exercise} component={Exercise} />
            <Route path={ROUTES.Table} component={InputTable} />
            <Route path={ROUTES.Settings} component={Settings} />
            <Redirect to={ROUTES.SignIn} />
            </Switch>
        </Router>

      </div>
    );
  }
}

export default App;