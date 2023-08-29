import React from 'react'
import { Link } from 'react-router-dom'

import AppScreen from './AppScreen'

const emailLink = (
  <a href="mailto:weave@hms.harvard.edu">weave@hms.harvard.edu</a>
)

function Help() {
  return (
    <AppScreen className="resources">
      <h1>Frequently Asked Questions</h1>
      <h2>General FAQ</h2>
      <h3>What is Weave?</h3>
      <p>
        Weave is a mentorship platform created to facilitate faculty-student
        mentoring relationships and foster diversity and inclusion at Harvard
        Medical School and Harvard School of Dental Medicine. In working towards
        these goals, Weave allows students to search for mentors in dimensions
        that are not strictly academic. Does a faculty or student mentor like to
        cook, are they from the west coast, do they identify as an immigrant,
        were they also a first generation student, or do they share the same
        faith as you? In addition to empowering students and faculty to connect
        in this way, Weave allows mentors to clearly communicate their capacity
        for mentorship at a given point in time; faculty and student mentors may
        indicate their preferred meeting cadence, method of contact, and any
        additional opportunities offered so that mentees can enter with
        realistic expectations for each relationship. For more information,
        please visit the <Link to="/about">About</Link> page.
      </p>
      <h3>What are different ways that I can use Weave?</h3>
      <ul>
        <li>
          Find <em>individual mentorship on a specific topic</em> (i.e. career
          advising, well-being, networking in a specialty field)
        </li>
        <li>
          <em>
            Connect with faculty and students on the basis of shared identity
          </em>
          , personal interests, or clinical interests (i.e. search for
          &quot;first generation,&quot; &quot;faith,&quot; &quot;music,&quot;
          &quot;running,&quot; etc.)
        </li>
        <li>
          <em>Get to know preclinical or clinical faculty better</em> and learn
          about activities that they enjoy
        </li>
        <li>
          <em>
            Get to know your classmates better and foster community building
          </em>
        </li>
        <li>
          Connect with upperclassmen medical students to ask about{' '}
          <em>advice about classes, rotations, and finding a specialty</em>
        </li>
        <li>
          Use Weave as a{' '}
          <em>centralized launching board for navigating to HMS resources</em>{' '}
          (i.e. Scholars in Medicine Office database for finding research
          mentors, Catalyst Clinical and Translational Research Database for
          finding research mentors, HMS Collaborate page where all of the
          residency advising resources are housed) - Check out the
          &quot;Resources&quot; page on Weave for these links and more
        </li>
        <li>
          <em>Ask faculty to speak at student interest group events</em> (look
          for the check box next to &quot;Student group support&quot;)
        </li>
        <li>
          Find faculty to <em>shadow to explore clinical interests</em>
        </li>
        <li>
          Engage in conversations with{' '}
          <em>
            faculty who have degrees that match what you may be considering
          </em>{' '}
          and ask about their career pathways (i.e. MD, MBA; MD, PhD; MD, MPH,
          etc.)
        </li>
      </ul>
      <h3>How does the email authentication work?</h3>
      <p>
        For your security and to protect your account information, we have
        generated email-authenticated tokens that expire after 1 hour. After you
        enter your Duke or hospital-affiliated email address to login, please
        visit your email account to verify access. If you visit the website more
        than 1 hour after your earlier visit, you will have to authenticate
        again. If you are using a personal device and wish to stay logged in for
        longer, you may check the personal device option to stay logged in for 2
        weeks.{' '}
      </p>
      <p>
        While you may enter a non-Duke or hospital email address as your
        preferred email address for communication with students, login requires
        a primary Duke or hospital-affiliated email address, such as:
        @hms.harvard.edu, @hsdm.harvard.edu, @post.harvard.edu,
        @tch.harvard.edu, @gse.harvard.edu, @bidmc.harvard.edu,
        @bwh.harvard.edu, @mgh.harvard.edu, @childrens.harvard.edu,
        @dfci.harvard.edu, @mah.harvard.edu, @meei.harvard.edu,
        @joslin.harvard.edu, @partners.org, @hphc.org, @va.gov,
        @atriushealth.org, @challiance.org, or @forsyth.org.
      </p>
      <h3>
        I have received an error message that I am unable to register for an
        account. Why is that?
      </h3>
      <p>
        Login is restricted to a Duke or hospital-affiliated account. Please try
        logging in with an email address that ends in one of the options above.
      </p>
      <h3>
        I have a question that was not answered here. How do I contact the Weave
        team?
      </h3>
      <p>Please contact us at {emailLink}.</p>
      <h2>Student FAQ</h2>
      <h3>How do I sign up as a student?</h3>
      <p>
        To begin the sign up process, navigate to the home page and click on
        “Register as a student.” After clicking through the Expectations
        carousel, you will be asked to enter your Duke or hospital-affiliated
        email address. Click on “Send Verification Email” and check your email
        address for an email from admin@hmsweave.com. The email will provide a
        link through which you may authenticate your account. Once your account
        is authenticated, you will be able to view faculty and student mentor
        profiles. Please see below if you wish to create a student mentor
        profile.
      </p>
      <h3>How do I view all faculty mentor profiles?</h3>
      <p>
        Once you log in, you will be redirected to the home page. There, you
        have the option to “View Faculty Mentor Profiles,” which will bring you
        to a searchable list of all faculty profiles. If there are faculty you
        wish to contact or whose profile you wish to make a special note of in
        Weave, you can star the profile for ease of finding later. These stars
        are only visible to you in your personal account and not to Weave
        administrators or faculty and students on Weave.
      </p>
      <p>
        The search feature at the top of the page allows for searching based on
        tags as well as free text, such as faculty names and additional
        information that faculty have shared about themselves. Additionally, you
        may filter by degrees or institutions and sort profiles by starred
        profiles first, most recently updated, alphabetically, or reverse
        alphabetically.
      </p>
      <p>
        The synopsis of profiles shares a snapshot of faculty names,
        institutions, clinical interests, preferred meeting cadence (i.e.
        Biweekly, monthly, etc.), as well as additional opportunities displayed
        as checkboxes.
      </p>
      <h3>How do I view all student mentor profiles?</h3>
      <p>
        From the home page, you have the option to “View Student Mentor
        Profiles,” which will bring you to a searchable list of all student
        profiles. Similar to faculty profiles, you may also star student mentor
        profiles. These stars are only visible to you in your personal account
        and not to Weave administrators or faculty and students on Weave.
      </p>
      <p>
        The search feature at the top of the page allows for searching based on
        tags as well as free text. Additionally, you may filter by institution
        and sort profiles by starred profiles first, most recently updated,
        alphabetically, or reverse alphabetically.
      </p>
      <p>
        The synopsis of profiles shares a snapshot of student names, clinical
        interests, professional interests, preferred meeting cadence (i.e.
        Biweekly, monthly, etc.), as well as additional opportunities displayed
        as checkboxes.
      </p>
      <h3>How often do faculty profiles update?</h3>
      <p>
        Weave was designed to be a sustainable platform in which faculty and
        students may update their information in real time as they develop new
        interests or become available for mentoring in additional ways. New
        faculty and student mentors may join Weave at any point. Faculty with
        many mentees or who are on sabbatical and no longer available for
        mentoring for a certain period of time may hide their profiles from the
        search and “view profiles” page. Likewise, faculty who were previously
        unavailable may become available as their scheduling commitments allow.
        We recommend returning to Weave periodically for updates. You may sort
        profiles by most recently updated, and each profile notes the date when
        the profile was last updated.{' '}
      </p>
      <h3>How do I create a student mentor profile?</h3>

      <p>
        For additional information on creating tags, returning to your already
        created mentor profile, changing your availability for mentoring, or for
        technical difficulties with mentor profile creation, please see the
        relevant sections in the Faculty FAQ below.
      </p>
      <h2>Faculty FAQ</h2>
      <h3>How do I sign up as a faculty mentor?</h3>
      <p>
        To begin the sign up process, navigate to the home page and click on
        “Register as a mentor.” After clicking through the Expectations
        carousel, you will be asked to enter your Duke or hospital-affiliated
        email address. Click on “Send Verification Email” and check your email
        address for an email from admin@hmsweave.com. The email will provide a
        link through which you may authenticate your account. Once your account
        is authenticated, you will be able to create your mentor profile, and
        customize the tags and information that you would like to share with
        students.
      </p>

      <h3 id="how-do-i-create-a-profile">
        How do I create a faculty mentor profile?
      </h3>

      <iframe
        src="https://player.vimeo.com/video/450578457"
        width="640"
        height="360"
        frameBorder="0"
        allow="fullscreen"
        title="Weave Tutorial Video: How To Create A Faculty Mentorship Profile"
        allowFullScreen
      />

      <h3 id="how-do-i-create-my-own-tags">How do I create my own tags?</h3>
      <p>
        We recognize that our default lists will not allow every faculty member
        to describe themselves fully. In order to do so, you may create your own
        tags in the following sections: “Clinical Interests,” “Professional
        Interests,” “Parts of Me,” and “Activities I Enjoy.” These tags will
        appear on your profile and are searchable by students. To create your
        own tag, simply begin typing in the section that you want your tag to
        appear under (for example, “Parts of Me”) and the words “Create option”
        will appear. Here is an example of the self-generated tag “Scuba
        diving”:
      </p>
      <img
        src="/assets/activities_scuba_example.png"
        width="500px"
        alt="Adding a new property Scuba Diving in Parts of Me"
      />
      <p>
        After typing your tag, press enter on your keyboard or click the drop
        down menu showing your tag on your screen. The tag will be generated and
        will appear as an addition to your profile. Please use this option to
        describe yourself more completely and authentically than any of our
        default tags can.
      </p>
      <p>
        Once you have created your profile, click on “Preview profile” to view
        how your profile will appear to students. You will have an opportunity
        to further edit your profile from here, or to publish your profile.
      </p>
      <p>
        Once your profile is published, you are all set! You may navigate to the
        home page to view your profile or to browse the profiles of other
        faculty mentors.
      </p>
      <h3>
        How do I return to my mentor profile once I have already made an
        account?
      </h3>
      <p>
        Click the “Login” button in the upper right hand corner of the home page
        and follow the instructions to input your Duke or hospital-affiliated
        email address to login.
      </p>

      <h3>
        How do I hide or show my availability once I have created a mentor
        profile?
      </h3>
      <img
        src="/assets/available_for_mentoring.png"
        alt="Available for mentoring toggle element"
      />
      <p>
        In the top bar of the faculty view, there is an “Available for
        mentoring” toggle. When this toggle is blue, your profile will be
        available for viewing by mentees. You may turn this toggle off by
        clicking on it; it will appear as gray when toggled off. When “Available
        for mentoring” is toggled off, your profile will be saved but will not
        be viewable or searchable by mentees. Please feel empowered to use this
        toggle to best allocate your attention and energies between mentoring
        and your other clinical and non-clinical interests.
      </p>
      <h3>
        I am having technical difficulties making a mentor profile on Weave.
        Which web browsers are supported with Weave?
      </h3>
      <p>
        Weave is supported on Chrome, Safari, and Mozilla Firefox. At the
        moment, the faculty interface is not supported on Internet Explorer.
        Please create a faculty profile using a computer or mobile device on
        Chrome, Safari, or Mozilla Firefox. Please contact us at {emailLink} if
        you experience technical difficulties using one of the supported web
        browsers.
      </p>
    </AppScreen>
  )
}

export default Help
