import React, { Component } from 'react';
import './App.css';

export class Footer extends Component {
    render() {
      return (
          <footer>
            <p>Created By: Ray Zhang, Alexis Choi, Soobin Kwon, and Maura Cassidy</p>
            <p>&copy; Copyright 2018 </p>
            <p>Contact Information: <a href="mailto:fitnesstracker" aria-label="email"> fitness_tracker@gmail.com</a></p>
          </footer>
  
      )
    }
  }