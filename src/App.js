import React, { Component } from "react"
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom"

import Toggle from "react-toggle-switch"

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "react-toggle-switch/dist/css/switch.min.css"
import "bulma/css/bulma.css"

import "./App.css"
import Home from "./Home"
import Browse from "./Browse"
import Expectations from "./Expectations"
import FacultyExpectations from "./FacultyExpectations"
import StudentExpectations from "./StudentExpectations"
import EditProfile from "./EditProfile"
import Profile from "./Profile"


class App extends Component {
  state = {
    availableForMentoring: true,
    auth: null
  }

  authenticate = auth => {
    this.setState({auth})
  }

  render() {
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
            {
              this.state.auth &&
                <span className="App-title available-for-mentoring">
                Available for mentoring:
                <Toggle on={this.state.availableForMentoring} onClick={
                  () => this.setState({availableForMentoring: !this.state.availableForMentoring})
                }/>
              </span>
            }
          </div>
        </header>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            path="/student-expectations"
            component={StudentExpectations}
            />
          <Route
            path="/faculty-expectations"
            component={FacultyExpectations}
            />
          <Route path="/edit-profile" render={
            ({ history }) => (
              <EditProfile authenticate={this.authenticate} history={history}/>
            )
          }/>
          <Route path="/browse" component={Browse} />
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
