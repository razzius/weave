import React from 'react';
import { Link } from 'react-router-dom'

export default () => (
  <div className="Home">
    <div id="background"></div>
    <div className="top-padding">
      <div className="App-intro">
        <h1>Students</h1>
        <Link className="button" to="student-expectations">Find a mentor</Link>
        <h1>Faculty</h1>
        <Link className="button" to="faculty-expectations">Register as a mentor</Link>
      </div>
    </div>
  </div>
)
