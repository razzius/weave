import React from "react"
import { Link } from "react-router-dom"

const Home = () => (
  <div className="Home">
    <main id="background">
      <div className="App-intro">
        <h1>Students</h1>
        <Link className="button" to="student-expectations">
          Find a mentor
        </Link>
        <h1>Faculty</h1>
        <Link className="button" to="faculty-expectations">
          Register as a mentor
        </Link>
      </div>
    </main>
    <section id="about">
      <h1>About</h1>
      <p>This mentorship program and platform was developed to provide a customized way for students to find invested mentors for professional and/or personal interests. While resources for faculty contact information exist, there are often unclear guidelines about what a relationship will constitute after a student reaches out and varying degrees of involvement with which faculty may feel comfortable engaging in a mentorship role. This program provides an opt-in mentoring structure with clarified expectations for both mentors and mentees that may encourage more longitudinal and hopefully meaningful mentoring experiences. Through personalizing their profiles, mentors may share a preferred cadence for meeting with students, and may indicate in what areas and in what capacities they would like to mentor students. Furthermore, the “clinical interests” and “additional interests” tags and search feature provide opportunities for students to find mentors with whom they may discuss career interests, the process of discovering and developing these interests, and integrating additional aspects such as balancing family life, passion for social justice advocacy, and more.</p>
    </section>
    <section id="additional-resources">
      <h3>Additional Resources</h3>
      <ul>
        <li>
          <a href="https://medstudenthandbook.hms.harvard.edu/1019-thrive-mobile-app">Thrive Mobile App</a>
        </li>
        <li>
          <a href="https://meded.hms.harvard.edu/student-advising">Student Advising</a>
        </li>
        <li>
          <a href="https://collaborate.hms.harvard.edu/display/hmsadvising/Specialty+Advising">Specialty Advising</a>
        </li>
        <li>
          <a href="https://collaborate.hms.harvard.edu/display/hmsadvising/Personal+Advising">Personal Advising</a>
        </li>
      </ul>
    </section>
  </div>
)

export default Home

