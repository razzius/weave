import React from "react"
import Slider from "react-slick"
import { Link } from "react-router-dom"

import NextButton from "./NextButton"

export default class StudentExpectationsSlider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      nextText: "Next",
      nextHref: null,
      lastSlide: false
    }
  }

  next = () => {
    if (!this.state.lastSlide) {
      this.slider.slickNext()
    }
  }

  render() {
    const settings = {
      dots: true,
      speed: 500,
      beforeChange: (_, nextIndex) => {
        const lastSlide = nextIndex === this.slider.props.children.length - 1
        this.setState({
          nextText: lastSlide ? "I agree" : "Next",
          nextHref: lastSlide ? "/register-student-email" : null,
          lastSlide
        })
      }
    }

    return (
      <div>
        <Slider ref={c => {this.slider = c}} {...settings}>
          <div className="expectation">
            <h2 style={{ textAlign: "center" }}>Get in touch</h2>
            <div>
              Early after reaching out to a mentor, work with your mentor to define the
              relationship. These terms do not have to be final but each member should have
              some sense of expectations about what the relationship will constitute in the
              dimensions of frequency meeting, method of correspondence, and content of what
              each party is hoping to invest and receive from the relationship. Let HMS Weave
              serve as a catalyst for this discussion.
            </div>
          </div>
          <div className="expectation">
            <h2 style={{ textAlign: "center" }}>Stay in touch</h2>
            <div>
              Maintain regular contact and timely communication with your mentor. Set realistic goals for
              the relationship and how often to meet. Do your best to stick to
              them and communicate when things come up. We recommend at least
              one face-to-face exchange.
            </div>
          </div>
          <div className="expectation">
            <h2 style={{ textAlign: "center" }}>Share yourself</h2>
            <div>
              Mentees are encouraged to share their career plans/ specialty
              interests with their mentor, express needs for professional
              development, ask for advice, and reflect on the mentor’s
              observations.
            </div>
          </div>
          <div className="expectation">
            <h2 style={{ textAlign: "center" }}>Avoid seeking evaluation</h2>
            <div>
              Mentors are not expected to evaluate a mentee’s work; rather, a
              mentor helps a mentee find channels through which the mentee can
              receive objective evaluations and feedback on performance.
            </div>
          </div>
          <div className="expectation">
            <h2 style={{ textAlign: "center" }}>Maintain privacy</h2>
            <div>
              Keep the content of discussions within the mentoring relationship
              confidential. All your exchanges with your mentor--both personal
              and professional--are subject to the expectations of professional
              confidentiality.
            </div>
          </div>
          <div className="expectation">
            <h2 style={{ textAlign: "center" }}>Life happens</h2>
            <div>
              Do not be afraid to end the relationship if either you or your
              mentor are unable to keep your mutually agreed upon expectations.
            </div>
          </div>
          <div className="expectation">
            <h2 style={{ textAlign: "center" }}>Resources</h2>
            <div>
              If ever something occurs in the context of the mentor/mentee relationship that
              makes you uncomfortable or if you are unsure how to respond, please do not
              suffer alone. <a href="/resources" target="_blank">Here</a> are resources that may be helpful starting points in
              addressing problems that you may encounter.
            </div>
          </div>
        </Slider>
        <div style={{ textAlign: "center" }}>
          <NextButton
            href={this.state.nextHref}
            style={{ float: "right" }}
            onClick={this.next}
            text={this.state.nextText}
          />
          {this.state.nextText === "I agree" &&
            <div style={{marginTop: '1em'}}>
              <Link target="_blank" to="/expectations">
                Read more about expectations.
              </Link>
            </div>
          }
        </div>
      </div>
    )
  }
}
