import React, { Component } from 'react'
import 'react-select/dist/react-select.css'
import ProfileResult from './ProfileResult'
import SearchInput from './SearchInput'
import { getProfiles } from './api'
import AppScreen from './AppScreen'

function pluralizeResults(length) {
  if (length === 1) {
    return 'result'
  }
  return 'results'
}

export default class Browse extends Component {
  constructor(props) {
    super(props)

    this.state = {
      search: '',
      results: null,
      queried: false,
      error: null
    }

    getProfiles()
      .then(results => {
        this.setState({ results })
      })
      .catch(() =>
        this.setState({ error: 'Unable to load profiles. Try again later.' })
      )
  }

  handleSearch = (search) => {
    const query = search === null ? '' : this.state.search
    getProfiles(query).then(results => {
      this.setState({ results })
      if (search !== null) {
        this.setState({ queried: true })
      }
    })
  }

  handleChange = event => {
    this.setState({ search: event.target.value })
  }

  render() {
    const { error, results } = this.state
    return (
      <AppScreen>
        <SearchInput
          value={this.state.search}
          onChange={this.handleChange}
          onSubmit={this.handleSearch}
        />
        {(error !== null && error) ||
          (results === null && <p>Loading...</p>) || (
            <div>
              <p>
                Showing {this.state.results.length}{' '}
                {pluralizeResults(this.state.results.length)}.
                {" "}
                {this.state.queried && <a href="#" onClick={() => {
                  this.handleSearch(null)
                  this.setState({search: '', queried: false})
                }}>Clear search</a>}
              </p>
              <div>
                {this.state.results.map(result => (
                  <ProfileResult key={result.id} {...result} />
                ))}
              </div>
            </div>
          )}
      </AppScreen>
    )
  }
}
