import React from 'react'
import AppScreen from './AppScreen'
import { LiteralLink } from './utils'

const About = () => (
  <AppScreen className="resources">
    <h2>About Weave</h2>
    <p>
      Soon after entering medical school and dental school, students encounter
      new learning and social environments and pressure to quickly determine
      academic or clinical interests. While resources for faculty contact
      information exist, both students and faculty have found there to be
      unclear expectations about what a mentorship relationship or experience
      will constitute. Furthermore, for students with myriad interests who are
      still in the process of discovering their desired field of medicine or
      dentistry, it is often challenging to know who to reach out to when lists
      of faculty members are provided solely based on clinical specialty.
    </p>

    <p>
      We developed a mentorship platform that provides an interest-driven way
      for students to find invested mentors for professional or personal
      guidance. In recognizing that students may only set expectations for their
      side of the mentoring relationship, our platform allows faculty to
      communicate more clearly their own level of comfort in engaging in a
      mentoring relationship. In recognizing that many clinical, academic, and
      personal demands exist for faculty, we hope to empower faculty to
      articulate what their desired level of mentorship involvement will be.
    </p>

    <p>
      On this platform, faculty may personalize their profiles, including
      sharing a preferred cadence for meeting with students, indicating topics
      that they are willing to discuss, and showing or hiding their profiles
      based on their availability. Students may search for mentors using both
      clinical and non-clinical “tags,” as well as view available faculty
      profiles. In each profile, students will see additional opportunities that
      each faculty offers and other preferences that faculty members have chosen
      for themselves.
    </p>

    <p>
      We hope that this mentorship platform provides an opt-in, customized
      mentoring structure with clear, adjustable expectations for both mentors
      and mentees that may encourage more longitudinal and meaningful mentoring
      experiences.
    </p>

    <h2>About Our Team</h2>
    <p>
      In 2017, Weave was co-founded and designed by Jie Jane Chen (Harvard MD
      Class of 2020) and Jonathan Kusner (Harvard MD Class of 2021). The website
      was built by Razzi Abuissa (software engineer). Jane, Jon, and Razzi are
      actively developing Weave to expand its offerings to students, residents,
      and faculty.
    </p>
    <p>
      Dr. Jennifer Potter (Advisory Dean for the William Bosworth Castle
      Society) and Dr. Fidencio Saldaña (Dean for Students) are advisors for
      this mentorship initiative, which is endorsed by the Office of Student
      Affairs at Harvard Medical School.
    </p>

    <h2>How Was Weave Developed?</h2>
    <p>
      A student-driven initiative since its conception, Weave incorporates both
      student and faculty perspectives and was created to facilitate invested
      mentoring relationships and to foster diversity and inclusion at Harvard
      Medical School. In working towards these goals, Weave allows students to
      search for mentors in dimensions that are not strictly academic or
      scholastic. Does a faculty member like to cook, are they from the west
      coast, were they also a first generation student, or do they share the
      same faith as you? In addition to empowering students and faculty to
      connect in this way, Weave allows faculty to clearly communicate their
      capacity for mentorship at a given point in time; faculty may indicate
      their preferred meeting cadence, method of contact, and any additional
      opportunities offered so that students can enter with realistic
      expectations for each relationship.
    </p>

    <h2>Does Weave Stand For Something?</h2>
    <p>
      We named our mentorship platform &apos;Weave&apos; to symbolize the woven
      tightness of a tapestry, where each thread is important to contributing to
      the beautiful image when they all come together. Similarly, community is
      enriched through the diversity of identities and experiences of
      individuals. We aspire to illuminate, celebrate, and nourish both personal
      and professional identities and interests through this platform.
    </p>

    <h2>Where Can I Learn More About Weave?</h2>
    <iframe
      className="video"
      src="https://www.youtube.com/embed/fFuAOtyzVYY?modestbranding=1&rel=0"
      title="Video about Weave"
      allow="encrypted-media"
      allowFullScreen
    />

    <p>
      To read more about our motivation and process for creating Weave, please
      visit:{' '}
      <LiteralLink href="https://hwpi.harvard.edu/jhsma/learners-review" /> and{' '}
      <LiteralLink href="https://hms.harvard.edu/news/value-mentorship" />.
    </p>
    <p>
      In recognition of fostering innovation and sustainability in mentoring
      while building a culture of excellence in mentoring, Weave was awarded the 
      2019 Dean's Innovation Award in Diversity and Inclusion and the
      2019 Program Award for a Culture of Excellence in Mentoring (PACEM) by the
      Office for Diversity Inclusion & Community Partnership at Harvard Medical
      School:{' '}
      <LiteralLink href="https://mfdp.med.harvard.edu/awards/program-award-culture-excellence-mentoring" />
      .
    </p>

    <h2>How Do I Contact The Weave Team?</h2>
    <p>
      If you are passionate about improving mentoring at Harvard Medical School,
      Harvard School of Dental Medicine, or at similar institutions, we would
      love to hear from you! Please reach out to us at:{' '}
      <a href="mailto:weave@hms.harvard.edu">weave@hms.harvard.edu</a>.
    </p>
  </AppScreen>
)

export default About
