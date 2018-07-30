import React from "react"
import { Link } from "react-router-dom"

const Home = (props) => (
  <div className="Home">
    <main id="background">
      <div className="App-intro">
        {props.isMentor !== true && <div>
          <h1>Students</h1>
          <Link className="button" to={props.token ? "/browse" : "/student-expectations"}>
            Find a mentor
          </Link>
        </div>}
        {!(props.token && !props.isMentor) && <div>
          <h1>Faculty</h1>
          <Link className="button" to={props.isMentor ? "/edit-profile" : "/faculty-expectations"}>
            {props.isMentor ? 'Edit profile' : 'Register as a mentor'}
          </Link>
        </div>}
        {
          props.isMentor && <div>
            <Link className="button" to="/browse">
              Browse profiles
            </Link>
          </div>
        }
      </div>
    </main>
    <section id="about">
      <h1>About</h1>
      <p>
        Soon after entering medical school, students are faced with a new learning and social environment and pressure to quickly determine academic or clinical interests. Although resources for faculty contact information exist, both students and faculty have found there to be unclear expectations about what a mentorship relationship or experience will constitute. Furthermore, for students with myriad interests who are still in the process of discovering their desired field of medicine, it is often challenging to know who to reach out to when lists of faculty members are provided solely based on clinical specialty.
      </p>

      <p>
        We developed a mentorship platform that provides an interest-driven way for students to find invested mentors for professional or personal guidance. In recognizing that students can only set expectations for their side of the mentoring relationship, our platform will allow faculty to more clearly communicate their own level of comfort in engaging in a mentoring relationship. In recognizing that many clinical, academic, and personal demands exist for faculty, we hope to empower faculty to articulate for themselves what their level of mentorship involvement will be.
      </p>

      <p>
        On this platform, faculty may personalize their profiles, including sharing a preferred cadence for meeting with students, indicating topics that they are willing to discuss, and showing or hiding their profiles based on their availability. Students may search for mentors using both clinical and non-clinical “tags,” as well as view available faculty profiles. In each profile, students will see additional opportunities that each faculty offers and other preferences that faculty members have chosen for themselves.
      </p>

      <p>
        We hope that this mentorship platform provides an opt-in, customized mentoring structure with clear, adjustable expectations for both mentors and mentees that may encourage more longitudinal and meaningful mentoring experiences.
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

