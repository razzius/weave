import React from 'react'
import { Link } from 'react-router-dom'

function getFacultyLink(token, profileId) {
  if (token === null) return '/faculty-expectations'
  if (profileId === null) return '/create-profile'
  return `/profiles/${profileId}`
}

function getFacultyText(token, profileId) {
  if (token === null) return 'Register as a mentor'
  if (profileId === null) return 'Create profile'
  return 'View profile'
}

const FacultyLanding = ({ profileId, token, isMentor }) => {
  if (token && !isMentor) {
    return null
  }

  return (
    <div>
      <h1>Faculty</h1>
      <Link className="button" to={getFacultyLink(token, profileId)}>
        {getFacultyText(token, profileId)}
      </Link>
    </div>
  )
}

const Home = ({ token, isMentor, profileId }) => (
  <div className="Home">
    <main id="background">
      <div className="App-intro">
        {isMentor !== true && (
          <div>
            <h1>Students</h1>
            <Link
              className="button"
              to={token ? '/browse' : '/student-expectations'}
            >
              Find a mentor
            </Link>
          </div>
        )}
        <FacultyLanding
          token={token}
          isMentor={isMentor}
          profileId={profileId}
        />
        {isMentor && (
          <div>
            <Link className="button" to="/browse">
              Browse profiles
            </Link>
          </div>
        )}
      </div>
    </main>
    <section id="about" style={{ paddingBottom: '5em' }}>
      <h1>About</h1>
      <p>
        Soon after entering medical school, students are faced with a new
        learning and social environment and pressure to quickly determine
        academic or clinical interests. Although resources for faculty contact
        information exist, both students and faculty have found there to be
        unclear expectations about what a mentorship relationship or experience
        will constitute. Furthermore, for students with myriad interests who are
        still in the process of discovering their desired field of medicine, it
        is often challenging to know who to reach out to when lists of faculty
        members are provided solely based on clinical specialty.
      </p>

      <p>
        We developed a mentorship platform that provides an interest-driven way
        for students to find invested mentors for professional or personal
        guidance. In recognizing that students can only set expectations for
        their side of the mentoring relationship, our platform will allow
        faculty to more clearly communicate their own level of comfort in
        engaging in a mentoring relationship. In recognizing that many clinical,
        academic, and personal demands exist for faculty, we hope to empower
        faculty to articulate for themselves what their level of mentorship
        involvement will be.
      </p>

      <p>
        On this platform, faculty may personalize their profiles, including
        sharing a preferred cadence for meeting with students, indicating topics
        that they are willing to discuss, and showing or hiding their profiles
        based on their availability. Students may search for mentors using both
        clinical and non-clinical “tags,” as well as view available faculty
        profiles. In each profile, students will see additional opportunities
        that each faculty offers and other preferences that faculty members have
        chosen for themselves.
      </p>

      <p>
        We hope that this mentorship platform provides an opt-in, customized
        mentoring structure with clear, adjustable expectations for both mentors
        and mentees that may encourage more longitudinal and meaningful
        mentoring experiences.
      </p>
    </section>
  </div>
)

export default Home
