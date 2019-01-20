import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'

import Toggle from 'react-toggle-switch'
import ReactTooltip from 'react-tooltip'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'promise-polyfill/src/polyfill'
import 'react-toggle-switch/dist/css/switch.min.css'

import './App.css'
import NotLoggedIn from './NotLoggedIn'
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
    isAdmin: null,
    profileId: null,
    loading: true,
  }

  async componentDidMount() {
    const { token } = this.state

    if (token !== null && window.location.pathname !== '/verify') {
      try {
        const response = await verifyToken(token)
        this.setState({
          profileId: response.profile_id,
          isMentor: response.is_mentor,
          isAdmin: response.is_admin,
          availableForMentoring: availableForMentoringFromVerifyTokenResponse(
            response
          ),
        })
      } catch (e) {
        clearToken()
        this.setState({ token: null })
      }
      this.setState({ loading: false })
    }
  }

  authenticate = ({
    token,
    profileId,
    isMentor,
    isAdmin,
    availableForMentoring,
  }) =>
    new Promise(resolve => {
      this.setState(
        { token, profileId, isMentor, isAdmin, availableForMentoring },
        () => resolve()
      )
    })

  setProfileId = profileId => {
    this.setState({ profileId })
  }

  logout = e => {
    e.preventDefault()
    clearToken()
    this.setState({ token: null })
    // todo logout on server as well
  }

  setAvailableForMentoring = () => {
    this.setState({ availableForMentoring: true })
  }

  render() {
    const {
      token,
      isMentor,
      isAdmin,
      availableForMentoring,
      profileId,
      loading,
    } = this.state

    const loggedOut = token === null

    const loginButton = (
      <Link
        to="/login"
        className="App-title"
        style={{
          paddingTop: '1.4em',
          float: 'right',
          paddingRight: '2em',
        }}
      >
        Login
      </Link>
    )

    const logoutButton = (
      <a
        href="/"
        onClick={this.logout}
        className="App-title"
        style={{
          paddingTop: '1.4em',
          float: 'right',
          paddingRight: '2em',
          cursor: 'pointer',
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

              {isMentor && (
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
                    on={availableForMentoring}
                    onClick={() => {
                      const newAvailable = !availableForMentoring
                      this.setState({ availableForMentoring: newAvailable })
                      if (profileId !== null) {
                        setAvailabilityForMentoring(token, newAvailable)
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
                <Home token={token} isMentor={isMentor} profileId={profileId} />
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
                  availableForMentoring={availableForMentoring}
                  setAvailableForMentoring={this.setAvailableForMentoring}
                  setProfileId={this.setProfileId}
                  token={token}
                  history={history}
                />
              )}
            />
            <Route
              path="/edit-profile"
              render={({ history }) => {
                if (profileId !== null) {
                  return (
                    <EditProfile
                      availableForMentoring={availableForMentoring}
                      setProfileId={this.setProfileId}
                      token={token}
                      history={history}
                      profileId={profileId}
                    />
                  )
                }

                return loading ? null : <NotLoggedIn />
              }}
            />
            <Route
              path="/admin-edit-profile/:id"
              render={({ history, match }) => {
                if (profileId !== null) {
                  return (
                    <EditProfile
                      token={token}
                      isAdmin={isAdmin}
                      history={history}
                      profileId={match.params.id}
                    />
                  )
                }

                return loading ? null : <NotLoggedIn />
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
                  {...{
                    availableForMentoring,
                    isAdmin,
                    isMentor,
                    loading,
                    profileId,
                    token,
                  }}
                />
              )}
            />
            <Route path="/browse" render={() => <Browse token={token} />} />
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
                  profileId={profileId}
                  token={token}
                  isAdmin={isAdmin}
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
