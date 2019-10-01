import React from 'react'
import AppScreen from './AppScreen'

const emailLink = (
  <a href="mailto:weave@hms.harvard.edu">weave@hms.harvard.edu</a>
)

const Help = () => (
  <AppScreen className="resources">
    <h1>Frequently Asked Questions</h1>
    <h2>General FAQ</h2>
    <h3>How does the email authentication work?</h3>
    <p>
      For your security and to protect your account information, we have
      generated email-authenticated tokens that expire after either 1 hour or 2
      weeks if you indicate that this is a personal device and you wish to stay
      logged in. After you enter your Harvard or hospital-affiliated email
      address to login, please visit your email account and click on the
      provided token to verify access. If you visit the website after your token
      has expired, you will have to authenticate again.
    </p>

    <p>
      While you may enter a non-Harvard or hospital email address as your
      preferred email address for communication with students, login requires a
      primary Harvard or hospital-affiliated email address, such as:
      @hms.harvard.edu, @hsdm.harvard.edu, @post.harvard.edu, @tch.harvard.edu,
      @gse.harvard.edu, @bidmc.harvard.edu, @bwh.harvard.edu, @mgh.harvard.edu,
      @childrens.harvard.edu, @dfci.harvard.edu, @mah.harvard.edu,
      @meei.harvard.edu, @joslin.harvard.edu, @partners.org, @hphc.org, @va.gov,
      @atriushealth.org, @challiance.org, or @forsyth.org.
    </p>

    <h3>
      I have received an error message that I am unable to register for an
      account. Why is that?
    </h3>
    <p>
      Login is restricted to a Harvard or hospital-affiliated account. Please
      try logging in with an email address that ends in one of the options
      above.
    </p>

    <h3>
      I am having technical difficulties making a faculty profile on Weave.
      Which web browsers are supported with Weave?
    </h3>
    <p>
      Weave is compatible with Chrome, Safari, Edge, Mozilla Firefox, and Internet
      Explorer 10. We recommend using Chrome, Safari, Edge, or Mozilla Firefox web
      browsers, to create or view profiles with the optimized interface
      experience.
    </p>

    <h3>
      I have a question that was not answered here. How do I contact the Weave
      team?
    </h3>
    <p>Please contact us at {emailLink}.</p>

    <h2>Student FAQ</h2>
    <h3>How do I view all faculty profiles?</h3>
    <p>
      Once you log in, you will be redirected to the home page. There, you have
      the option to “Browse profiles,” which will bring you to a searchable list
      of all faculty profiles.
    </p>

    <p>
      The search feature at the top of the page allows for searching based on
      tags as well as free text, such as faculty names and additional
      information that faculty have shared about themselves. The synopsis of
      profiles shares a snapshot of faculty names, institutions, clinical
      interests, preferred meeting cadence (i.e. Biweekly, monthly, etc.), as
      well as additional opportunities displayed as checkboxes.
    </p>

    <h3>How often do faculty profiles update?</h3>
    <p>
      Weave was designed to be a sustainable platform in which faculty may
      update their information in real time as they develop new interests or
      become available for mentoring in additional ways. New faculty may join
      Weave at any point. Faculty with many mentees or who are on sabbatical and
      no longer available for mentoring for a certain period of time may hide
      their profiles from the search and “Browse profiles” view. Likewise,
      faculty who were previously unavailable may become available as their
      scheduling commitments allow. We recommend returning to Weave periodically
      for updates.
    </p>

    <h2>Faculty FAQ</h2>
    <h3>How do I sign up as a faculty mentor?</h3>
    <p>
      To begin the sign up process, navigate to the home page and click on
      “Register as a mentor.” After clicking through the Expectations carousel,
      you will be asked to enter your Harvard or hospital-affiliated email
      address. Click on “Send Verification Email” and check your email address
      for an email from admin@hmsweave.com. The email will provide a link
      through which you may authenticate your account. Once your account is
      authenticated, you will be able to create your mentor profile, and
      customize the tags and information that you would like to share with
      students.
    </p>

    <h3>How do I create my own tags?</h3>
    <p>
      We recognize that our default lists will not allow every faculty member to
      describe themselves fully. In order to do so, you may create your own tags
      in the following sections: “Clinical Interests,” “Professional Interests,”
      “Parts of Me,” and “Activities I Enjoy.” These tags will appear on your
      profile and are searchable by students. To create your own tag, simply
      begin typing in the section that you want your tag to appear under (for
      example, “Parts of Me”) and the words “Create option” will appear. Here is
      an example of the self-generated tag “Scuba diving”:
    </p>

    <img
      src="/assets/activities_scuba_example.png"
      width="500px"
      alt="Adding a new property Scuba Diving in Parts of Me"
    />

    <p>
      After typing your tag, press enter on your keyboard or click the drop down
      menu showing your tag on your screen. The tag will be generated and will
      appear as an addition to your profile. Please use this option to describe
      yourself more completely and authentically than any of our default tags
      can.
    </p>

    <p>
      Once you have created your profile, click on “Preview profile” to view how
      your profile will appear to students. You will have an opportunity to
      further edit your profile from here, or to publish your profile.
    </p>

    <p>
      Once your profile is published, you are all set! You may navigate to the
      home page to view your profile or to browse the profiles of other faculty
      mentors.
    </p>

    <h3>
      How do I return to my mentor profile once I have already made an account?
    </h3>
    <p>
      This will require logging in which can be done in the following two ways:
    </p>

    <h4>Option 1:</h4>

    <p>
      Click the “login” button in the upper right hand corner of the home page
      and follow the instructions to input your Harvard or hospital-affiliated
      email address to login.
    </p>

    <h4>Option 2:</h4>

    <p>
      Select “Register as a mentor” from the home page. This will direct you to
      the Expectations carousel that you can read and advance through. Upon
      clicking “I agree” at the end of the carousel, you will be asked to login
      with the “harvard.edu” or “partners.org” email address that you used to
      register. If the email that you provide is already in our system, clicking
      “Send verification email” will generate a message that says “That email
      has already been registered. Please log in.” You may then enter your email
      address to receive an email verification code, and click on the link sent
      to your inbox to return to the full logged in view. Once you are logged
      in, you will be prompted to “Continue to home.” From the homepage, you may
      click “view profile” to return to your mentor profile.
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
      In the top bar of the faculty view, there is an “Available for mentoring”
      toggle. When this toggle is blue, your profile will be available for
      viewing by mentees. You may turn this toggle off by clicking on it; it
      will appear as gray when toggled off. When “Available for mentoring” is
      toggled off, your profile will be saved but will not be viewable or
      searchable by mentees. Please feel empowered to use this toggle to best
      allocate your attention and energies between mentoring and your other
      clinical and non-clinical interests.
    </p>
  </AppScreen>
)

export default Help
