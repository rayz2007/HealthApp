import React, { Component } from 'react';
import './App.css';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import './Home.css';

export class Home extends Component {
  render() { 
    return (
      <div>
        <Navigation />
        <Header />

        <div id="image" role="img" alt ="fitness image" aria-label="Textual Description"></div>


        <div className='text'>

          <h1>Exercise and Nutrition</h1>
          <p>
            Nutrition and exercise are very important aspects of life. </p>
          <p>
            Any healthy individual would be mindful of how they eat, and exercise on a daily basis.
            However, many individuals today struggle to maintain a healthy lifestyle,
            neglecting either their nutrition or exercise. 
            With many suffering with the consequences of an unhealthy lifestyle,
            the need for proper information on how to take care of oneself is very helpful.
            There is so much information on the internet for proper exercise and nutrition,
            but it is very scattered and many people struggle to find information that is very simple and easy to consume.
            </p>
          <p>
            Our team has a strong interest in exercise and would love to be able to <strong>easily track our goals virtually</strong> in order
            to help us learn more about our health.
            There are many sites that help with tracking health goals today including a calorie tracker, workouts, and weight.
            However, we felt that most of these sites are not user-friendly for users
            to accurately track their goals based on their own body and needs.
            There are many factors that go into fitness goals, and a web app that would allow users to <strong>easily
            input their information</strong> and <strong>see detailed,
            but well-designed information</strong> to get them on track would be great.
            Some people might also want to come up with workout routines that are specific to certain areas of the body,
            or with other specific goals.
            These are all issues that could be solved with a good web application.
            </p>
        </div>
        <Footer />
      </div >
    );
  }
}
