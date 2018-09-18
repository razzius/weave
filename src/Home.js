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
    <section id="about">
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

    <section style={{ paddingBottom: '5em' }}>
      <h1>Roadmap</h1>

      <p>
        Weave is an open-source platform aimed to improve the mentorship
        structures at a large, diverse medical school with an expansive clinical
        enterprise. Such institutions are found throughout the United States and
        the world. In the spirit of open-source development, we value
        transparency in our process. The following is a roadmap that presents
        our progress to date and plans for the future in four domains of Weave’s
        development: Functions, Usability, Sustainability, and Look. These
        domains are specific to Weave’s development but we wanted to share them
        as a way to communicate our process, reduce the duplication of efforts,
        and promote interest for the development of mentorship frameworks.
      </p>

      <h2>Functions</h2>
      <p>
        We are planning the development of further functions on the Weave
        platform that will continue to align incentives for and lower barriers
        to forming invested relationship between students and faculty at Harvard
        Medical School. Among these is the creation of a “Faculty Investment”
        interface that will prompt students to report and record the number of
        hours and types of mentorship that their mentors are providing. This
        will allow students the opportunity to give back to their mentors by
        accurately recording the investment of the mentor. For faculty, we hope
        that this information can be used in promotional packages to credibly
        illustrate their service to the students and the institution of Harvard
        Medical School.{' '}
      </p>

      <h2>Usability</h2>
      <p>
        The user interface, accessibility, and intuitive search of Weave is
        critical to its success. We are planning a number of projects to further
        improve the utility of the platform. In addition to the “Faculty
        Investment” function described above, we hope to generalize Weave’s
        faculty-student interface to allow for student peer-to-peer mentoring to
        improve the support and relationships between medical school classes, as
        well as expand the opportunities for students to develop their skills as
        a mentor early in their career.{' '}
      </p>

      <h2>Sustainability</h2>
      <p>
        Weave is a response to informal mentorship lists that are developed
        through the efforts of individual students. These lists are often not
        well maintained and soon become outmoded and unusable. Weave endeavors
        to be a bridging platform that facilitates relationships. It calls users
        to own and update their data. In order to take that bold stance, Weave
        must reliably live up to its end of the bargain and be a well maintained
        and sustainable platform. We are working to better install Weave as a
        program within the Office of Student Affairs at Harvard Medical School,
        where it can be maintained by the institution’s existing Information
        Technology department.{' '}
      </p>

      <h2>Look</h2>
      <p>
        We believe that Weave will benefit from consistent branding, in the
        broadest sense. Part of this effort is to establish this roadmap so that
        we may communicate our goals clearly and be transparent about our
        intentions. Other ways to achieve this is to define a website culture
        through the development of graphics and logos that help to honestly
        display Weave to the world.
      </p>

      <p>
        The following is our progress in each of these four domains demonstrated
        pictorially. If you are passionate about improving mentoring at Harvard
        Medical School or at similar institutions, we would love to hear from
        you! Please reach out to us at:{' '}
        <a href="mailto:weave@hms.harvard.edu">weave@hms.harvard.edu</a>
      </p>

      <h2 style={{ paddingTop: '2em' }}>Progress</h2>
      <img width="700px" src="https://i.imgur.com/hzbnZC5.jpg" />
    </section>
  </div>
)

export default Home
