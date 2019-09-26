import React from 'react'
import Slider from 'react-slick'
import { Link } from 'react-router-dom'

import Button from './Button'

export default class FacultyExpectationsSlider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      nextText: 'Next',
      nextHref: null,
      lastSlide: false,
    }
  }

  next = () => {
    const { lastSlide } = this.state
    if (!lastSlide) {
      this.slider.slickNext()
    }
  }

  render() {
    const { nextText, nextHref } = this.state

    return (
      <div>
        <Slider
          ref={c => {
            this.slider = c
          }}
          dots
          speed={500}
          slidesToScroll={1}
          beforeChange={(_, nextIndex) => {
            const lastSlide =
              nextIndex === this.slider.props.children.length - 1
            this.setState({
              nextText: lastSlide ? 'I agree' : 'Next',
              nextHref: lastSlide ? '/register-faculty-email' : null,
              lastSlide,
            })
          }}
        >
          <div className="expectation">
            <h2 style={{ textAlign: 'center' }}>Get in touch</h2>
            <div>
              When students contact you, work with your mentees to define the
              relationship early in your correspondences. These terms do not
              have to be final but each member should have some sense of
              expectations about what the relationship will constitute in the
              dimensions of frequency meeting, method of correspondence, and
              content of what each party is hoping to invest and receive from
              the relationship. Let Weave serve as a catalyst for this
              discussion.
            </div>
          </div>
          <div className="expectation">
            <h2 style={{ textAlign: 'center' }}>Stay in touch</h2>
            <div>
              Maintain regular contact and timely communication with your
              mentee(s). Set realistic goals for the relationship and how often
              to meet. Do your best to stick to them and communicate when things
              come up.
            </div>
          </div>
          <div className="expectation">
            <h2 style={{ textAlign: 'center' }}>Share yourself</h2>
            <div>
              Introduce your mentee(s) to your interests and career activities.
              How did you develop your interests? What should mentee(s) look for
              when discovering their own?
            </div>
          </div>
          <div className="expectation">
            <h2 style={{ textAlign: 'center' }}>
              Avoid making judgments or issuing evaluative statements
            </h2>
            <div>
              Mentors are not expected to evaluate a mentee’s work; rather, a
              mentor helps a mentee find channels through which the mentee can
              receive objective evaluations and feedback on performance.
            </div>
          </div>
          <div className="expectation">
            <h2 style={{ textAlign: 'center' }}>Maintain privacy</h2>
            <div>
              Keep the content of discussions within the mentoring relationship
              confidential. All your exchanges with your mentee--both personal
              and professional--are subject to the expectations of professional
              confidentiality.
            </div>
          </div>
          <div className="expectation">
            <h2 style={{ textAlign: 'center' }}>Life happens</h2>
            <div>
              Do not be afraid to end the relationship if either you or your
              mentee are unable to keep the terms of the contract. Remember, the
              “no fault” separation policy. Review your mentoring relationship
              goals and expectations on an annual basis.
            </div>
          </div>
          <div className="expectation">
            <h2 style={{ textAlign: 'center' }}>Resources</h2>
            <div>
              If ever something occurs in the context of the mentor/mentee
              relationship that makes you uncomfortable or if you are unsure how
              to respond, please do not suffer alone.{' '}
              <Link to="/resources" target="_blank">
                Here
              </Link>{' '}
              are resources that may be helpful starting points in addressing
              problems that you may encounter.
            </div>
          </div>
        </Slider>
        <div style={{ textAlign: 'center' }}>
          <Button to={nextHref} style={{ float: 'right' }} onClick={this.next}>
            {nextText}
          </Button>
          {nextText === 'I agree' && (
            <div style={{ marginTop: '1em' }}>
              <Link target="_blank" to="/mentor-expectations">
                Read more about expectations.
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }
}
