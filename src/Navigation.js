import React, { Component } from 'react';
import { Navbar, NavbarToggler, Collapse, Nav, NavItem } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { ROUTES } from './constants';
import firebase from 'firebase/app';
import 'firebase/auth';
import './App.css';

export class Navigation extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            isOpen: false,
            isLoggedIn: true
        };
        this.logOut = this.logOut.bind(this)
    }

    omponentWillMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    isLoggedIn: true
                })
            }
        });
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    logOut() {
        firebase.auth().signOut()
        this.setState({
            isLoggedIn: false
        })
    }


    render() {
        if (this.state.isLoggedIn === false) {
            return <Redirect to={ROUTES.SignIn} />
        }
        return (
            <div>
                <Navbar className="navBar" light expand="md">

                    <div id="navbar-brand">
                        <Link to={ROUTES.Home} id="link" replace> FITNESS TRACKER</Link>
                    </div>

                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <Link to={ROUTES.Home} id="link" replace>Home</Link>
                            </NavItem>
                            <NavItem>
                                <Link to={ROUTES.Table} id="link" replace>Calorie Tracker</Link>
                            </NavItem>
                            <NavItem>
                                <Link to={ROUTES.Exercise} id="link" replace>Exercise Recorder</Link>
                            </NavItem>
                            <NavItem>
                                <Link to={ROUTES.Settings} id="link" replace>Settings</Link>
                            </NavItem>
                        </Nav>
                    </Collapse>
                    <div onClick={() => this.logOut()}>
                        <Link to={ROUTES.SignIn}><button id="sign-out" type="button">SIGN OUT</button></Link>
                    </div>
                </Navbar>
            </div>
        );
    }
}