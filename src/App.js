import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'

import Toggle from 'react-toggle-switch'
import ReactTooltip from 'react-tooltip'

import 'slick-carousel/slick/slick-theme.css'
import 'react-toggle-switch/dist/css/switch.min.css'

import './App.css'
import Home from './Home'
import Browse from './Browse'
import Login from './Login'
import Help from './Help'
import Expectations from './Expectations'
import MentorExpectations from './MentorExpectations'
import MenteeExpectations from './MenteeExpectations'
import Resources from './Resources'
import FacultyExpectations from './FacultyExpectations'
import StudentExpectations from './StudentExpectations'
import EditProfile from './EditProfile'
import CreateProfile from './CreateProfile'
import Profile from './Profile'
import { availableForMentoringFromVerifyTokenResponse } from './utils'

import RegisterFacultyEmail from './RegisterFacultyEmail'
import RegisterStudentEmail from './RegisterStudentEmail'
import VerifyEmail from './VerifyEmail'
import { setAvailabilityForMentoring, verifyToken } from './api'
import { clearToken, loadToken } from './persistence'

class App extends Component {
  state = {
    availableForMentoring: null,
    token: loadToken(),
    isMentor: null,
    profileId: null
  }

  componentDidMount() {
    if (this.state.token !== null) {
      verifyToken(this.state.token)
        .then(response => {
          this.setState({
            profileId: response.profile_id,
            isMentor: response.is_mentor,
            availableForMentoring: availableForMentoringFromVerifyTokenResponse(
              response
            )
          })
        })
        .catch(() => {
          clearToken()
          this.setState({ token: null })
        })
    }
  }

  authenticate = ({ token, profileId, isMentor, availableForMentoring }) =>
    new Promise(resolve => {
      this.setState({ token, profileId, isMentor, availableForMentoring }, () =>
        resolve()
      )
    })

  setProfileId = profileId => {
    this.setState({ profileId })
  }

  logout = e => {
    e.preventDefault()
    clearToken()
    this.setState({ token: null }, () => {
      window.location.pathname = '/' // wtfff
    })
    // todo logout on server as well
  }

  setAvailableForMentoring = () => {
    this.setState({ availableForMentoring: true })
  }

  render() {
    const loggedOut = this.state.token === null

    const loginButton = (
      <Link
        to="/login"
        className="App-title"
        style={{
          paddingTop: '1.4em',
          float: 'right',
          paddingRight: '2em'
        }}
      >
        Login
      </Link>
    )

    const logoutButton = (
      <a
        onClick={this.logout}
        className="App-title"
        style={{
          paddingTop: '1.4em',
          float: 'right',
          paddingRight: '2em',
          cursor: 'pointer'
        }}
      >
        Logout
      </a>
    )

    const loginAction = loggedOut ? loginButton : logoutButton

    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <div className="header-inner">
              <Link to="/" className="App-title left">
                <h1>HMS Weave</h1>
              </Link>

              {loginAction}

              {this.state.isMentor && (
                <div
                  data-tip
                  className="available-for-mentoring"
                  data-for="toggleTooltip"
                  >
                  Available for mentoring:
                  <ReactTooltip id="toggleTooltip" place="bottom">
                    Controls whether your profile will be visible to mentees.
                  </ReactTooltip>
                  <Toggle
                    on={this.state.availableForMentoring}
                    onClick={() => {
                      const available = !this.state.availableForMentoring
                      this.setState({ availableForMentoring: available })
                      if (this.state.profileId !== null) {
                        setAvailabilityForMentoring(this.state.token, available)
                      }
                    }}
                    />
                </div>
              )}

              <nav>
                <a href="/#about-weave" className="App-title">
                  About
                </a>

                <Link to="/expectations" className="App-title">
                  Expectations
                </Link>

                <Link to="/resources" className="App-title">
                  Resources
                </Link>

                <Link to="/help" className="App-title">
                  Help
                </Link>
              </nav>
            </div>
          </header>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <Home
                  token={this.state.token}
                  isMentor={this.state.isMentor}
                  profileId={this.state.profileId}
                />
              )}
            />
            <Route
              path="/faculty-expectations"
              component={FacultyExpectations}
            />
            <Route
              path="/student-expectations"
              component={StudentExpectations}
            />
            <Route
              path="/create-profile"
              render={({ history }) => (
                <CreateProfile
                  availableForMentoring={this.state.availableForMentoring}
                  setAvailableForMentoring={this.setAvailableForMentoring}
                  setProfileId={this.setProfileId}
                  token={this.state.token}
                  history={history}
                />
              )}
            />
            <Route
              path="/edit-profile"
              render={({ history }) => {
                if (this.state.profileId !== null) {
                  return (
                    <EditProfile
                      availableForMentoring={this.state.availableForMentoring}
                      setProfileId={this.setProfileId}
                      token={this.state.token}
                      history={history}
                      profileId={this.state.profileId}
                    />
                  )
                }

                return null
              }}
            />
            <Route
              path="/register-faculty-email"
              render={({ history }) => (
                <RegisterFacultyEmail history={history} />
              )}
            />
            <Route
              path="/register-student-email"
              render={({ history }) => (
                <RegisterStudentEmail history={history} />
              )}
            />
            <Route
              path="/verify"
              render={({ history }) => (
                <VerifyEmail
                  authenticate={this.authenticate}
                  history={history}
                />
              )}
            />
            <Route
              path="/browse"
              render={() => <Browse token={this.state.token} />}
            />
            <Route
              path="/login"
              render={({ history }) => <Login history={history} />}
            />

            <Route path="/expectations" component={Expectations} />
            <Route path="/mentor-expectations" component={MentorExpectations} />
            <Route path="/mentee-expectations" component={MenteeExpectations} />
            <Route path="/resources" component={Resources} />
            <Route path="/help" component={Help} />

            <Route
              path="/profiles/:id"
              render={props => (
                <Profile
                  profileId={this.state.profileId}
                  token={this.state.token}
                  {...props}
                />
              )}
            />
            <Route component={() => <p>404 Not found</p>} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
