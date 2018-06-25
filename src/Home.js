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
      <p>
        This mentorship platform was developed to provide an interest-driven way for students to find invested mentors for professional or personal guidance. Although resources for faculty contact information exist, student have found there to be unclear expectations about what a relationship or experience will constitute from the faculty point of view. In recognizing that students can only set expectations for their side of the mentoring relationship, we designed a platform that allows faculty to more clearly communicate their own level of comfort in engaging in a mentoring relationship. In light of the many clinical, academic, and personal demands that exist for faculty, we hope to empower faculty to articulate for themselves their level of mentorship involvement.
      </p>

      <p>
        This mentorship platform provides an opt-in, tailored mentoring structure with clear, adjustable expectations for both mentors and mentees in the hopes of encouraging more longitudinal and meaningful mentoring experiences.
      </p>

      <p>
        For faculty, profiles may be personalized; faculty can share a preferred cadence for meeting with students, may indicate topics that they are willing to discuss, and can show or hide their profiles based on their availability. Students may search for mentors using both clinical and non-clinical “tags” as well as view available faculty profiles. In each profile, students will see additional opportunities that each faculty offers and other preferences that faculty members have chosen for themselves.
      </p>
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

