import React from "react"
import Slider from "react-slick"
import NextButton from "./NextButton"

export default class FacultyExpectationsSlider extends React.Component {
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
      speed: 0,
      slidesToScroll: 1,
      beforeChange: (_, nextIndex) => {
        const lastSlide = nextIndex === this.slider.props.children.length - 1
        this.setState({
          nextText: lastSlide ? "I agree" : "Next",
          nextHref: lastSlide ? "/edit-profile" : null,
          lastSlide
        })
      }
    }

    return (
      <div>
        <Slider ref={c => (this.slider = c)} {...settings}>
          <div className="expectation">
            <h2 style={{ textAlign: "center" }}>Stay in touch</h2>
            <div>
              Maintain regular contact with your mentee(s). Set realistic goals
              for the relationship and how often to meet. Do your best to stick
              to them and communicate when things come up.
            </div>
          </div>
          <div className="expectation">
            <h2 style={{ textAlign: "center" }}>Share yourself</h2>
            <div>
              Introduce your mentee(s) to your interests and career activities.
              How did you develop your interests? What should mentee(s) look for
              when discovering their own?
            </div>
          </div>
          <div className="expectation">
            <h2 style={{ textAlign: "center" }}>
              Avoid making judgments or issuing evaluative statements
            </h2>
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
              confidential. All your exchanges with your mentee--both personal
              and professional--are subject to the expectations of professional
              confidentiality.
            </div>
          </div>
          <div className="expectation">
            <h2 style={{ textAlign: "center" }}>Life happens</h2>
            <div>
              Do not be afraid to end the relationship if either you or your
              mentee are unable to keep the terms of the contract. Remember, the
              “no fault” separation policy. Review your mentoring relationship
              goals and expectations on an annual basis.
            </div>
          </div>
        </Slider>
        <NextButton
          href={this.state.nextHref}
          style={{ float: "right" }}
          onClick={this.next}
          text={this.state.nextText}
        />
      </div>
    )
  }
}
