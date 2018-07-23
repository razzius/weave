import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'

import Toggle from "react-toggle-switch"
import ReactTooltip from "react-tooltip"

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "react-toggle-switch/dist/css/switch.min.css"

import "./App.css"
import Home from "./Home"
import Browse from "./Browse"
import Login from "./Login"
import Logout from "./Logout"
import Expectations from "./Expectations"
import FacultyExpectations from "./FacultyExpectations"
import StudentExpectations from "./StudentExpectations"
import EditProfile from "./EditProfile"
import Profile from "./Profile"

import RegisterEmail from './RegisterEmail'
import CheckEmail from './CheckEmail'
import VerifyEmail from './VerifyEmail'

class App extends Component {
  state = {
    availableForMentoring: true,
    auth: null
  }

  authenticate = auth => {
    this.setState({ auth })
  }

  render() {
    const loginUrl = this.state.auth === null ? '/login' : '/logout'
    const loginOrLogout = this.state.auth === null ? 'Login' : 'Logout'

    const loginButton = <a
      href={loginUrl}
      className="App-title" style={{
        paddingTop: '1.95em',
        float: 'right',
        paddingRight: '2em'
      }}>
        {loginOrLogout}
      </a>

    return <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-inner">
            <Link to="/" className="App-title left">
              <h1>HMS Advises</h1>
            </Link>
            <a href="/#about" className="App-title">
              About
            </a>

            {loginButton}

            {
              (this.state.auth || window.location.pathname === '/edit-profile') &&
                <span
                  data-tip="Controls whether your profile will be visible to mentees."
                  className="App-title available-for-mentoring">
                  Available for mentoring:
                  <Toggle on={this.state.availableForMentoring} onClick={
                    () => this.setState({availableForMentoring: !this.state.availableForMentoring})
                  }/>
                  <ReactTooltip place="bottom"/>
                </span>
            }
          </div>
        </header>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            path="/faculty-expectations"
            component={FacultyExpectations}
          />
          <Route
            path="/student-expectations"
            component={StudentExpectations}
          />
          <Route
            path="/edit-profile"
            render={({ history }) => (
              <EditProfile
                authenticate={this.authenticate}
                history={history}
              />
            )}
          />
          <Route path="/edit-profile" render={
            ({ history }) => (
              <EditProfile authenticate={this.authenticate} history={history}/>
            )
          }/>
          <Route path="/register-email" component={RegisterEmail} />
          <Route path="/check-email" component={CheckEmail} />
          <Route path="/verify" render={
            ({ history }) => (
              <VerifyEmail authenticate={this.authenticate} history={history}/>
            )
          }/>
          <Route path="/browse" component={Browse} />
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />

          <Route path="/expectations" component={Expectations} />
          <Route
            path="/profiles/:id"
            render={props => <Profile {...props} />}
            />
          <Route component={() => <p>404 Not found</p>} />
        </Switch>
      </div>
    </Router>
  }
}

export default App
