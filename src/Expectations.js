import React from 'react'
import { Link } from "react-router-dom"
import AppScreen from './AppScreen'

const Expectations = () => (
  <AppScreen>
    <h2>Expectations</h2>
    <p>
      To read about expectations for mentors and mentees, please use the buttons below.
    </p>
    <p>
      <Link className="button" to="/mentor-expectations">
        Mentor Expectations
      </Link>
    </p>

    <p>
      <Link className="button" to="/mentee-expectations">
        Mentee Expectations
      </Link>
    </p>
  </AppScreen>
)

export default Expectations
