import React from 'react';
import { Link } from 'react-router-dom'
const welcomeMessage = `Please take a moment to read the following expectations for mentees.`

export default () => (
  <div>
    <p>{welcomeMessage}</p>
    <h1>Expectations of Mentees</h1>
    <ul>
      <li>Maintain regular and frequent contacts with your mentor. When and how is up to you and your mentor to decide, but please be up front about your expectations and goals for the mentorship relationship. Ex: 2-3 contacts per semester (about once a month), at least one in-person conversation, whether you are interested in long-term research or shadowing opportunities or hoping for more career or personal guidance.</li>
<li>Take initiative in the mentorship relationship. Meet with your mentor and be proactive in seeking out advice and open to what your mentor can share.</li>
<li>Feel free to seek out multiple mentors. However, as many faculty who have kindly volunteered to be mentors are interested in longitudinal relationships with students, please plan to follow-up with each mentor throughout the year.</li>
<li>Mentees are encouraged to share their career plans/ specialty interests with the mentor, recount their initiatives for professional development, ask for advice, and reflect on the mentor’s observations.</li>
<li>Refrain from asking mentors for evaluative advice; rather, take advantage of the mentor’s suggestions about resources for feedback and objective evaluation.</li>
<li>Follow through on commitments and allocate time and energy for the mentoring relationship and opportunities.</li>
<li>Respect the privacy and time commitments of your mentor. </li>
<li>Keep the content of discussions within the mentoring relationship confidential. All your exchanges with your mentor--both personal and professional--are subject to the expectations of professional confidentiality. Although this confidentiality is legally limited, neither of you should discuss the contents of your discussions with anyone else without the written permission of the other.</li>
<li>Don’t be afraid to end the relationship if either you or your mentor are unable to keep the terms of the contract. Remember, the “no fault” separation policy. </li>
<li>Review your mentoring relationship goals and expectations on an annual basis. Most mentoring relationships end naturally when the relationship is no longer beneficial for both parties. </li>
    </ul>
    <Link to="/browse">I accept</Link>
  </div>
)
