import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'

import Toggle from 'react-toggle-switch'
import ReactTooltip from 'react-tooltip'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-toggle-switch/dist/css/switch.min.css'

import './App.css'
import Home from './Home'
import Browse from './Browse'
import Login from './Login'
import Expectations from './Expectations'
import Resources from './Resources'
import FacultyExpectations from './FacultyExpectations'
import StudentExpectations from './StudentExpectations'
import EditProfile from './EditProfile'
import CreateProfile from './CreateProfile'
import Profile from './Profile'

import RegisterFacultyEmail from './RegisterFacultyEmail'
import RegisterStudentEmail from './RegisterStudentEmail'
import CheckEmail from './CheckEmail'
import LoginCheckEmail from './LoginCheckEmail'
import VerifyEmail from './VerifyEmail'
import { setAvailabilityForMentoring, verifyToken } from './api'

class App extends Component {
  state = {
    availableForMentoring: null,
    token: window.localStorage.getItem('token'),
    isMentor: null,
    profileId: null
  }

  componentDidMount() {
    if (this.state.token !== null) {
      verifyToken(this.state.token).then(response => {
        this.setState({
          profileId: response.profile_id,
          isMentor: response.is_mentor,
          availableForMentoring: response.available_for_mentoring,
        })
      }).catch(() => {
        window.localStorage.removeItem('token')
        this.setState({ token: null })
      })
    }
  }

  authenticate = ({ token, profileId, isMentor, availableForMentoring }) => (
    new Promise(resolve => {
      this.setState({ token, profileId, isMentor, availableForMentoring }, () => resolve())
    })
  )

  setProfileId = profileId => {
    this.setState({ profileId })
  }

  logout = (e) => {
    e.preventDefault()
    window.localStorage.removeItem('token')
    this.setState({ token: null }, () => {
      window.location.pathname = '/' // wtfff
    })
  }

  render() {
    const loggedOut = this.state.token === null

    const loginButton = (
      <a
        href="/login"
        className="App-title"
        style={{
          paddingTop: '1.4em',
          float: 'right',
          paddingRight: '2em'
        }}
      >
        Login
      </a>
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
        >Logout</a>
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
              <a href="/#about" className="App-title">
                About
              </a>

              <a href="/expectations" className="App-title">
                Expectations
              </a>

              <a href="/resources" className="App-title">
                Resources
              </a>

              {loginAction}

              {this.state.isMentor && (
                <span
                  data-tip="Controls whether your profile will be visible to mentees."
                  className="App-title available-for-mentoring"
                >
                  Available for mentoring:
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
                  <ReactTooltip place="bottom" />
                </span>
              )}
            </div>
          </header>
          <Switch>
            <Route exact path="/" render={() => <Home token={this.state.token} isMentor={this.state.isMentor}/>} />
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
                  return <EditProfile
                    availableForMentoring={this.state.availableForMentoring}
                    setProfileId={this.setProfileId}
                    token={this.state.token}
                    history={history}
                    profileId={this.state.profileId}
                  />
                }

                return null
              }}
            />
            <Route
              path="/register-faculty-email"
              render={({ history }) => <RegisterFacultyEmail history={history} />}
            />
            <Route
              path="/register-student-email"
              render={({ history }) => <RegisterStudentEmail history={history} />}
            />
            <Route path="/check-email" component={CheckEmail} />
            <Route path="/login-check-email" component={LoginCheckEmail} />
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
            <Route path="/resources" component={Resources} />

            <Route
              path="/profiles/:id"
              render={props => <Profile profileId={this.state.profileId} token={this.state.token} {...props} />}
            />
            <Route component={() => <p>404 Not found</p>} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
