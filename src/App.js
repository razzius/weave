import React from "react"
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom"

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import "./App.css"
import Home from "./Home"
import Browse from "./Browse"
import FacultyExpectations from "./FacultyExpectations"
import StudentExpectations from "./StudentExpectations"
import EditProfile from "./EditProfile"
import Profile from "./Profile"


const App = () => (
  <Router>
    <div className="App">
      <header className="App-header">
        <div className="header-inner">
          <Link to="/" className="App-title">
            <h1>HMS Advises</h1>
          </Link>
          <a href="/#about" className="App-title">
            About
          </a>
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
        <Route path="/edit-profile" component={EditProfile} />
        <Route path="/browse" component={Browse} />
        <Route
          path="/profiles/:id"
          render={props => <Profile {...props} />}
          />
          <Route component={() => <p>404 Not found</p>} />
      </Switch>
    </div>
  </Router>
)

export default App
