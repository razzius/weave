import React from 'react'
import StudentExpectationsSlider from './StudentSlider'
import AppScreen from './AppScreen'

export default function StudentExpectations() {
  return (
    <AppScreen>
      <h1>Expectations of Students</h1>
      <StudentExpectationsSlider />
    </AppScreen>
  )
}
