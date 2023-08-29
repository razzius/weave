import React from 'react'
import { Link } from 'react-router-dom'

import AppScreen from './AppScreen'

function MenteeExpectations() {
  return (
    <AppScreen>
      <h2>Mentee Expectations</h2>
      <h3>Get in touch</h3>
      <p>
        Early after reaching out to a mentor, work with your mentor to define
        the relationship. These terms do not have to be final but each member
        should have some sense of expectations about what the relationship will
        constitute in the dimensions of frequency meeting, method of
        correspondence, and content of what each party is hoping to invest and
        receive from the relationship. Let Weave serve as a catalyst for this
        discussion.
      </p>
      <h3>Stay in touch</h3>
      <p>
        Maintain regular contact with your mentor. Set realistic goals for the
        relationship and how often to meet. Do your best to stick to them and
        communicate when things come up. We recommend at least one face-to-face
        exchange.
      </p>
      <h3>Share yourself</h3>
      <p>
        Mentees are encouraged to share their career plans/specialty interests
        with their mentor, express needs for professional development, ask for
        advice, and reflect on the mentor’s observations.
      </p>
      <h3>Avoid seeking evaluation</h3>
      <p>
        Mentors are not expected to evaluate a mentee’s work; rather, unless
        otherwise solicited, a mentor helps a mentee find channels through which
        the mentee can receive objective evaluations and feedback on
        performance.
      </p>
      <h3>Maintain privacy </h3>
      <p>
        Keep the content of discussions within the mentoring relationship
        confidential. All of your exchanges with your mentor, both personal and
        professional, are subject to the expectations of professional
        confidentiality.
      </p>
      <h3>Life happens</h3>
      <p>
        Do not be afraid to end the relationship if either you or your mentor
        are unable to keep your mutually agreed upon expectations.
      </p>
      <h3>Resources</h3>
      <p>
        If ever something occurs in the context of the mentor/mentee
        relationship that makes you uncomfortable or if you are unsure how to
        respond, please do not suffer alone.{' '}
        <Link to="/resources" target="_blank">
          Here
        </Link>{' '}
        are resources that may be helpful starting points in addressing problems
        that you may encounter.
      </p>
    </AppScreen>
  )
}

export default MenteeExpectations
