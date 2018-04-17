import React from 'react';
import { Link } from 'react-router-dom'
const welcomeMessage = `Thank you for agreeing to be a faculty mentor for the upcoming academic year. To help facilitate a positive longitudinal relationship between faculty and students and mutual development throughout the year, we have included a list of expectations, below. Please take a moment to read through these.`

const adaptedFromLink = 'http://www.marquette.edu/fmp/documents/GuidelinesforMentors.pdf'

export default () => (
  <div>
    <p>{welcomeMessage}</p>
    <h1>Expectations of Faculty</h1>
    <ul>
      <li>Maintain regular and frequent contacts with your mentee, a suggestion of 2-3 contacts per semester (about once a month). At least one of these should be a face-to-face exchange.</li>
      <li>Introduce and expose your mentee to your interests/ career activities and how they have developed or been discovered through time. </li>
      <li>Avoid making judgments or issuing evaluative statements. Mentors are NOT expected to evaluate a mentee’s work; rather, a mentor helps a mentee find resources to receive objective evaluations and feedback on performance.</li>
      <li>Be explicit that you are only sharing suggestions, observations, or personal experiences that should be weighed along with the advice and ideas received from other contacts or mentors.</li>
      <li>Keep the content of discussions within the mentoring relationship confidential. All your exchanges with your mentee--both personal and professional--are subject to the expectations of professional confidentiality.</li>
      <li>Do not be afraid to end the relationship if either you or your mentee are unable to keep the terms of the contract. Remember, the “no fault” separation policy. Review your mentoring relationship goals and expectations on an annual basis.</li>
    </ul>
    <p>Adapted from <Link to={adaptedFromLink}>{adaptedFromLink}</Link></p>
    <Link to="/edit-profile">I accept</Link>
  </div>
)
