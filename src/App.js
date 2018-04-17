import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

import './App.css';
import Home from './Home'
import FacultyExpectations from './FacultyExpectations'
import StudentExpectations from './StudentExpectations'
import EditProfile from './EditProfile'


export default class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">HMS Advises</h1>
        </header>
        <Router>
          <div>
            <Route exact path="/" component={Home}/>
            <Route path="/student-expectations" component={StudentExpectations}/>
            <Route path="/faculty-expectations" component={FacultyExpectations}/>
            <Route path="/edit-profile" component={EditProfile}/>
          </div>
        </Router>
      </div>
    )
  }
}
