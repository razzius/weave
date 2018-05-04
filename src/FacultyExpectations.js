import React from 'react';
import { Link } from 'react-router-dom'
import FacultyExpectationsSlider from './FacultyCarousel'
import AppScreen from './AppScreen'
const welcomeMessage = `Thank you for agreeing to be a faculty mentor for the upcoming academic year. To help facilitate a positive longitudinal relationship between faculty and students and mutual development throughout the year, we have included a list of expectations, below. Please take a moment to read through these.`

const adaptedFromLink = 'http://www.marquette.edu/fmp/documents/GuidelinesforMentors.pdf'

export default () => (
  <AppScreen>
    <h1>Expectations of Faculty</h1>
    <FacultyExpectationsSlider/>
  </AppScreen>
)
