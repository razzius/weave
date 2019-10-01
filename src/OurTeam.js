import React from 'react'
import AppScreen from './AppScreen'
import { LiteralLink } from './utils'

const emailLink = (
  <a href="mailto:weave@hms.harvard.edu">weave@hms.harvard.edu</a>
)

const OurTeam = () => (
  <AppScreen className="resources">
    <h2>About Our Team</h2>
    <p>
      In 2017, Weave was co-founded by Jie Jane Chen (Harvard MD Class of 2020)
      and Jonathan Kusner (Harvard MD Class of 2021), and built by Razzi Abuissa
      (software engineer). Jane, Jon, and Razzi are actively developing Weave to
      expand its offerings to students, residents, and faculty. Dr. Jennifer
      Potter (Advisory Dean for the William Bosworth Castle Society) and Dr.
      Fidencio Saldaña (Dean for Students) are advisors for this mentorship
      initiative, which is endorsed by the Office of Student Affairs at Harvard
      Medical School. In recognition of fostering innovation and sustainability 
      in mentoring while building a culture of excellence in mentoring, Weave was 
      awarded the 2019 Program Award for a Culture of Excellence in Mentoring (PACEM)
      at Harvard Medical School:{' '}
      <LiteralLink href="https://mfdp.med.harvard.edu/awards/program-award-culture-excellence-mentoring" />.
    </p>

    <h2>How Was Weave Developed?</h2>
    <p>
      Weave was created with input from both students and faculty, all seeking
      more invested mentoring relationships at Harvard Medical School. In
      working towards this goal, Weave allows students to search for mentors in
      dimensions that are not strictly academic or scholastic. Does a faculty
      member like to cook, play guitar, were they also a first generation
      student, or do they share the same faith as you? In addition to allowing
      students and faculty to connect in this way, Weave allows faculty to
      clearly communicate their capacity for mentorship at a given point in
      time; faculty may indicate their preferred meeting cadence, method of
      contact, and any additional opportunities offered so that students can
      enter with realistic expectations for each relationship. To read more
      about the motivation and process for creating Weave, please visit:{' '}
      <LiteralLink href="https://hwpi.harvard.edu/jhsma/learners-review" />,{' '}
      <LiteralLink href="https://hms.harvard.edu/news/value-mentorship" />.
    </p>

    <h2>Does Weave Stand For Something?</h2>
    <p>
      We named our mentorship platform {'Weave'} to symbolize the woven
      tightness of a tapestry, where each thread is important to contributing to
      the beautiful image when they all come together. Similarly, community is
      enriched through the diversity of identities and experiences of
      individuals. We aspire to illuminate, celebrate, and nourish both personal
      and professional identities and interests through this platform.
    </p>

    <h2>How Do I Contact The Weave Team?</h2>
    <p>Please contact us at {emailLink}.</p>
  </AppScreen>
)

export default OurTeam
