import React from 'react';
import { Link } from 'react-router-dom'

export default () => (
  <div className="Home">
    <p className="App-intro">
      <h1>Students</h1>
      <Link to="student-expectations">Find a mentor</Link>
      <h1>Faculty</h1>
      <Link to="faculty-expectations">Register as a mentor</Link>
    </p>
  </div>
)
