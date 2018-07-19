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
      searchTerms: [],
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

  handleSearch = () => {
    const { searchTerms } = this.state
    const query = searchTerms.length === 0 ? '' : searchTerms.join(' ')
    getProfiles(query).then(results => {
      this.setState({ results })
      if (searchTerms !== null) {
        this.setState({ queried: true })
      }
    })
  }

  handleChange = tags => {
    this.setState({ searchTerms: tags.map(tag => tag.value) })
  }

  render() {
    const { error, results } = this.state
    return (
      <AppScreen>
        <SearchInput
          value={this.state.searchTerms}
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
                {this.state.queried && <button onClick={() => {
                  this.handleSearch(null)
                  this.setState({searchTerms: [], queried: false})
                }}>Clear search</button>}
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
