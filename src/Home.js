import React from 'react';
import { Link } from 'react-router-dom'

export default () => (
  <div className="Home">
    <img src="//placehold.it/400" style={{"width": "100%", "height": "400px"}}/>
    <p className="App-intro">
      <h1>Students</h1>
      <button>
        <Link to="student-expectations">Find a mentor</Link>
      </button>
      <h1>Faculty</h1>
      <Link to="faculty-expectations">Register as a mentor</Link>
    </p>
  </div>
)
