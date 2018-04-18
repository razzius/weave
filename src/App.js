import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'

import './App.css';
import Home from './Home'
import Browse from './Browse'
import FacultyExpectations from './FacultyExpectations'
import StudentExpectations from './StudentExpectations'
import EditProfile from './EditProfile'
import Profile from './Profile'


export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Link to="/" className="App-title">
              <h1>HMS Advises</h1>
            </Link>
          </header>
          <div>
            <Route exact path="/" component={Home}/>
            <Route path="/student-expectations" component={StudentExpectations}/>
            <Route path="/faculty-expectations" component={FacultyExpectations}/>
            <Route path="/edit-profile" component={EditProfile}/>
            <Route path="/browse" component={Browse}/>
            <Route path="/faculty/:id" component={Profile}/>
          </div>
      </div>
      </Router>
    )
  }
}
