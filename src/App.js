import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'

import Toggle from 'react-toggle-switch'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-toggle-switch/dist/css/switch.min.css'
import 'blueimp-canvas-to-blob'

import './App.css'
import BrowseFaculty from './BrowseFaculty'
import CreateProfile from './CreateProfile'
import CreatePeerProfile from './CreatePeerProfile'
import Expectations from './Expectations'
import FacultyExpectations from './FacultyExpectations'
import Help from './Help'
import Home from './Home'
import Login from './Login'
import Logout from './Logout'
import MenteeExpectations from './MenteeExpectations'
import MentorExpectations from './MentorExpectations'
import NotLoggedIn from './NotLoggedIn'
import OwnProfileLink from './OwnProfileLink'
import BrowsePeerMentorship from './BrowsePeerMentorship'
import About from './About'
import FacultyProfile from './FacultyProfile'
import StudentProfile from './StudentProfile'
import EditStudentProfile from './EditStudentProfile'
import EditFacultyProfile from './EditFacultyProfile'
import Resources from './Resources'
import StudentExpectations from './StudentExpectations'
import RegisterFacultyEmail from './RegisterFacultyEmail'
import RegisterStudentEmail from './RegisterStudentEmail'
import VerifyEmail from './VerifyEmail'
import { logout, getAccount, setAvailabilityForMentoring } from './api'

function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <p>404 Not found</p>
    </div>
  )
}

class App extends Component {
  state = {
    account: null,
    loading: true,
    error: false,
  }

  async componentDidMount() {
    if (window.location.pathname !== '/verify') {
      this.loadAccount()
    }
  }

  authenticate = ({ account }) => {
    this.setState({ account })
  }

  loadAccount = async () => {
    const loaded = { loading: false }
    try {
      const account = await getAccount()
      this.setState({ account, error: false, ...loaded })
    } catch (error) {
      if (error.status === 401) {
        this.setState(loaded)
        return
      }
      this.setState({ error, ...loaded })
    }
  }

  setProfileId = (profileId) => {
    const { account } = this.state
    const newAccount = { ...account, profileId, availableForMentoring: true }
    this.setState({ account: newAccount })
  }

  logout = () => {
    this.setState({ account: null })
    logout()
  }

  render() {
    const { account, loading, error } = this.state

    const loggedOut = account === null

    const loginButton = (
      <Link to="/login" className="App-title auth-button">
        Login
      </Link>
    )

    const logoutButton = (
      <Link to="/logout" className="App-title auth-button">
        Logout
      </Link>
    )

    const loginAction = loggedOut ? loginButton : logoutButton

    const logoImage = new URL('./assets/duke-health-logo.png', import.meta.url)

    const availableForMentoringToggle = account && (
      <div
        title="Controls whether your profile will be visible to mentees."
        className="available-for-mentoring"
      >
        Available&nbsp;for&nbsp;mentoring:
        <Toggle
          enabled={Boolean(account.profileId)}
          on={account.availableForMentoring}
          onClick={() => {
            const newAvailable = !account.availableForMentoring
            const newAccount = {
              ...account,
              availableForMentoring: newAvailable,
            }
            this.setState({ account: newAccount })
            if (account.profileId !== null) {
              setAvailabilityForMentoring(newAvailable)
            }
          }}
        />
      </div>
    )

    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <div className="header-inner">
              <nav>
                <div className="nav-left">
                  <Link to="/" className="App-title left App-logo">
                    <img src={logoImage} alt="Duke Health logo" />
                  </Link>

                  <Link to="/about" className="App-title">
                    About&nbsp;Weave
                  </Link>

                  <Link to="/expectations" className="App-title">
                    Expectations
                  </Link>

                  <Link to="/resources" className="App-title">
                    Resources
                  </Link>

                  <Link to="/help" className="App-title">
                    Help
                  </Link>

                  {account && <OwnProfileLink account={account} />}
                </div>
                <div className="nav-right">
                  {availableForMentoringToggle}
                  {loginAction}
                </div>
              </nav>
            </div>
          </header>
          {error && (
            <p className="error banner">
              Unable to communicate with server. Check your network connection
              and try again in a moment.
            </p>
          )}
          <Switch>
            <Route exact path="/" render={() => <Home account={account} />} />
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
              render={() => {
                if (account) {
                  return (
                    <CreateProfile
                      account={account}
                      setProfileId={this.setProfileId}
                    />
                  )
                }
                return loading ? null : <NotLoggedIn />
              }}
            />
            <Route
              path="/create-peer-profile"
              render={() => {
                if (account) {
                  return (
                    <CreatePeerProfile
                      account={account}
                      setProfileId={this.setProfileId}
                    />
                  )
                }
                return loading ? null : <NotLoggedIn />
              }}
            />
            <Route
              path="/edit-profile"
              render={({ history }) => {
                if (account !== null) {
                  return (
                    <EditFacultyProfile
                      account={account}
                      availableForMentoring={account.availableForMentoring}
                      setProfileId={this.setProfileId}
                      history={history}
                      profileId={account.profileId}
                    />
                  )
                }

                return loading ? null : <NotLoggedIn />
              }}
            />
            <Route
              path="/edit-student-profile"
              render={({ history }) => {
                if (account !== null) {
                  return (
                    <EditStudentProfile
                      account={account}
                      availableForMentoring={account.availableForMentoring}
                      setProfileId={this.setProfileId}
                      history={history}
                      profileId={account.profileId}
                    />
                  )
                }

                return loading ? null : <NotLoggedIn />
              }}
            />
            <Route
              path="/admin-edit-profile/:id"
              render={({ history, match }) => {
                if (account !== null) {
                  return (
                    <EditFacultyProfile
                      account={account}
                      isAdmin={account.isAdmin}
                      history={history}
                      profileId={match.params.id}
                    />
                  )
                }

                return loading ? null : <NotLoggedIn />
              }}
            />

            <Route
              path="/admin-edit-student-profile/:id"
              render={({ history, match }) => {
                if (account !== null) {
                  return (
                    <EditStudentProfile
                      account={account}
                      isAdmin={account.isAdmin}
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
                  account={account}
                />
              )}
            />
            <Route path="/browse" component={BrowseFaculty} />
            <Route path="/peer-mentorship" component={BrowsePeerMentorship} />
            <Route
              path="/login"
              render={({ history }) => <Login history={history} />}
            />

            <Route
              path="/logout"
              render={() => <Logout logout={this.logout} />}
            />

            <Route path="/expectations" component={Expectations} />
            <Route path="/mentor-expectations" component={MentorExpectations} />
            <Route path="/mentee-expectations" component={MenteeExpectations} />
            <Route path="/resources" component={Resources} />
            <Route path="/help" component={Help} />
            <Route path="/about" component={About} />

            <Route
              path="/profiles/:id"
              render={({ match }) => (
                <FacultyProfile account={account} match={match} />
              )}
            />
            <Route
              path="/peer-profiles/:id"
              render={({ match }) => (
                <StudentProfile account={account} match={match} />
              )}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
