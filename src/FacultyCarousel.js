import React from "react";
import { Link } from 'react-router-dom'
import Slider from "react-slick";
import AppScreen from './AppScreen'

const NextButton = (props) => (
  <a onClick={props.onClick}
          className='button'>
    Next
  </a>
)
export default class FacultyExpectationsSlider extends React.Component {
  next = () => {
    this.slider.slickNext()
  }

  render() {
    var settings = {
      dots: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
      <AppScreen>
        <Slider ref={c => this.slider = c } {...settings}>
          <div>
            <img src="//placehold.it/200" style={{margin: '0 auto'}}
                 onClick={this.next}
                 />
            <h2 style={{textAlign: 'center'}}>Stay in touch</h2>
            <div>Maintain regular and frequent contacts with your mentee, a suggestion of 2-3 contacts per semester (about once a month). At least one of these should be a face-to-face exchange.</div>
          </div>
        <div>
          <div style={{height: '200px'}}>Introduce and expose your mentee to your interests/ career activities and how they have developed or been discovered through time.</div>
        </div>
        <div>Avoid making judgments or issuing evaluative statements. Mentors are NOT expected to evaluate a mentee’s work; rather, a mentor helps a mentee find resources to receive objective evaluations and feedback on performance.</div>
        <div>Be explicit that you are only sharing suggestions, observations, or personal experiences that should be weighed along with the advice and ideas received from other contacts or mentors.</div>
        <div>Keep the content of discussions within the mentoring relationship confidential. All your exchanges with your mentee--both personal and professional--are subject to the expectations of professional confidentiality.</div>
        <div>
          Do not be afraid to end the relationship if either you or your mentee are unable to keep the terms of the contract. Remember, the “no fault” separation policy. Review your mentoring relationship goals and expectations on an annual basis.
          <Link to="/edit-profile">I accept</Link>
        </div>
        </Slider>
        <NextButton onClick={this.next}/>
      </AppScreen>
    );
  }
}
